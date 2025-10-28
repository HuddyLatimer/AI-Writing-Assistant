'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Download, Bookmark } from 'lucide-react'
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

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Generation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookmarks()
  }, [])

  const fetchBookmarks = async () => {
    try {
      const response = await fetch('/api/generations?bookmarked=true')
      const data = await response.json()
      setBookmarks(data)
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
      toast.error('Failed to load bookmarks')
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

  const removeBookmark = async (id: string) => {
    try {
      await fetch(`/api/generations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          is_bookmarked: false,
        }),
      })
      setBookmarks(bookmarks.filter((b) => b.id !== id))
      toast.success('Removed from bookmarks')
    } catch (error) {
      toast.error('Failed to remove bookmark')
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
      <h1 className="mb-8 text-3xl font-bold">Bookmarked Generations</h1>
      {bookmarks.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No bookmarks yet. Bookmark your favorite generations!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((gen) => (
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
                      onClick={() => removeBookmark(gen.id)}
                    >
                      <Bookmark className="h-4 w-4 fill-current" />
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
