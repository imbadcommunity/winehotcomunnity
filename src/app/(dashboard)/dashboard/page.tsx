import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen, Clock, Trophy, TrendingUp, Play, ChevronRight, Calendar } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch courses
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('published', true)
    .order('order_index')

  // Fetch user progress
  const { data: progress } = await supabase
    .from('progress')
    .select('*, lessons(*, modules(*, courses(*)))')
    .eq('user_id', user?.id || '')
    .order('last_watched_at', { ascending: false })

  // Fetch upcoming events
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .gte('event_date', new Date().toISOString())
    .order('event_date')
    .limit(3)

  const completedLessons = progress?.filter((p) => p.completed)?.length || 0
  const totalWatchedMinutes = Math.round(
    (progress?.reduce((acc, p) => acc + (p.watched_percentage || 0), 0) || 0) / 60
  )
  const lastWatched = progress?.[0]

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-white/40">Continue sua jornada de aprendizado</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-glass p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-wine-500/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-wine-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{courses?.length || 0}</p>
              <p className="text-white/30 text-sm">Cursos disponíveis</p>
            </div>
          </div>
        </div>

        <div className="card-glass p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{completedLessons}</p>
              <p className="text-white/30 text-sm">Aulas concluídas</p>
            </div>
          </div>
        </div>

        <div className="card-glass p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{totalWatchedMinutes}h</p>
              <p className="text-white/30 text-sm">Horas assistidas</p>
            </div>
          </div>
        </div>

        <div className="card-glass p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {progress && progress.length > 0
                  ? Math.round(
                      progress.reduce((acc, p) => acc + p.watched_percentage, 0) /
                        progress.length
                    )
                  : 0}%
              </p>
              <p className="text-white/30 text-sm">Progresso geral</p>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Watching */}
      {lastWatched && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Continue Assistindo</h2>
          </div>
          <div className="card-glass p-6 flex flex-col sm:flex-row items-center gap-6 group hover:border-wine-500/20 transition-colors">
            <div className="w-full sm:w-48 h-28 rounded-xl bg-dark-600 flex items-center justify-center relative overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <Play className="w-10 h-10 text-white relative z-10" fill="white" />
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-dark-400">
                <div
                  className="h-full bg-gradient-to-r from-wine-500 to-gold-500"
                  style={{ width: `${lastWatched.watched_percentage}%` }}
                />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-white/40 text-sm mb-1">Última aula assistida</p>
              <h3 className="text-white font-semibold text-lg mb-2">Continuar de onde parou</h3>
              <p className="text-white/30 text-sm mb-3">
                {lastWatched.watched_percentage}% concluído
              </p>
              <Link
                href={`/cursos`}
                className="btn-primary text-sm py-2 px-4"
              >
                <Play className="w-4 h-4" />
                Continuar
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Courses */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Cursos Disponíveis</h2>
          <Link href="/cursos" className="text-wine-400 hover:text-wine-300 text-sm font-medium flex items-center gap-1 transition-colors">
            Ver todos
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {courses && courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course) => (
              <Link
                key={course.id}
                href={`/cursos/${course.id}`}
                className="card-dark overflow-hidden group"
              >
                <div className="aspect-video bg-dark-600 relative overflow-hidden">
                  {course.thumbnail_url ? (
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center gradient-wine">
                      <BookOpen className="w-12 h-12 text-white/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full glass-strong flex items-center justify-center">
                      <Play className="w-5 h-5 text-white" fill="white" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-white font-semibold mb-2 group-hover:text-wine-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-white/30 text-sm line-clamp-2">
                    {course.description || 'Explore este curso exclusivo'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card-glass p-12 text-center">
            <BookOpen className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-lg mb-2">Nenhum curso disponível ainda</p>
            <p className="text-white/20 text-sm">Novos cursos serão adicionados em breve!</p>
          </div>
        )}
      </div>

      {/* Upcoming Events */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Próximos Eventos</h2>
          <Link href="/calendario" className="text-wine-400 hover:text-wine-300 text-sm font-medium flex items-center gap-1 transition-colors">
            Ver calendário
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {events.map((event) => (
              <div key={event.id} className="card-glass p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-wine-500/10 flex flex-col items-center justify-center flex-shrink-0">
                    <span className="text-wine-400 text-xs font-bold">
                      {new Date(event.event_date).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}
                    </span>
                    <span className="text-white text-lg font-bold leading-none">
                      {new Date(event.event_date).getDate()}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm mb-1">{event.title}</h4>
                    <p className="text-white/30 text-xs">
                      {new Date(event.event_date).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-glass p-8 text-center">
            <Calendar className="w-8 h-8 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">Nenhum evento programado</p>
          </div>
        )}
      </div>
    </div>
  )
}
