"use client"
// Fixed: Using native React hooks instead of SWR
import { useEffect, useState } from 'react'

interface PageContent {
  id: string
  section_key: string
  section_name: string
  content: Record<string, any>
  last_edited_at: string
}

export function usePageContent() {
  const [data, setData] = useState<PageContent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/admin/content')
        if (!response.ok) throw new Error('Failed to fetch content')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        setIsLoading(false)
      }
    }
    fetchContent()
  }, [])

  return { content: data, isLoading, error }
}

export function getContentByKey(content: PageContent[], key: string) {
  return content.find((item) => item.section_key === key)?.content
}
