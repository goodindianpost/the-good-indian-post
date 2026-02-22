export type ArticleData = {
  slug: string
  title: string
  excerpt?: string | null
  content?: any
  imageUrl?: string
  cover_image?: string | null
  category?: string | { name: string; slug: string; color: string } | null
  author?: string | { full_name: string } | null
  author_name?: string | null
  publishDate?: string
  published_at?: string | null
  created_at?: string
}

export function getContentPreview(content: any): string {
  if (!content) return ''
  if (typeof content === 'string') {
    return content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  }
  if (content.type === 'doc' && content.content) {
    const texts: string[] = []
    for (const node of content.content) {
      if (node.type === 'paragraph' && node.content) {
        const t = node.content.map((c: any) => c.text || '').join('')
        if (t) texts.push(t)
      }
      if (texts.join(' ').length > 200) break
    }
    return texts.join(' ')
  }
  return ''
}

export function normalizeArticle(article: ArticleData) {
  return {
    categoryName: typeof article.category === 'string' ? article.category : article.category?.name || '',
    categoryColor: '#FF1001',
    imageUrl: article.imageUrl || article.cover_image || '',
    authorName: article.author_name || (typeof article.author === 'string' ? article.author : article.author?.full_name || ''),
    publishDate: article.publishDate || article.published_at || article.created_at || '',
  }
}
