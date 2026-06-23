import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { BookOpen, Play } from 'lucide-react'

export default async function CursosPage() {
  const supabase = await createClient()

  const { data: courses } = await supabase
    .from('courses')
    .select('*, modules(id, lessons(id))')
    .eq('published', true)
    .order('order_index')

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Cursos</h1>
        <p className="text-white/40">Explore todos os cursos disponíveis na plataforma</p>
      </div>

      {courses && courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const totalLessons = course.modules?.reduce(
              (acc: number, mod: { lessons: { id: string }[] }) => acc + (mod.lessons?.length || 0),
              0
            ) || 0

            return (
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
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-wine-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-white/30 text-sm line-clamp-2 mb-4">
                    {course.description || 'Explore este curso exclusivo'}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-white/20">
                    <span>{course.modules?.length || 0} módulos</span>
                    <span>•</span>
                    <span>{totalLessons} aulas</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="card-glass p-16 text-center">
          <BookOpen className="w-16 h-16 text-white/10 mx-auto mb-4" />
          <h3 className="text-white/50 text-xl mb-2">Nenhum curso disponível</h3>
          <p className="text-white/20">Novos cursos serão adicionados em breve!</p>
        </div>
      )}
    </div>
  )
}
