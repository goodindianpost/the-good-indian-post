import { useState, useRef } from 'react'
import { Upload, X } from 'lucide-react'
import { supabase } from '@/src/lib/supabase'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const ext = file.name.split('.').pop()
    const fileName = `${Date.now()}.${ext}`

    const { data, error } = await supabase.storage.from('media').upload(fileName, file)

    if (error) {
      alert('Upload failed: ' + error.message)
    } else {
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path)
      onChange(publicUrl)
    }
    setUploading(false)
  }

  function handleRemove() {
    onChange('')
  }

  return (
    <div>
      {value ? (
        <div className="relative group">
          <img src={value} alt="Cover" className="w-full aspect-video object-cover" />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-white text-brand-red opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border border-dashed border-gray-300 aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-brand-red transition-colors"
        >
          <Upload className="text-gray-300 mb-2" size={24} />
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
            {uploading ? 'Uploading...' : 'Upload Image'}
          </p>
        </div>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
    </div>
  )
}
