'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle, ChevronLeft, Clock, Play, List, X } from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import type { Lesson, Module } from '@/types/database'

interface LessonPageProps {
  params: Promise<{ courseId: string; lessonId: string }>
}

export default function LessonPage({ params }: LessonPageProps) {
  const [courseId, setCourseId] = useState('')
  const [lessonId, setLessonId] = useState('')
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [modules, setModules] = useState<(Module & { lessons: Lesson[] })[]>([])
  const [completed, setCompleted] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    params.then(({ courseId: cId, lessonId: lId }) => {
      setCourseId(cId)
      setLessonId(lId)
    })
  }, [params])

  useEffect(() => {
    if (!lessonId || !courseId) return

    const fetchData = async () => {
      setLoading(true)
      
      // Fetch lesson
      const { data: lessonData } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', lessonId)
        .single()

      if (lessonData) setLesson(lessonData)

      // Fetch course modules with lessons
      const { data: modulesData } = await supabase
        .from('modules')
        .select('*, lessons(*)')
        .eq('course_id', courseId)
        .order('order_index')

      if (modulesData) {
        const sorted = modulesData.map((m) => ({
          ...m,
          lessons: [...(m.lessons || [])].sort(
            (a: Lesson, b: Lesson) => a.order_index - b.order_index
          ),
        }))
        setModules(sorted)
      }

      // Check progress
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: progressData } = await supabase
          .from('progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId)
          .single()

        if (progressData) {
          setCompleted(progressData.completed)
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [lessonId, courseId])

  const toggleComplete = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const newCompleted = !completed
    setCompleted(newCompleted)

    const { data: existing } = await supabase
      .from('progress')
      .select('id')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .single()

    if (existing) {
      await supabase
        .from('progress')
        .update({
          completed: newCompleted,
          watched_percentage: newCompleted ? 100 : 0,
          last_watched_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
    } else {
      await supabase.from('progress').insert({
        user_id: user.id,
        lesson_id: lessonId,
        completed: newCompleted,
        watched_percentage: newCompleted ? 100 : 0,
      })
    }
  }

  // Find next/prev lessons
  const allLessons = modules.flatMap((m) => m.lessons)
  const currentIndex = allLessons.findIndex((l) => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

  if (loading || !lesson) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="aspect-video bg-dark-700 rounded-2xl animate-shimmer" />
        <div className="h-8 bg-dark-700 rounded-lg w-64 animate-shimmer" />
        <div className="h-4 bg-dark-700 rounded-lg w-96 animate-shimmer" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href={`/cursos/${courseId}`}
          className="btn-ghost text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar ao curso
        </Link>
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="btn-secondary text-sm lg:hidden"
        >
          <List className="w-4 h-4" />
          Aulas
        </button>
      </div>

      <div className="flex gap-6">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Video Player */}
          <div className="aspect-video bg-dark-800 rounded-2xl overflow-hidden border border-white/5 mb-6 relative">
            {lesson.video_url ? (
              <iframe
                src={lesson.video_url}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={lesson.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 text-white/10 mx-auto mb-4" />
                  <p className="text-white/30">Vídeo não disponível</p>
                </div>
              </div>
            )}
          </div>

          {/* Lesson info */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{lesson.title}</h1>
                {lesson.duration_seconds > 0 && (
                  <p className="text-white/30 text-sm flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {formatDuration(lesson.duration_seconds)}
                  </p>
                )}
              </div>
              <button
                onClick={toggleComplete}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  completed
                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                    : 'btn-secondary'
                }`}
                id="mark-complete-btn"
              >
                <CheckCircle className="w-5 h-5" />
                {completed ? 'Concluída' : 'Marcar como concluída'}
              </button>
            </div>

            {lesson.description && (
              <div className="card-glass p-6">
                <p className="text-white/50 leading-relaxed">{lesson.description}</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              {prevLesson ? (
                <Link
                  href={`/cursos/${courseId}/aula/${prevLesson.id}`}
                  className="btn-secondary text-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Aula anterior
                </Link>
              ) : <div />}
              {nextLesson && (
                <Link
                  href={`/cursos/${courseId}/aula/${nextLesson.id}`}
                  className="btn-primary text-sm"
                >
                  Próxima aula
                  <ChevronLeft className="w-4 h-4 rotate-180" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Lessons sidebar - Desktop */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="card-glass p-4 sticky top-8 max-h-[80vh] overflow-y-auto">
            <h3 className="text-white font-semibold mb-4 px-2">Conteúdo</h3>
            {modules.map((module) => (
              <div key={module.id} className="mb-4">
                <p className="text-white/30 text-xs font-semibold uppercase tracking-wider px-2 mb-2">
                  {module.title}
                </p>
                {module.lessons.map((l) => (
                  <Link
                    key={l.id}
                    href={`/cursos/${courseId}/aula/${l.id}`}
                    className={`flex items-center gap-3 p-2 rounded-lg text-sm transition-colors ${
                      l.id === lessonId
                        ? 'bg-wine-500/10 text-wine-400'
                        : 'text-white/50 hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{l.title}</span>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Lessons sidebar - Mobile */}
        {showSidebar && (
          <>
            <div className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setShowSidebar(false)} />
            <div className="lg:hidden fixed top-0 right-0 bottom-0 w-80 bg-dark-800 z-50 p-4 overflow-y-auto border-l border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Conteúdo</h3>
                <button onClick={() => setShowSidebar(false)} className="text-white/30 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {modules.map((module) => (
                <div key={module.id} className="mb-4">
                  <p className="text-white/30 text-xs font-semibold uppercase tracking-wider mb-2">
                    {module.title}
                  </p>
                  {module.lessons.map((l) => (
                    <Link
                      key={l.id}
                      href={`/cursos/${courseId}/aula/${l.id}`}
                      onClick={() => setShowSidebar(false)}
                      className={`flex items-center gap-3 p-2 rounded-lg text-sm transition-colors ${
                        l.id === lessonId
                          ? 'bg-wine-500/10 text-wine-400'
                          : 'text-white/50 hover:text-white hover:bg-white/[0.03]'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{l.title}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
