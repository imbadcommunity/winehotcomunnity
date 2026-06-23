import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Users, BookOpen, CreditCard, TrendingUp } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: activeSubscriptions } = await supabase
    .from('subscriptions')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  const { count: totalCourses } = await supabase
    .from('courses')
    .select('*', { count: 'exact', head: true })

  const { count: totalPosts } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true })

  const stats = [
    { label: 'Usuários', value: totalUsers || 0, icon: Users, color: 'bg-blue-500/10 text-blue-400', href: '/admin/usuarios' },
    { label: 'Assinaturas Ativas', value: activeSubscriptions || 0, icon: CreditCard, color: 'bg-green-500/10 text-green-400', href: '/admin/assinaturas' },
    { label: 'Cursos', value: totalCourses || 0, icon: BookOpen, color: 'bg-wine-500/10 text-wine-400', href: '/admin/cursos' },
    { label: 'Posts na Comunidade', value: totalPosts || 0, icon: TrendingUp, color: 'bg-gold-500/10 text-gold-400', href: '#' },
  ]

  // Recent users
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Painel Administrativo</h1>
        <p className="text-white/40">Visão geral da plataforma</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="card-glass p-6 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-white/30 text-sm">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent users */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Últimos Usuários</h2>
        <div className="card-glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-sm font-medium text-white/40">Nome</th>
                  <th className="text-left p-4 text-sm font-medium text-white/40">Role</th>
                  <th className="text-left p-4 text-sm font-medium text-white/40">Data</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers?.map((user) => (
                  <tr key={user.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-wine flex items-center justify-center text-white text-xs font-bold">
                          {user.full_name?.charAt(0) || '?'}
                        </div>
                        <span className="text-white text-sm">{user.full_name || 'Sem nome'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`badge ${user.role === 'admin' ? 'badge-wine' : 'badge-active'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-white/30 text-sm">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
