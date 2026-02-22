import { useEffect, useState } from 'react'
import { supabase } from '@/src/lib/supabase'

type Category = {
  id: string
  name: string
  slug: string
  color: string
  description: string | null
  sort_order: number
}

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase.from('categories').select('*').order('sort_order')
      setCategories(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-sm text-gray-400 uppercase tracking-widest">Loading...</span>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Manage</p>
        <h1 className="text-3xl font-bold text-brand-black tracking-tight">Categories</h1>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white border border-gray-200 px-6 py-16 text-center">
          <p className="text-gray-400 text-sm">No categories found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white border border-gray-200 p-6 group hover:border-brand-red transition-colors">
              <div className="flex items-start justify-between mb-4">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                <span className="text-xs text-gray-300 font-medium">#{cat.sort_order}</span>
              </div>
              <h3 className="text-lg font-bold text-brand-black tracking-tight mb-1">{cat.name}</h3>
              <p className="text-xs text-gray-400 mb-3">/{cat.slug}</p>
              {cat.description && (
                <p className="text-sm text-gray-500 font-serif leading-relaxed line-clamp-2">{cat.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
