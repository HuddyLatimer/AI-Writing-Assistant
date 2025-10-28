'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Copy,
  Download,
  RefreshCw,
  Bookmark,
  Save,
  Mail,
  FileText,
  Hash,
  Code,
  Package,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const WRITING_MODES = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'blog-post', label: 'Blog Post', icon: FileText },
  { value: 'social-media', label: 'Social Media Caption', icon: Hash },
  { value: 'code-comments', label: 'Code Comments', icon: Code },
  { value: 'product-description', label: 'Product Description', icon: Package },
]

export default function WritingGenerator() {
  const [mode, setMode] = useState('email')
  const [prompt, setPrompt] = useState('')
  const [completion, setCompletion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [tokensUsed, setTokensUsed] = useState(0)
  const [currentGenerationId, setCurrentGenerationId] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const { toast } = useToast()

  const estimateTokens = (text: string) => {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4)
  }

  const generateContent = useCallback(async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    setCompletion('')
    setCurrentGenerationId(null)
    setIsBookmarked(false)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, mode }),
      })

      if (!response.ok) throw new Error('Failed to generate content')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullText = ''

      console.log('Reader:', reader)
      console.log('Response body:', response.body)

      if (reader) {
        let chunkCount = 0
        while (true) {
          const { done, value } = await reader.read()
          console.log('Read iteration:', { done, valueLength: value?.length })

          if (done) {
            console.log('Stream done after', chunkCount, 'chunks')
            break
          }

          const text = decoder.decode(value, { stream: true })
          console.log('Chunk #' + (++chunkCount) + ':', text)
          fullText += text
          setCompletion((prev) => {
            console.log('Setting completion, prev length:', prev.length, 'new text:', text)
            return prev + text
          })
        }
      } else {
        console.error('No reader available!')
      }

      console.log('Full text received (length: ' + fullText.length + '):', fullText)
      console.log('Completion state:', completion)

      const tokens = estimateTokens(prompt + fullText)
      setTokensUsed((prev) => prev + tokens)

      toast({
        title: 'Success',
        description: 'Content generated successfully!',
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Error',
        description: 'Failed to generate content',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }, [prompt, mode, toast])

  const saveGeneration = async () => {
    if (!completion) return

    try {
      const response = await fetch('/api/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode,
          prompt,
          output: completion,
          tokens_used: estimateTokens(prompt + completion),
        }),
      })

      const data = await response.json()
      setCurrentGenerationId(data.id)

      toast({
        title: 'Saved',
        description: 'Generation saved to history',
      })
    } catch (error) {
      console.error('Error saving:', error)
      toast({
        title: 'Error',
        description: 'Failed to save generation',
        variant: 'destructive',
      })
    }
  }

  const toggleBookmark = async () => {
    if (!currentGenerationId) {
      await saveGeneration()
      return
    }

    try {
      await fetch(`/api/generations/${currentGenerationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_bookmarked: !isBookmarked,
        }),
      })

      setIsBookmarked(!isBookmarked)

      toast({
        title: isBookmarked ? 'Removed from bookmarks' : 'Bookmarked',
        description: isBookmarked
          ? 'Removed from your bookmarks'
          : 'Added to your bookmarks',
      })
    } catch (error) {
      console.error('Error bookmarking:', error)
      toast({
        title: 'Error',
        description: 'Failed to bookmark',
        variant: 'destructive',
      })
    }
  }

  const copyToClipboard = async () => {
    if (!completion) return

    try {
      await navigator.clipboard.writeText(completion)
      toast({
        title: 'Copied',
        description: 'Content copied to clipboard',
      })
    } catch (error) {
      console.error('Error copying:', error)
      toast({
        title: 'Error',
        description: 'Failed to copy content',
        variant: 'destructive',
      })
    }
  }

  const exportContent = (format: 'md' | 'txt') => {
    if (!completion) return

    const blob = new Blob([completion], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `generated-content.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: 'Exported',
      description: `Content exported as .${format}`,
    })
  }

  const characterCount = completion.length
  const wordCount = completion.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Writing Mode</label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WRITING_MODES.map(({ value, label, icon: Icon }) => (
                  <SelectItem key={value} value={value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Your Prompt
              <span className="ml-2 text-xs text-muted-foreground">
                {prompt.length} characters
              </span>
            </label>
            <Textarea
              placeholder="Enter your prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              disabled={isLoading}
            />
          </div>

          <Button
            onClick={generateContent}
            disabled={isLoading || !prompt.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Content'
            )}
          </Button>
        </CardContent>
      </Card>

      {completion && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Content</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleBookmark}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                >
                  <Bookmark
                    className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`}
                  />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={saveGeneration}
                  title="Save to history"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => exportContent('md')}
                  title="Export as Markdown"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={generateContent}
                  title="Regenerate"
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap rounded-lg border bg-muted p-4">
              {completion}
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex gap-4">
                <span>{characterCount} characters</span>
                <span>{wordCount} words</span>
                <span>~{estimateTokens(completion)} tokens</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => exportContent('txt')}
              >
                Export as .txt
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            Total tokens used this session: <strong>{tokensUsed}</strong>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
