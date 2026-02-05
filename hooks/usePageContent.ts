"use client"

// UPDATED: This hook uses native React hooks - NO SWR dependency
// Last modified: 2026-02-05 - Complete rewrite to fix build issues

import { useEffect, useState } from 'react'

export interface PageContent {
  id: string
  section_key: string
  section_name: string
  content: Record<string, any>
  last_edited_at: string
}

export function usePageContent() {
  const [pageContent, setPageContent] = useState<PageContent[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [fetchError, setFetchError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true
    
    async function loadContent() {
      try {
        setLoading(true)
        const res = await fetch('/api/admin/content')
        if (!res.ok) {
          throw new Error('Content fetch failed')
        }
        const json = await res.json()
        if (isMounted) {
          setPageContent(json || [])
        }
      } catch (e) {
        if (isMounted) {
          setFetchError(e instanceof Error ? e : new Error('Unknown error'))
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    loadContent()
    
    return () => {
      isMounted = false
    }
  }, [])

  return { 
    content: pageContent, 
    isLoading: loading, 
    error: fetchError 
  }
}

export function getContentByKey(contentArray: PageContent[], sectionKey: string) {
  if (!contentArray || !Array.isArray(contentArray)) return null
  const found = contentArray.find((item) => item.section_key === sectionKey)
  return found?.content || null
}
