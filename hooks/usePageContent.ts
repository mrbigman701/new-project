"use client"

// This hook fetches page content from the API - NO SWR DEPENDENCY
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
    let mounted = true
    
    async function fetchData() {
      try {
        const res = await fetch('/api/admin/content')
        if (!res.ok) throw new Error('Failed to fetch')
        const json = await res.json()
        if (mounted) setData(json || [])
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e : new Error('Unknown'))
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    
    fetchData()
    return () => { mounted = false }
  }, [])

  return { content: data, isLoading, error }
}

export function getContentByKey(content: PageContent[], key: string) {
  return content?.find((item) => item.section_key === key)?.content || null
}
