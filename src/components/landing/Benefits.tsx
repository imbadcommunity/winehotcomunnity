'use client'

import { GraduationCap, Users, Video, Award, Headphones, TrendingUp } from 'lucide-react'
import { BENEFITS } from '@/lib/constants'

const iconMap = {
  GraduationCap,
  Users,
  Video,
  Award,
  Headphones,
  TrendingUp,
} as const

export function Benefits() {
  return (
    <section id="beneficios" className="relative py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="badge badge-wine mb-4">✨ Por que nos escolher</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
            Tudo que você precisa para{' '}
            <span className="gradient-text-wine-gold">evoluir</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Uma plataforma completa pensada para acelerar seu crescimento profissional
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
          {BENEFITS.map((benefit, index) => {
            const Icon = iconMap[benefit.icon as keyof typeof iconMap]
            return (
              <div
                key={index}
                className="card-glass p-8 group hover:border-wine-500/20 relative overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-wine-500/5 to-transparent" />

                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl gradient-wine flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg shadow-wine-500/20">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-white/40 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
