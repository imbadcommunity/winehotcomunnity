'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Save, ArrowLeft, Loader2, ImagePlus } from 'lucide-react'
import Link from 'next/link'

export default function NovoCursoPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)

    const { data, error } = await supabase.from('courses').insert({
      title: title.trim(),
      description: description.trim() || null,
      thumbnail_url: thumbnailUrl.trim() || null,
      published,
    }).select().single()

    if (data && !error) {
      router.push(`/admin/cursos/${data.id}`)
    }
    setLoading(false)
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/cursos" className="btn-ghost p-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Novo Curso</h1>
          <p className="text-white/40">Preencha as informações do curso</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card-glass p-8 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-white/60 mb-2">
            Título do Curso *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-dark"
            placeholder="Ex: Masterclass em Vinhos"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-white/60 mb-2">
            Descrição
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-dark resize-none min-h-[120px]"
            placeholder="Descreva o conteúdo do curso..."
          />
        </div>

        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium text-white/60 mb-2">
            URL da Thumbnail
          </label>
          <div className="flex gap-3">
            <input
              id="thumbnail"
              type="url"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="input-dark flex-1"
              placeholder="https://..."
            />
          </div>
          {thumbnailUrl && (
            <div className="mt-3 rounded-xl overflow-hidden border border-white/5 max-w-xs">
              <img src={thumbnailUrl} alt="Preview" className="w-full aspect-video object-cover" />
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setPublished(!published)}
            className={`relative w-12 h-7 rounded-full transition-colors ${
              published ? 'bg-green-500' : 'bg-dark-400'
            }`}
          >
            <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${
              published ? 'translate-x-5' : ''
            }`} />
          </button>
          <label className="text-sm text-white/60">
            {published ? 'Publicado' : 'Rascunho'}
          </label>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="btn-primary py-3 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Criar Curso
          </button>
        </div>
      </form>
    </div>
  )
}
