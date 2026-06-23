'use client'

import Link from 'next/link'
import { Check, Sparkles, ArrowRight } from 'lucide-react'
import { PLANS } from '@/lib/constants'

export function Pricing() {
  return (
    <section id="planos" className="relative py-24 sm:py-32">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-wine-700/5 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-gold-500/5 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="badge badge-wine mb-4">💎 Planos</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
            Invista no seu{' '}
            <span className="gradient-text-wine-gold">futuro</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Escolha o plano ideal e comece sua transformação agora mesmo
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Monthly Plan */}
          <div className="card-glass p-8 relative">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-1">{PLANS.monthly.name}</h3>
              <p className="text-white/30 text-sm">Flexibilidade total</p>
            </div>

            <div className="mb-8">
              <span className="text-5xl font-black text-white">{PLANS.monthly.price}</span>
              <span className="text-white/30 text-lg">{PLANS.monthly.interval}</span>
            </div>

            <ul className="space-y-4 mb-8">
              {PLANS.monthly.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-wine-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-wine-400" />
                  </div>
                  <span className="text-white/60 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/cadastro"
              className="btn-secondary w-full py-4 text-center"
              id="plan-monthly-cta"
            >
              Começar Agora
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Yearly Plan - Featured */}
          <div className="relative">
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
              <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-wine-500 to-gold-500 text-white text-sm font-semibold shadow-lg">
                <Sparkles className="w-4 h-4" />
                {PLANS.yearly.badge}
              </div>
            </div>

            <div className="card-glass p-8 border-wine-500/20 relative overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-wine-500/5 via-transparent to-gold-500/5" />

              <div className="relative z-10">
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-1">{PLANS.yearly.name}</h3>
                  <p className="text-green-400 text-sm font-medium">{PLANS.yearly.savings}</p>
                </div>

                <div className="mb-8">
                  <span className="text-5xl font-black gradient-text-wine-gold">{PLANS.yearly.price}</span>
                  <span className="text-white/30 text-lg">{PLANS.yearly.interval}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {PLANS.yearly.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-gold-400" />
                      </div>
                      <span className="text-white/70 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/cadastro"
                  className="btn-primary w-full py-4 text-center animate-pulse-glow"
                  id="plan-yearly-cta"
                >
                  Assinar Agora
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Guarantee */}
        <div className="text-center mt-12">
          <p className="text-white/30 text-sm">
            🔒 Garantia de 7 dias. Se não gostar, devolvemos seu dinheiro.
          </p>
        </div>
      </div>
    </section>
  )
}
