'use client'
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Save, ArrowLeft, Loader2, Plus, Trash2, GripVertical, Video, BookOpen } from 'lucide-react'
import Link from 'next/link'
import type { Course, Module, Lesson } from '@/types/database'

export default function EditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const [courseId, setCourseId] = useState('')
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<(Module & { lessons: Lesson[] })[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [published, setPublished] = useState(false)
  
  // New module/lesson forms
  const [newModuleTitle, setNewModuleTitle] = useState('')
  const [newLessonForms, setNewLessonForms] = useState<Record<string, { title: string; videoUrl: string; description: string }>>({})

  const router = useRouter()
  const supabase = createClient()

  const fetchData = async () => {
    setLoading(true)
    const { data: courseData } = await supabase
      .from('courses')
      .select('*')
      .eq('id', courseId)
      .single()

    if (courseData) {
      setCourse(courseData)
      setTitle(courseData.title)
      setDescription(courseData.description || '')
      setThumbnailUrl(courseData.thumbnail_url || '')
      setPublished(courseData.published)
    }

    const { data: modulesData } = await supabase
      .from('modules')
      .select('*, lessons(*)')
      .eq('course_id', courseId)
      .order('order_index')

    if (modulesData) {
      setModules(
        (modulesData as (Module & { lessons?: Lesson[] })[]).map((m) => ({
          ...m,
          lessons: [...(m.lessons || [])].sort((a: Lesson, b: Lesson) => a.order_index - b.order_index),
        }))
      )
    }
    setLoading(false)
  }

  useEffect(() => {
    params.then(({ courseId: id }) => setCourseId(id))
  }, [params])

  useEffect(() => {
    if (!courseId) return
    fetchData()
  }, [courseId])

  const saveCourse = async () => {
    setSaving(true)
    await supabase.from('courses').update({
      title: title.trim(),
      description: description.trim() || null,
      thumbnail_url: thumbnailUrl.trim() || null,
      published,
    }).eq('id', courseId)
    setSaving(false)
  }

  const addModule = async () => {
    if (!newModuleTitle.trim()) return
    await supabase.from('modules').insert({
      course_id: courseId,
      title: newModuleTitle.trim(),
      order_index: modules.length,
    })
    setNewModuleTitle('')
    fetchData()
  }

  const deleteModule = async (id: string) => {
    if (!confirm('Excluir este módulo e todas as suas aulas?')) return
    await supabase.from('modules').delete().eq('id', id)
    fetchData()
  }

  const addLesson = async (moduleId: string) => {
    const form = newLessonForms[moduleId]
    if (!form?.title?.trim()) return

    const moduleData = modules.find((m) => m.id === moduleId)
    const lessonCount = moduleData?.lessons?.length || 0

    await supabase.from('lessons').insert({
      module_id: moduleId,
      title: form.title.trim(),
      video_url: form.videoUrl?.trim() || null,
      description: form.description?.trim() || null,
      order_index: lessonCount,
      published: true,
    })
    setNewLessonForms((prev) => ({ ...prev, [moduleId]: { title: '', videoUrl: '', description: '' } }))
    fetchData()
  }

  const deleteLesson = async (id: string) => {
    if (!confirm('Excluir esta aula?')) return
    await supabase.from('lessons').delete().eq('id', id)
    fetchData()
  }

  if (loading) {
    return (
      <div className="animate-fade-in space-y-4">
        <div className="h-10 bg-dark-700 rounded-lg w-48 animate-shimmer" />
        <div className="card-glass h-64 animate-shimmer rounded-2xl" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/cursos" className="btn-ghost p-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white">Editar Curso</h1>
          <p className="text-white/40">{course?.title}</p>
        </div>
        <button onClick={saveCourse} disabled={saving} className="btn-primary">
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Salvar
        </button>
      </div>

      {/* Course info */}
      <div className="card-glass p-6 space-y-5">
        <h2 className="text-lg font-semibold text-white">Informações do Curso</h2>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Título</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-dark" />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">Descrição</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-dark resize-none min-h-[80px]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/60 mb-2">URL da Thumbnail</label>
          <input value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} className="input-dark" placeholder="https://..." />
        </div>

        <div className="flex items-center gap-3">
          <button type="button" onClick={() => { setPublished(!published); }} className={`relative w-12 h-7 rounded-full transition-colors ${published ? 'bg-green-500' : 'bg-dark-400'}`}>
            <div className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${published ? 'translate-x-5' : ''}`} />
          </button>
          <span className="text-sm text-white/60">{published ? 'Publicado' : 'Rascunho'}</span>
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">Módulos e Aulas</h2>

        {modules.map((module, mIdx) => (
          <div key={module.id} className="card-glass overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b border-white/5">
              <GripVertical className="w-5 h-5 text-white/20" />
              <BookOpen className="w-5 h-5 text-wine-400" />
              <span className="text-white font-medium flex-1">{module.title}</span>
              <span className="text-white/20 text-sm">{module.lessons.length} aulas</span>
              <button onClick={() => deleteModule(module.id)} className="btn-ghost p-1.5 hover:text-red-400">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Lessons */}
            <div className="divide-y divide-white/[0.03]">
              {module.lessons.map((lesson, lIdx) => (
                <div key={lesson.id} className="flex items-center gap-3 px-4 py-3 pl-12">
                  <Video className="w-4 h-4 text-white/20 flex-shrink-0" />
                  <span className="text-white/70 text-sm flex-1 truncate">{lesson.title}</span>
                  {lesson.video_url && (
                    <span className="text-green-400/50 text-xs">🔗 Vídeo</span>
                  )}
                  <button onClick={() => deleteLesson(lesson.id)} className="btn-ghost p-1 hover:text-red-400">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {/* Add lesson form */}
              <div className="px-4 py-3 pl-12 space-y-2">
                <input
                  value={newLessonForms[module.id]?.title || ''}
                  onChange={(e) => setNewLessonForms((prev) => ({
                    ...prev,
                    [module.id]: { ...prev[module.id], title: e.target.value },
                  }))}
                  placeholder="Título da nova aula"
                  className="input-dark text-sm"
                />
                <input
                  value={newLessonForms[module.id]?.videoUrl || ''}
                  onChange={(e) => setNewLessonForms((prev) => ({
                    ...prev,
                    [module.id]: { ...prev[module.id], videoUrl: e.target.value },
                  }))}
                  placeholder="Link do Bunny Stream (opcional)"
                  className="input-dark text-sm"
                />
                <input
                  value={newLessonForms[module.id]?.description || ''}
                  onChange={(e) => setNewLessonForms((prev) => ({
                    ...prev,
                    [module.id]: { ...prev[module.id], description: e.target.value },
                  }))}
                  placeholder="Descrição da aula (opcional)"
                  className="input-dark text-sm"
                />
                <button
                  onClick={() => addLesson(module.id)}
                  disabled={!newLessonForms[module.id]?.title?.trim()}
                  className="btn-secondary text-sm disabled:opacity-30"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Aula
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add module */}
        <div className="card-glass p-4">
          <div className="flex gap-3">
            <input
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              placeholder="Nome do novo módulo"
              className="input-dark flex-1 text-sm"
              onKeyDown={(e) => { if (e.key === 'Enter') addModule() }}
            />
            <button
              onClick={addModule}
              disabled={!newModuleTitle.trim()}
              className="btn-primary text-sm disabled:opacity-30"
            >
              <Plus className="w-4 h-4" />
              Módulo
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
