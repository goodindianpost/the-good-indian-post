import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEditor, EditorContent } from '@tiptap/react'
import { generateHTML } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Save, ArrowLeft, Bold, Italic, List, ListOrdered, Quote, Heading2, Heading3, Minus, Eye, PenLine } from 'lucide-react'
import { supabase } from '@/src/lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { ImageUpload } from '../components/ImageUpload'

type Category = { id: string; name: string; color: string }

function renderContent(content: any): string {
  if (!content) return ''
  if (typeof content === 'string') return content
  try {
    return generateHTML(content, [StarterKit])
  } catch {
    return ''
  }
}

export function ArticleEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isNew = !id || id === 'new'

  const [tab, setTab] = useState<'editor' | 'preview'>('editor')
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [status, setStatus] = useState('draft')
  const [featured, setFeatured] = useState(false)
  const [coverImage, setCoverImage] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [featuredCount, setFeaturedCount] = useState(0)

  const [, forceUpdate] = useState(0)
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing your article...' }),
    ],
    editorProps: {
      attributes: { class: 'prose max-w-none min-h-[400px] focus:outline-none font-serif' },
    },
    onTransaction: () => forceUpdate(n => n + 1),
  })

  useEffect(() => {
    supabase.from('categories').select('id, name, color').order('sort_order').then(({ data }) => {
      setCategories(data || [])
    })
    supabase.from('articles').select('id', { count: 'exact', head: true }).eq('featured', true).then(({ count }) => {
      setFeaturedCount(count ?? 0)
    })

    if (!isNew) {
      supabase.from('articles').select('*').eq('id', id).single().then(({ data }) => {
        if (data) {
          setTitle(data.title)
          setSlug(data.slug)
          setExcerpt(data.excerpt || '')
          setCategoryId(data.category_id || '')
          setAuthorName(data.author_name || '')
          setStatus(data.status)
          setFeatured(data.featured)
          setCoverImage(data.cover_image || '')
          if (data.content && editor) {
            editor.commands.setContent(data.content)
          }
        }
      })
    }
  }, [id, isNew, editor])

  function generateSlug(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  async function handleSave() {
    if (!title.trim()) return alert('Title is required')
    setSaving(true)

    const articleData = {
      title,
      slug: slug || generateSlug(title) + '-' + Math.random().toString(36).slice(2, 8),
      excerpt,
      content: editor?.getJSON(),
      category_id: categoryId || null,
      author_name: authorName || null,
      status,
      featured,
      cover_image: coverImage || null,
      author_id: user?.id,
    }

    if (isNew) {
      const { error } = await supabase.from('articles').insert(articleData)
      if (error) alert(error.message)
      else navigate('/admin/articles')
    } else {
      const { error } = await supabase.from('articles').update(articleData).eq('id', id)
      if (error) alert(error.message)
      else navigate('/admin/articles')
    }
    setSaving(false)
  }

  const ToolbarButton = ({ onClick, active, children }: { onClick: () => void; active?: boolean; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`p-2 transition-colors cursor-pointer ${active ? 'bg-brand-red text-white' : 'text-gray-500 hover:text-brand-black hover:bg-gray-100'}`}
    >
      {children}
    </button>
  )

  const selectedCategory = categories.find(c => c.id === categoryId)

  return (
    <div>
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-10">
        <button onClick={() => navigate('/admin/articles')} className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-brand-black transition-colors">
          <ArrowLeft size={14} /> Back to Articles
        </button>
        <div className="flex items-center gap-4">
          {/* Tabs */}
          <div className="flex border border-gray-200">
            <button
              onClick={() => setTab('editor')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${tab === 'editor' ? 'bg-brand-black text-white' : 'text-gray-400 hover:text-brand-black'}`}
            >
              <PenLine size={13} /> Editor
            </button>
            <button
              onClick={() => setTab('preview')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-colors ${tab === 'preview' ? 'bg-brand-black text-white' : 'text-gray-400 hover:text-brand-black'}`}
            >
              <Eye size={13} /> Preview
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 text-sm font-semibold uppercase tracking-wider hover:bg-brand-black transition-colors disabled:opacity-50"
          >
            <Save size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Editor Tab */}
      {tab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main Content */}
          <div className="space-y-6">
            {/* Title */}
            <div className="bg-white border border-gray-200 px-6 py-5">
              <input
                type="text"
                placeholder="Article Title"
                value={title}
                onChange={e => { setTitle(e.target.value); if (isNew) setSlug(generateSlug(e.target.value)) }}
                className="w-full text-2xl font-bold text-brand-black tracking-tight placeholder:text-gray-300 focus:outline-none"
              />
            </div>

            {/* Editor */}
            <div className="bg-white border border-gray-200">
              {editor && (
                <div className="flex items-center gap-0.5 px-4 py-2 border-b border-gray-200 bg-gray-50">
                  <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')}><Bold size={15} /></ToolbarButton>
                  <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')}><Italic size={15} /></ToolbarButton>
                  <div className="w-px h-5 bg-gray-200 mx-1" />
                  <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })}><Heading2 size={15} /></ToolbarButton>
                  <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })}><Heading3 size={15} /></ToolbarButton>
                  <div className="w-px h-5 bg-gray-200 mx-1" />
                  <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')}><List size={15} /></ToolbarButton>
                  <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')}><ListOrdered size={15} /></ToolbarButton>
                  <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')}><Quote size={15} /></ToolbarButton>
                  <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus size={15} /></ToolbarButton>
                </div>
              )}
              <div className="px-6 py-5">
                <EditorContent editor={editor} />
              </div>
            </div>

            {/* Excerpt */}
            <div className="bg-white border border-gray-200 px-6 py-5">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Excerpt</label>
              <textarea
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                rows={3}
                className="w-full text-sm text-brand-black font-serif leading-relaxed placeholder:text-gray-300 focus:outline-none resize-none"
                placeholder="Brief summary of the article..."
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cover Image */}
            <div className="bg-white border border-gray-200 px-6 py-5">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Cover Image</label>
              <ImageUpload value={coverImage} onChange={setCoverImage} />
            </div>

            {/* Author Name */}
            <div className="bg-white border border-gray-200 px-6 py-5">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Author Name</label>
              <input
                type="text"
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                placeholder="e.g. Staff Writer"
                className="w-full text-sm text-brand-black border border-gray-200 px-3 py-2 focus:outline-none focus:border-brand-red transition-colors"
              />
            </div>

            {/* Category */}
            <div className="bg-white border border-gray-200 px-6 py-5">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Category</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full text-sm text-brand-black border border-gray-200 px-3 py-2 focus:outline-none focus:border-brand-red transition-colors"
              >
                <option value="">Select category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Status */}
            <div className="bg-white border border-gray-200 px-6 py-5">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full text-sm text-brand-black border border-gray-200 px-3 py-2 focus:outline-none focus:border-brand-red transition-colors"
              >
                <option value="draft">Draft</option>
                <option value="review">In Review</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Featured */}
            <div className="bg-white border border-gray-200 px-6 py-5">
              <label className={`flex items-center gap-3 ${!featured && featuredCount >= 5 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={e => {
                      if (e.target.checked && featuredCount >= 5) return
                      setFeatured(e.target.checked)
                    }}
                    disabled={!featured && featuredCount >= 5}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-checked:bg-brand-red transition-colors" />
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white transition-transform peer-checked:translate-x-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Featured Article</span>
                  {!featured && featuredCount >= 5 && (
                    <span className="text-xs text-brand-red mt-0.5 block">Max 5 featured articles reached</span>
                  )}
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {tab === 'preview' && (
        <div className="bg-white border border-gray-200">
          <article className="max-w-screen-md mx-auto px-6 py-16">
            {/* Category */}
            {selectedCategory && (
              <span className="inline-block text-gray-500 font-semibold uppercase tracking-wider text-xs mb-6">
                {selectedCategory.name}
              </span>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-brand-black mb-6 leading-tight">
              {title || 'Untitled Article'}
            </h1>

            {/* Excerpt */}
            {excerpt && (
              <p className="text-xl text-gray-500 font-serif leading-relaxed mb-8 max-w-2xl">
                {excerpt}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center gap-8 py-4 mb-10 border-t border-b border-gray-200">
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Status</span>
                <span className="font-display text-sm capitalize">{status}</span>
              </div>
              {featured && (
                <div>
                  <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Featured</span>
                  <span className="font-display text-sm text-brand-red">Yes</span>
                </div>
              )}
            </div>

            {/* Cover Image */}
            {coverImage && (
              <div className="aspect-[16/9] w-full bg-gray-100 overflow-hidden mb-12">
                <img src={coverImage} alt={title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Content */}
            <div className="article-content" dangerouslySetInnerHTML={{ __html: renderContent(editor?.getJSON()) }} />

            {/* Empty state */}
            {!editor?.getJSON()?.content?.length && (
              <p className="text-gray-300 font-serif text-xl italic">No content yet. Switch to the Editor tab to start writing.</p>
            )}
          </article>
        </div>
      )}
    </div>
  )
}
