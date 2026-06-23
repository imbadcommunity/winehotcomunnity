import Link from 'next/link'
import { Lock, Sparkles, ArrowRight, Check } from 'lucide-react'
import { PLANS, APP_NAME } from '@/lib/constants'

export default function UpgradePage() {
  return (
    <div className="min-h-screen hero-gradient noise-overlay flex items-center justify-center p-4 relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-wine-700/10 blur-[120px] animate-float" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-gold-500/8 blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full glass-strong flex items-center justify-center mx-auto mb-8">
          <Lock className="w-10 h-10 text-wine-400" />
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
          Acesso{' '}
          <span className="gradient-text-wine-gold">Exclusivo</span>
        </h1>
        <p className="text-white/40 text-lg mb-12 max-w-2xl mx-auto">
          Sua assinatura não está ativa. Assine agora para ter acesso a todos os cursos, 
          comunidade e conteúdos exclusivos da {APP_NAME}.
        </p>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Monthly */}
          <div className="card-glass p-8 text-left">
            <h3 className="text-xl font-bold text-white mb-1">{PLANS.monthly.name}</h3>
            <div className="mb-6">
              <span className="text-4xl font-black text-white">{PLANS.monthly.price}</span>
              <span className="text-white/30">{PLANS.monthly.interval}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {PLANS.monthly.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-white/50 text-sm">
                  <Check className="w-4 h-4 text-wine-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/cadastro" className="btn-secondary w-full py-3 text-center">
              Escolher Mensal
            </Link>
          </div>

          {/* Yearly */}
          <div className="card-glass p-8 text-left border-wine-500/20 relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <span className="badge badge-gold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Melhor oferta
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-wine-500/5 to-gold-500/5" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-1">{PLANS.yearly.name}</h3>
              <p className="text-green-400 text-sm font-medium mb-2">{PLANS.yearly.savings}</p>
              <div className="mb-6">
                <span className="text-4xl font-black gradient-text-wine-gold">{PLANS.yearly.price}</span>
                <span className="text-white/30">{PLANS.yearly.interval}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {PLANS.yearly.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/60 text-sm">
                    <Check className="w-4 h-4 text-gold-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/cadastro" className="btn-primary w-full py-3 text-center animate-pulse-glow">
                Assinar Anual
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <Link href="/" className="text-white/30 hover:text-white/50 text-sm transition-colors">
          ← Voltar para o início
        </Link>
      </div>
    </div>
  )
}
