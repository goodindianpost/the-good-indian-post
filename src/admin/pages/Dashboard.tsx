import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Eye, PenLine, Plus, ArrowRight, Clock, TrendingUp } from 'lucide-react'
import { supabase } from '@/src/lib/supabase'

type RecentArticle = {
  id: string
  title: string
  status: string
  created_at: string
  category: { name: string } | null
}

export function Dashboard() {
  const [stats, setStats] = useState({ articles: 0, published: 0, drafts: 0, views: 0 })
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [articles, published, drafts, views, recent] = await Promise.all([
        supabase.from('articles').select('id', { count: 'exact', head: true }),
        supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('articles').select('view_count'),
        supabase.from('articles')
          .select('id, title, status, created_at, category:categories(name)')
          .order('created_at', { ascending: false })
          .limit(5),
      ])
      const totalViews = (views.data || []).reduce((sum: number, a: any) => sum + (a.view_count || 0), 0)
      setStats({
        articles: articles.count ?? 0,
        published: published.count ?? 0,
        drafts: drafts.count ?? 0,
        views: totalViews,
      })
      setRecentArticles(recent.data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  const statCards = [
    { label: 'Total Articles', value: stats.articles, icon: FileText, link: '/admin/articles' },
    { label: 'Published', value: stats.published, icon: Eye, link: '/admin/articles' },
    { label: 'Drafts', value: stats.drafts, icon: PenLine, link: '/admin/articles' },
    { label: 'Total Views', value: stats.views.toLocaleString(), icon: TrendingUp, link: '/admin/articles' },
  ]

  const statusColors: Record<string, string> = {
    draft: 'text-gray-500 bg-gray-100',
    review: 'text-yellow-700 bg-yellow-50',
    published: 'text-green-700 bg-green-50',
    archived: 'text-red-700 bg-red-50',
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="flex justify-between items-end mb-10">
          <div>
            <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-40 bg-gray-200 rounded" />
          </div>
          <div className="h-10 w-36 bg-gray-200 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 p-6">
              <div className="h-5 w-5 bg-gray-200 rounded mb-4" />
              <div className="h-8 w-16 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-24 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
        <div className="bg-white border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="h-3 w-32 bg-gray-200 rounded" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex-1">
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-1/3 bg-gray-100 rounded" />
              </div>
              <div className="h-6 w-16 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6 md:mb-10">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Overview</p>
          <h1 className="text-2xl md:text-3xl font-bold text-brand-black tracking-tight">Dashboard</h1>
        </div>
        <Link
          to="/admin/articles/new"
          className="flex items-center justify-center gap-2 bg-brand-red text-white px-5 py-2.5 text-sm font-semibold uppercase tracking-wider hover:bg-brand-black transition-colors"
        >
          <Plus size={16} /> New Article
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-8 md:mb-12">
        {statCards.map(({ label, value, icon: Icon, link }) => (
          <Link key={label} to={link} className="group bg-white border border-gray-200 p-4 md:p-6 hover:border-brand-red transition-colors">
            <div className="flex items-start justify-between mb-2 md:mb-4">
              <Icon size={18} className="text-gray-400 group-hover:text-brand-red transition-colors" />
              <ArrowRight size={14} className="text-gray-300 group-hover:text-brand-red transition-colors hidden sm:block" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-brand-black tracking-tight">{value}</p>
            <p className="text-[10px] md:text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent Articles */}
      <div className="bg-white border border-gray-200">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recent Articles</h2>
          </div>
          <Link to="/admin/articles" className="text-xs font-semibold text-brand-red uppercase tracking-wider hover:text-brand-black transition-colors">
            View All
          </Link>
        </div>
        {recentArticles.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-400 text-sm">No articles yet</p>
            <Link to="/admin/articles/new" className="text-brand-red text-sm font-semibold mt-2 inline-block hover:text-brand-black transition-colors">
              Create your first article
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentArticles.map((article) => (
              <Link
                key={article.id}
                to={`/admin/articles/${article.id}`}
                className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-brand-black text-sm tracking-tight group-hover:text-brand-red transition-colors truncate">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    {article.category && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="w-1 h-1 rounded-full bg-brand-red" />
                        {article.category.name}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 ${statusColors[article.status] || 'text-gray-500 bg-gray-100'}`}>
                  {article.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
