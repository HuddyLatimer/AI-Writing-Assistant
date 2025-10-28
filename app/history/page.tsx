'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Download, Trash2, Bookmark } from 'lucide-react'
import { toast } from 'sonner'

interface Generation {
  id: string
  created_at: string
  mode: string
  prompt: string
  output: string
  tokens_used: number
  is_bookmarked: boolean
}

export default function HistoryPage() {
  const [generations, setGenerations] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGenerations()
  }, [])

  const fetchGenerations = async () => {
    try {
      const response = await fetch('/api/generations')
      const data = await response.json()
      setGenerations(data)
    } catch (error) {
      console.error('Error fetching generations:', error)
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy')
    }
  }

  const exportContent = (output: string, mode: string) => {
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${mode}-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Exported successfully')
  }

  const deleteGeneration = async (id: string) => {
    try {
      await fetch(`/api/generations/${id}`, {
        method: 'DELETE',
      })
      setGenerations(generations.filter((g) => g.id !== id))
      toast.success('Deleted successfully')
    } catch (error) {
      toast.error('Failed to delete')
    }
  }

  const toggleBookmark = async (id: string, isBookmarked: boolean) => {
    try {
      await fetch(`/api/generations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_bookmarked: !isBookmarked,
        }),
      })
      setGenerations(
        generations.map((g) =>
          g.id === id ? { ...g, is_bookmarked: !isBookmarked } : g
        )
      )
      toast.success(isBookmarked ? 'Removed from bookmarks' : 'Bookmarked')
    } catch (error) {
      toast.error('Failed to update bookmark')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <h1 className="mb-8 text-3xl font-bold">Generation History</h1>
      {generations.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No generations yet. Create your first one!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {generations.map((gen) => (
            <Card key={gen.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg capitalize">
                      {gen.mode.replace('-', ' ')}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(gen.created_at).toLocaleString()} • {gen.tokens_used}{' '}
                      tokens
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleBookmark(gen.id, gen.is_bookmarked)}
                    >
                      <Bookmark
                        className={`h-4 w-4 ${
                          gen.is_bookmarked ? 'fill-current' : ''
                        }`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(gen.output)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => exportContent(gen.output, gen.mode)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteGeneration(gen.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-semibold">Prompt:</h4>
                  <p className="text-sm text-muted-foreground">{gen.prompt}</p>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-semibold">Output:</h4>
                  <div className="whitespace-pre-wrap rounded-lg border bg-muted p-4 text-sm">
                    {gen.output}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
