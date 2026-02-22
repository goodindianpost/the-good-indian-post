import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/src/lib/supabase'
import type { Article } from './useArticles'

const ARTICLE_SELECT = `
  id, title, slug, subtitle, excerpt, content, cover_image, status, featured, author_name, published_at, created_at,
  category:categories(id, name, slug, color)
`

export function useSearch(query: string) {
  const [results, setResults] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.length < 2) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)

    debounceRef.current = setTimeout(async () => {
      const pattern = `%${query}%`
      const { data } = await supabase
        .from('articles')
        .select(ARTICLE_SELECT)
        .eq('status', 'published')
        .or(`title.ilike.${pattern},excerpt.ilike.${pattern},subtitle.ilike.${pattern}`)
        .order('published_at', { ascending: false })
        .limit(10)

      setResults(data || [])
      setLoading(false)
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  return { results, loading }
}
