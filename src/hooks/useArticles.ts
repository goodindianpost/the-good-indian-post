import { useEffect, useState, useContext, createContext } from 'react'
import { supabase } from '@/src/lib/supabase'

export type Article = {
  id: string
  title: string
  slug: string
  subtitle: string | null
  excerpt: string | null
  content: any
  cover_image: string | null
  status: string
  featured: boolean
  author_name: string | null
  published_at: string | null
  created_at: string
  category: { id: string; name: string; slug: string; color: string; description: string | null } | null
}

const ARTICLE_SELECT = `
  id, title, slug, subtitle, excerpt, content, cover_image, status, featured, author_name, published_at, created_at,
  category:categories(id, name, slug, color, description)
`

// Context for preloaded data
interface PreloadedDataContextType {
  articles: Article[]
  trending: Article[]
  isReady: boolean
}

export const PreloadedDataContext = createContext<PreloadedDataContextType | null>(null)

export function useArticles() {
  const preloaded = useContext(PreloadedDataContext)
  const [articles, setArticles] = useState<Article[]>(preloaded?.articles || [])
  const [loading, setLoading] = useState(!preloaded?.isReady)

  useEffect(() => {
    // If we have preloaded data, use it
    if (preloaded?.isReady && preloaded.articles.length > 0) {
      setArticles(preloaded.articles)
      setLoading(false)
      return
    }

    // Otherwise fetch fresh
    supabase
      .from('articles')
      .select(ARTICLE_SELECT)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        setArticles(data || [])
        setLoading(false)
      })
  }, [preloaded?.isReady, preloaded?.articles])

  return { articles, loading }
}

export function useArticle(slug: string) {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('articles')
      .select(ARTICLE_SELECT)
      .eq('slug', slug)
      .eq('status', 'published')
      .single()
      .then(({ data }) => {
        setArticle(data)
        setLoading(false)
      })
  }, [slug])

  return { article, loading }
}

export function useFeaturedArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('articles')
      .select(ARTICLE_SELECT)
      .eq('status', 'published')
      .eq('featured', true)
      .order('published_at', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        setArticles(data || [])
        setLoading(false)
      })
  }, [])

  return { articles, loading }
}

export function useArticlesByCategory(categorySlug: string) {
  const preloaded = useContext(PreloadedDataContext)

  // Initialize with filtered preloaded data if available
  const initialArticles = preloaded?.isReady
    ? preloaded.articles.filter(a => a.category?.slug === categorySlug)
    : []

  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [loading, setLoading] = useState(!preloaded?.isReady)

  useEffect(() => {
    // If we have preloaded data, filter it instantly
    if (preloaded?.isReady && preloaded.articles.length > 0) {
      const filtered = preloaded.articles.filter(a => a.category?.slug === categorySlug)
      setArticles(filtered)
      setLoading(false)
      return
    }

    // Otherwise fetch fresh
    supabase
      .from('articles')
      .select(ARTICLE_SELECT)
      .eq('status', 'published')
      .eq('category.slug', categorySlug)
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        setArticles((data || []).filter(a => a.category?.slug === categorySlug))
        setLoading(false)
      })
  }, [categorySlug, preloaded?.isReady, preloaded?.articles])

  return { articles, loading }
}

export function useTrendingArticles() {
  const preloaded = useContext(PreloadedDataContext)
  const [articles, setArticles] = useState<Article[]>(preloaded?.trending || [])
  const [loading, setLoading] = useState(!preloaded?.isReady)

  useEffect(() => {
    // If we have preloaded data, use it
    if (preloaded?.isReady && preloaded.trending.length > 0) {
      setArticles(preloaded.trending)
      setLoading(false)
      return
    }

    async function fetchTrending() {
      // Get trending article IDs sorted by score
      const { data: trendingRows } = await supabase.rpc('get_trending_articles', { max_results: 5 })
      if (!trendingRows?.length) { setLoading(false); return }

      const ids = trendingRows.map((r: any) => r.id)

      // Fetch full article data with joins
      const { data } = await supabase
        .from('articles')
        .select(ARTICLE_SELECT)
        .in('id', ids)

      // Preserve the trending score order
      const byId = new Map((data || []).map((a: Article) => [a.id, a]))
      setArticles(ids.map((id: string) => byId.get(id)).filter(Boolean) as Article[])
      setLoading(false)
    }
    fetchTrending()
  }, [preloaded?.isReady, preloaded?.trending])

  return { articles, loading }
}
