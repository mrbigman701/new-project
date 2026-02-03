import useSWR from 'swr'

interface PageContent {
  id: string
  section_key: string
  section_name: string
  content: Record<string, any>
  last_edited_at: string
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function usePageContent() {
  const { data, error, isLoading } = useSWR<PageContent[]>('/api/admin/content', fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  return {
    content: data || [],
    isLoading,
    error,
  }
}

export function getContentByKey(content: PageContent[], key: string) {
  return content.find((item) => item.section_key === key)?.content
}
