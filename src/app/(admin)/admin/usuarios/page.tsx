'use client'
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Shield, User } from 'lucide-react'
import { getInitials } from '@/lib/utils'
import type { Profile } from '@/types/database'

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<Profile[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchUsers = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setUsers(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin'
    if (newRole === 'admin' && !confirm('Tornar este usuário administrador?')) return
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
    fetchUsers()
  }

  const filteredUsers = users.filter((u) =>
    (u.full_name || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Usuários</h1>
        <p className="text-white/40">Gerencie os usuários da plataforma ({users.length} total)</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome..."
          className="input-dark pl-12"
          id="search-users"
        />
      </div>

      {/* Table */}
      <div className="card-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-sm font-medium text-white/40">Usuário</th>
                <th className="text-left p-4 text-sm font-medium text-white/40">Role</th>
                <th className="text-left p-4 text-sm font-medium text-white/40">Criado em</th>
                <th className="text-right p-4 text-sm font-medium text-white/40">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="p-4">
                      <div className="h-8 animate-shimmer rounded" />
                    </td>
                  </tr>
                ))
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full gradient-wine flex items-center justify-center text-white text-xs font-bold">
                          {getInitials(user.full_name)}
                        </div>
                        <span className="text-white text-sm">{user.full_name || 'Sem nome'}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`badge ${user.role === 'admin' ? 'badge-wine' : 'badge-active'}`}>
                        {user.role === 'admin' ? 'Admin' : 'Usuário'}
                      </span>
                    </td>
                    <td className="p-4 text-white/30 text-sm">
                      {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toggleRole(user.id, user.role)}
                        className="btn-ghost text-sm"
                        title={user.role === 'admin' ? 'Remover admin' : 'Tornar admin'}
                      >
                        {user.role === 'admin' ? (
                          <><User className="w-4 h-4" /> Remover Admin</>
                        ) : (
                          <><Shield className="w-4 h-4" /> Tornar Admin</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-white/30">
                    Nenhum usuário encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
