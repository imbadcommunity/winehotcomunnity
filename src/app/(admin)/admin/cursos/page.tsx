'use client'
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, BookOpen, Eye, EyeOff, Loader2 } from 'lucide-react'
import type { Course } from '@/types/database'

export default function AdminCursosPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchCourses = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('courses')
      .select('*')
      .order('order_index')
    if (data) setCourses(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  const deleteCourse = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.')) return
    await supabase.from('courses').delete().eq('id', id)
    fetchCourses()
  }

  const togglePublish = async (id: string, published: boolean) => {
    await supabase.from('courses').update({ published: !published }).eq('id', id)
    fetchCourses()
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Cursos</h1>
          <p className="text-white/40">Gerencie todos os cursos da plataforma</p>
        </div>
        <Link href="/admin/cursos/novo" className="btn-primary">
          <Plus className="w-5 h-5" />
          Novo Curso
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card-glass h-20 animate-shimmer rounded-2xl" />
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="space-y-3">
          {courses.map((course) => (
            <div key={course.id} className="card-glass p-4 flex items-center gap-4">
              {/* Thumbnail */}
              <div className="w-20 h-14 rounded-lg bg-dark-600 overflow-hidden flex-shrink-0">
                {course.thumbnail_url ? (
                  <img src={course.thumbnail_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center gradient-wine">
                    <BookOpen className="w-5 h-5 text-white/30" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{course.title}</h3>
                <p className="text-white/30 text-sm truncate">{course.description || 'Sem descrição'}</p>
              </div>

              {/* Status */}
              <span className={`badge ${course.published ? 'badge-active' : 'badge-inactive'} hidden sm:inline-flex`}>
                {course.published ? 'Publicado' : 'Rascunho'}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePublish(course.id, course.published)}
                  className="btn-ghost p-2"
                  title={course.published ? 'Despublicar' : 'Publicar'}
                >
                  {course.published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <Link href={`/admin/cursos/${course.id}`} className="btn-ghost p-2" title="Editar">
                  <Pencil className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => deleteCourse(course.id)}
                  className="btn-ghost p-2 hover:text-red-400"
                  title="Excluir"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-glass p-12 text-center">
          <BookOpen className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <p className="text-white/30 text-lg mb-4">Nenhum curso criado ainda</p>
          <Link href="/admin/cursos/novo" className="btn-primary">
            <Plus className="w-5 h-5" />
            Criar Primeiro Curso
          </Link>
        </div>
      )}
    </div>
  )
}
