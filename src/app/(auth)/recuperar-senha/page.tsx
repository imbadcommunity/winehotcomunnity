'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft, Sparkles, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { APP_NAME } from '@/lib/constants'

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <div className="animate-fade-in-up">
      {/* Logo */}
      <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
        <div className="w-10 h-10 rounded-xl gradient-wine flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-white">{APP_NAME}</span>
      </Link>

      {/* Card */}
      <div className="card-glass p-8">
        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 rounded-full gradient-wine flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Email enviado!</h2>
            <p className="text-white/40 mb-6">
              Se existe uma conta com <span className="text-white font-medium">{email}</span>, 
              você receberá um link para redefinir sua senha.
            </p>
            <Link href="/login" className="btn-primary">
              <ArrowLeft className="w-4 h-4" />
              Voltar para Login
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-2">Recuperar senha</h1>
              <p className="text-white/40 text-sm">
                Digite seu email e enviaremos um link para redefinir sua senha
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white/60 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-dark"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                id="recover-submit-btn"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Enviar Link
                  </>
                )}
              </button>
            </form>

            <p className="text-center mt-6 text-sm text-white/30">
              Lembrou a senha?{' '}
              <Link href="/login" className="text-wine-400 hover:text-wine-300 font-medium transition-colors">
                Entrar
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
