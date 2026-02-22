import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Edit, Trash2, Star, ChevronDown, Eye, Search, X } from 'lucide-react'
import { supabase } from '@/src/lib/supabase'

type Category = { id: string; name: string }

type Article = {
  id: string
  title: string
  slug: string
  status: string
  featured: boolean
  category_id: string | null
  view_count: number
  created_at: string
  author_name: string | null
  category: { name: string; color: string } | null
}

export function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterFeatured, setFilterFeatured] = useState('')

  useEffect(() => {
    Promise.all([fetchArticles(), fetchCategories()])
  }, [])

  async function fetchArticles() {
    const { data } = await supabase
      .from('articles')
      .select('id, title, slug, status, featured, category_id, view_count, author_name, created_at, category:categories(name, color)')
      .order('created_at', { ascending: false })
    setArticles(data || [])
    setLoading(false)
  }

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('id, name').order('sort_order')
    setCategories(data || [])
  }

  const featuredCount = articles.filter(a => a.featured).length

  const filteredArticles = articles.filter(a => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false
    if (filterStatus && a.status !== filterStatus) return false
    if (filterCategory && (a.category_id || '') !== filterCategory) return false
    if (filterFeatured === 'yes' && !a.featured) return false
    if (filterFeatured === 'no' && a.featured) return false
    return true
  })

  const hasFilters = search || filterStatus || filterCategory || filterFeatured

  function clearFilters() {
    setSearch('')
    setFilterStatus('')
    setFilterCategory('')
    setFilterFeatured('')
  }

  async function updateArticle(id: string, updates: Partial<{ status: string; category_id: string | null; featured: boolean }>) {
    if (updates.featured && featuredCount >= 5) return
    const { error } = await supabase.from('articles').update(updates).eq('id', id)
    if (error) return
    await fetchArticles()
  }

  async function deleteArticle(id: string) {
    if (!confirm('Are you sure you want to delete this article?')) return
    await supabase.from('articles').delete().eq('id', id)
    setArticles(articles.filter(a => a.id !== id))
  }

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'review', label: 'In Review' },
    { value: 'published', label: 'Published' },
    { value: 'archived', label: 'Archived' },
  ]

  const statusStyles: Record<string, string> = {
    draft: 'text-gray-600 border-gray-200',
    review: 'text-yellow-700 border-yellow-300',
    published: 'text-green-700 border-green-300',
    archived: 'text-red-700 border-red-300',
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-32 bg-gray-200 rounded" />
          </div>
          <div className="h-10 w-36 bg-gray-200 rounded" />
        </div>
        <div className="flex gap-3 mb-6">
          <div className="flex-1 h-10 bg-gray-200 rounded" />
          <div className="h-10 w-28 bg-gray-200 rounded" />
          <div className="h-10 w-28 bg-gray-200 rounded" />
          <div className="h-10 w-20 bg-gray-200 rounded" />
        </div>
        <div className="bg-white border border-gray-200">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
              <div className="flex-1">
                <div className="h-4 w-2/3 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-1/4 bg-gray-100 rounded" />
              </div>
              <div className="h-6 w-20 bg-gray-100 rounded" />
              <div className="h-6 w-16 bg-gray-100 rounded" />
              <div className="h-4 w-10 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Manage</p>
          <h1 className="text-3xl font-bold text-brand-black tracking-tight">Articles</h1>
        </div>
        <Link
          to="/admin/articles/new"
          className="flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 text-sm font-semibold uppercase tracking-wider hover:bg-brand-black transition-colors"
        >
          <Plus size={16} /> New Article
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full text-sm bg-white border border-gray-200 pl-9 pr-3 py-2 focus:outline-none focus:border-brand-red transition-colors"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs bg-white border border-gray-200 pl-3 pr-8 py-2.5 focus:outline-none focus:border-brand-red transition-colors cursor-pointer appearance-none"
          >
            <option value="">All Statuses</option>
            {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Category filter */}
        <div className="relative">
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="text-xs bg-white border border-gray-200 pl-3 pr-8 py-2.5 focus:outline-none focus:border-brand-red transition-colors cursor-pointer appearance-none"
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Featured filter */}
        <div className="relative">
          <select
            value={filterFeatured}
            onChange={e => setFilterFeatured(e.target.value)}
            className="text-xs bg-white border border-gray-200 pl-3 pr-8 py-2.5 focus:outline-none focus:border-brand-red transition-colors cursor-pointer appearance-none"
          >
            <option value="">All</option>
            <option value="yes">Featured</option>
            <option value="no">Not Featured</option>
          </select>
          <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>

        {/* Clear filters */}
        {hasFilters && (
          <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-brand-red transition-colors cursor-pointer px-2">
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {articles.length === 0 ? (
        <div className="bg-white border border-gray-200 px-6 py-16 text-center">
          <p className="text-gray-400 text-sm mb-2">No articles yet</p>
          <Link to="/admin/articles/new" className="text-brand-red text-sm font-semibold hover:text-brand-black transition-colors">
            Create your first article
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-gray-200">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[1fr_150px_120px_70px_120px_100px_80px] gap-4 px-6 py-3 border-b border-gray-200 bg-gray-50">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Views</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Featured</span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Actions</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-100">
            {filteredArticles.length === 0 && (
              <div className="px-6 py-12 text-center">
                <p className="text-sm text-gray-400">No articles match your filters</p>
              </div>
            )}
            {filteredArticles.map(article => (
              <div key={article.id} className="group grid grid-cols-1 md:grid-cols-[1fr_150px_120px_70px_120px_100px_80px] gap-2 md:gap-4 items-center px-6 py-3.5 hover:bg-gray-50 transition-colors">
                {/* Title + Author */}
                <div className="min-w-0">
                  <Link to={`/admin/articles/${article.id}`} className="font-semibold text-sm text-brand-black tracking-tight hover:text-brand-red transition-colors truncate block">
                    {article.title}
                  </Link>
                  <span className="text-xs text-gray-400">{article.author_name || '--'}</span>
                </div>

                {/* Category — inline select */}
                <div className="relative">
                  <select
                    value={article.category_id || ''}
                    onChange={e => updateArticle(article.id, { category_id: e.target.value || null })}
                    className="w-full text-xs text-gray-600 bg-white border border-gray-200 hover:border-gray-300 focus:border-brand-red focus:outline-none pl-2 pr-7 py-1.5 transition-colors cursor-pointer appearance-none"
                  >
                    <option value="">None</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                {/* Status — inline select */}
                <div className="relative">
                  <select
                    value={article.status}
                    onChange={e => updateArticle(article.id, { status: e.target.value })}
                    className={`w-full text-xs font-medium border pl-2 pr-7 py-1.5 focus:outline-none focus:border-brand-red transition-colors cursor-pointer appearance-none ${statusStyles[article.status] || 'text-gray-600 border-gray-200'}`}
                  >
                    {statusOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                {/* Views */}
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Eye size={12} />
                  {article.view_count.toLocaleString()}
                </div>

                {/* Date */}
                <div className="text-xs text-gray-400">
                  {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>

                {/* Featured — inline toggle */}
                <div className="flex justify-center">
                  <button
                    onClick={() => updateArticle(article.id, { featured: !article.featured })}
                    disabled={!article.featured && featuredCount >= 5}
                    className={`p-1.5 transition-colors ${article.featured ? 'text-brand-red' : featuredCount >= 5 ? 'text-gray-200 cursor-not-allowed' : 'text-gray-300 hover:text-gray-400'}`}
                    title={article.featured ? 'Remove from featured' : featuredCount >= 5 ? 'Max 5 featured articles' : 'Mark as featured'}
                  >
                    <Star size={15} fill={article.featured ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                  <Link to={`/admin/articles/${article.id}`} className="p-1.5 text-gray-400 hover:text-brand-black transition-colors">
                    <Edit size={15} />
                  </Link>
                  <button onClick={() => deleteArticle(article.id)} className="p-1.5 text-gray-400 hover:text-brand-red transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
