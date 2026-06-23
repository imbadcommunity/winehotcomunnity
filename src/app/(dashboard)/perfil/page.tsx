'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User, Save, Loader2 } from 'lucide-react'
import { getInitials } from '@/lib/utils'

export default function PerfilPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setEmail(user.email || '')
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        if (profile) {
          setName(profile.full_name || '')
          setAvatarUrl(profile.avatar_url || '')
        }
      }
    }
    fetchProfile()
  }, [])

  const handleSave = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase
        .from('profiles')
        .update({ full_name: name, avatar_url: avatarUrl })
        .eq('id', user.id)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setLoading(false)
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Meu Perfil</h1>
        <p className="text-white/40">Gerencie suas informações pessoais</p>
      </div>

      <div className="card-glass p-8">
        {/* Avatar */}
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full gradient-wine-gold flex items-center justify-center text-white text-2xl font-bold">
            {getInitials(name)}
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">{name || 'Usuário'}</h3>
            <p className="text-white/30 text-sm">{email}</p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-white/60 mb-2">
              Nome completo
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-dark"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-2">
              Email
            </label>
            <input
              id="email-display"
              type="email"
              value={email}
              disabled
              className="input-dark opacity-50 cursor-not-allowed"
            />
            <p className="text-white/20 text-xs mt-1">O email não pode ser alterado</p>
          </div>

          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-white/60 mb-2">
              URL do Avatar
            </label>
            <input
              id="avatar"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="input-dark"
              placeholder="https://..."
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="btn-primary py-3 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : saved ? (
              '✓ Salvo com sucesso!'
            ) : (
              <>
                <Save className="w-5 h-5" />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
