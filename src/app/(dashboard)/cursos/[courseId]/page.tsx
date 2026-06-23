import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Play, Clock, CheckCircle, ChevronDown } from 'lucide-react'
import { formatDuration } from '@/lib/utils'

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: course } = await supabase
    .from('courses')
    .select('*, modules(*, lessons(*))')
    .eq('id', courseId)
    .single()

  if (!course) {
    notFound()
  }

  // Get user progress for this course
  const lessonIds = course.modules?.flatMap(
    (m: { lessons: { id: string }[] }) => m.lessons?.map((l: { id: string }) => l.id) || []
  ) || []

  const { data: progress } = await supabase
    .from('progress')
    .select('*')
    .eq('user_id', user?.id || '')
    .in('lesson_id', lessonIds.length > 0 ? lessonIds : ['none'])

  const progressMap = new Map(progress?.map((p) => [p.lesson_id, p]) || [])

  const totalLessons = lessonIds.length
  const completedLessons = progress?.filter((p) => p.completed)?.length || 0
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  const sortedModules = [...(course.modules || [])].sort(
    (a: { order_index: number }, b: { order_index: number }) => a.order_index - b.order_index
  )

  return (
    <div className="animate-fade-in space-y-8">
      {/* Course Header */}
      <div className="card-glass overflow-hidden">
        <div className="aspect-[3/1] bg-dark-600 relative">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center gradient-wine">
              <BookOpen className="w-20 h-20 text-white/20" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-700 via-dark-700/50 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3">{course.title}</h1>
            <p className="text-white/50 max-w-2xl mb-4">{course.description}</p>

            <div className="flex items-center gap-6 text-sm text-white/40">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                {sortedModules.length} módulos
              </span>
              <span className="flex items-center gap-1.5">
                <Play className="w-4 h-4" />
                {totalLessons} aulas
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                {overallProgress}% concluído
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="px-6 sm:px-8 pb-6 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/40 text-sm">Progresso do curso</span>
            <span className="text-white text-sm font-semibold">{overallProgress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: `${overallProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Conteúdo do Curso</h2>

        {sortedModules.map((module: { id: string; title: string; order_index: number; lessons: { id: string; title: string; duration_seconds: number; order_index: number; published: boolean }[] }, moduleIdx: number) => {
          const sortedLessons = [...(module.lessons || [])].sort(
            (a, b) => a.order_index - b.order_index
          )
          const moduleCompleted = sortedLessons.every(
            (l) => progressMap.get(l.id)?.completed
          )

          return (
            <details
              key={module.id}
              className="card-glass overflow-hidden group"
              open={moduleIdx === 0}
            >
              <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    moduleCompleted ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-white/40'
                  }`}>
                    {moduleCompleted ? <CheckCircle className="w-4 h-4" /> : moduleIdx + 1}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{module.title}</h3>
                    <p className="text-white/30 text-sm">{sortedLessons.length} aulas</p>
                  </div>
                </div>
                <ChevronDown className="w-5 h-5 text-white/20 group-open:rotate-180 transition-transform" />
              </summary>

              <div className="border-t border-white/5">
                {sortedLessons.map((lesson, lessonIdx: number) => {
                  const lessonProgress = progressMap.get(lesson.id)
                  const isCompleted = lessonProgress?.completed

                  return (
                    <Link
                      key={lesson.id}
                      href={`/cursos/${courseId}/aula/${lesson.id}`}
                      className="flex items-center gap-4 p-4 px-5 hover:bg-white/[0.02] transition-colors border-t border-white/[0.03] first:border-t-0"
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                        isCompleted
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-white/5 text-white/30'
                      }`}>
                        {isCompleted ? <CheckCircle className="w-4 h-4" /> : lessonIdx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${
                          isCompleted ? 'text-white/50' : 'text-white'
                        }`}>
                          {lesson.title}
                        </p>
                      </div>
                      {lesson.duration_seconds > 0 && (
                        <span className="text-white/20 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDuration(lesson.duration_seconds)}
                        </span>
                      )}
                      {lessonProgress && !isCompleted && (
                        <div className="w-16">
                          <div className="progress-bar">
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${lessonProgress.watched_percentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </details>
          )
        })}
      </div>
    </div>
  )
}
