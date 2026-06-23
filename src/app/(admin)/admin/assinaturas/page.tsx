'use client'
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, CreditCard } from 'lucide-react'
import type { Database, Subscription, Profile } from '@/types/database'

type SubscriptionWithProfile = Subscription & {
  profiles: Pick<Profile, 'full_name' | 'avatar_url'>
}

export default function AdminAssinaturasPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithProfile[]>([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ status: '', plan: '', expires_at: '' })
  const supabase = createClient()

  const fetchSubscriptions = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('subscriptions')
      .select('*, profiles(full_name, avatar_url)')
      .order('started_at', { ascending: false })
    if (data) setSubscriptions(data as SubscriptionWithProfile[])
    setLoading(false)
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const startEdit = (sub: SubscriptionWithProfile) => {
    setEditingId(sub.id)
    setEditForm({
      status: sub.status,
      plan: sub.plan,
      expires_at: sub.expires_at?.split('T')[0] || '',
    })
  }

  const saveEdit = async (id: string) => {
    const updateData: Record<string, unknown> = {
      status: editForm.status,
      plan: editForm.plan,
    }
    if (editForm.expires_at) {
      updateData.expires_at = new Date(editForm.expires_at).toISOString()
    }
    await supabase.from('subscriptions').update(updateData).eq('id', id)
    setEditingId(null)
    fetchSubscriptions()
  }

  const filtered = subscriptions.filter((s) => {
    const nameMatch = (s.profiles?.full_name || '').toLowerCase().includes(search.toLowerCase())
    const statusMatch = filterStatus === 'all' || s.status === filterStatus
    return nameMatch && statusMatch
  })

  const statusCounts = {
    all: subscriptions.length,
    active: subscriptions.filter((s) => s.status === 'active').length,
    inactive: subscriptions.filter((s) => s.status === 'inactive').length,
    cancelled: subscriptions.filter((s) => s.status === 'cancelled').length,
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Assinaturas</h1>
        <p className="text-white/40">Gerencie as assinaturas dos usuários</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome..."
            className="input-dark pl-12"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'inactive', 'cancelled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filterStatus === status
                  ? 'bg-wine-500/20 text-wine-400 border border-wine-500/20'
                  : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'
              }`}
            >
              {status === 'all' ? 'Todas' : status === 'active' ? 'Ativas' : status === 'inactive' ? 'Inativas' : 'Canceladas'}
              <span className="ml-1.5 text-xs opacity-60">({statusCounts[status]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left p-4 text-sm font-medium text-white/40">Usuário</th>
                <th className="text-left p-4 text-sm font-medium text-white/40">Status</th>
                <th className="text-left p-4 text-sm font-medium text-white/40">Plano</th>
                <th className="text-left p-4 text-sm font-medium text-white/40">Expira em</th>
                <th className="text-right p-4 text-sm font-medium text-white/40">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={5} className="p-4"><div className="h-8 animate-shimmer rounded" /></td></tr>
                ))
              ) : filtered.map((sub) => (
                <tr key={sub.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="p-4">
                    <span className="text-white text-sm">{sub.profiles?.full_name || 'Sem nome'}</span>
                  </td>
                  <td className="p-4">
                    {editingId === sub.id ? (
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        className="input-dark text-sm py-1 px-2 w-32"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span className={`badge badge-${sub.status === 'active' ? 'active' : sub.status === 'cancelled' ? 'cancelled' : 'inactive'}`}>
                        {sub.status}
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === sub.id ? (
                      <input
                        value={editForm.plan}
                        onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                        className="input-dark text-sm py-1 px-2 w-32"
                      />
                    ) : (
                      <span className="text-white/50 text-sm">{sub.plan}</span>
                    )}
                  </td>
                  <td className="p-4">
                    {editingId === sub.id ? (
                      <input
                        type="date"
                        value={editForm.expires_at}
                        onChange={(e) => setEditForm({ ...editForm, expires_at: e.target.value })}
                        className="input-dark text-sm py-1 px-2 w-40"
                      />
                    ) : (
                      <span className="text-white/30 text-sm">
                        {sub.expires_at ? new Date(sub.expires_at).toLocaleDateString('pt-BR') : '-'}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {editingId === sub.id ? (
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => saveEdit(sub.id)} className="btn-primary text-xs py-1.5 px-3">
                          Salvar
                        </button>
                        <button onClick={() => setEditingId(null)} className="btn-ghost text-xs py-1.5 px-3">
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => startEdit(sub)} className="btn-ghost text-sm">
                        Editar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
