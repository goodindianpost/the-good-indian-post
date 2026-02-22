import { useEffect, useState, useRef } from 'react'
import { Upload, Trash2, Copy, Check, Image } from 'lucide-react'
import { supabase } from '@/src/lib/supabase'

type MediaItem = {
  name: string
  url: string
  created_at: string
}

export function MediaLibrary() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMedia()
  }, [])

  async function fetchMedia() {
    const { data } = await supabase.storage.from('media').list('', { sortBy: { column: 'created_at', order: 'desc' } })
    if (data) {
      const items = data
        .filter(f => f.name !== '.emptyFolderPlaceholder')
        .map(f => ({
          name: f.name,
          url: supabase.storage.from('media').getPublicUrl(f.name).data.publicUrl,
          created_at: f.created_at || '',
        }))
      setMedia(items)
    }
    setLoading(false)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files?.length) return

    setUploading(true)
    for (const file of Array.from(files)) {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      await supabase.storage.from('media').upload(fileName, file)
    }
    await fetchMedia()
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  async function handleDelete(name: string) {
    if (!confirm('Delete this image?')) return
    await supabase.storage.from('media').remove([name])
    setMedia(media.filter(m => m.name !== name))
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

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
      <div className="flex justify-between items-end mb-10">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Manage</p>
          <h1 className="text-3xl font-bold text-brand-black tracking-tight">Media Library</h1>
        </div>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 text-sm font-semibold uppercase tracking-wider hover:bg-brand-black transition-colors disabled:opacity-50"
        >
          <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload'}
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
      </div>

      {media.length === 0 ? (
        <div className="bg-white border border-gray-200 px-6 py-16 text-center">
          <Image size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm mb-2">No media uploaded yet</p>
          <button onClick={() => inputRef.current?.click()} className="text-brand-red text-sm font-semibold hover:text-brand-black transition-colors">
            Upload your first image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {media.map(item => (
            <div key={item.name} className="bg-white border border-gray-200 overflow-hidden group relative hover:border-brand-red transition-colors">
              <div className="aspect-square bg-gray-100">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
              </div>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => copyUrl(item.url)} className="p-2.5 bg-white text-brand-black hover:bg-gray-100 transition-colors" title="Copy URL">
                  {copied === item.url ? <Check size={15} className="text-green-600" /> : <Copy size={15} />}
                </button>
                <button onClick={() => handleDelete(item.name)} className="p-2.5 bg-white text-brand-red hover:bg-gray-100 transition-colors" title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
              <div className="px-3 py-2 border-t border-gray-100">
                <p className="text-xs text-gray-400 truncate">{item.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
