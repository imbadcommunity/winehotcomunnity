'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, Play, ArrowRight, Sparkles } from 'lucide-react'
import { APP_NAME } from '@/lib/constants'

export function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <section className="relative min-h-screen hero-gradient noise-overlay overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-wine-700/10 blur-[120px] animate-float" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-gold-500/8 blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-20 left-1/3 w-72 h-72 rounded-full bg-wine-500/8 blur-[100px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl gradient-wine flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {APP_NAME}
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              <a href="#beneficios" className="btn-ghost text-sm">Benefícios</a>
              <a href="#depoimentos" className="btn-ghost text-sm">Depoimentos</a>
              <a href="#planos" className="btn-ghost text-sm">Planos</a>
              <a href="#faq" className="btn-ghost text-sm">FAQ</a>
              <div className="w-px h-6 bg-white/10 mx-2" />
              <Link href="/login" className="btn-secondary text-sm">
                Entrar
              </Link>
              <Link href="/cadastro" className="btn-primary text-sm">
                Começar Agora
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white"
              id="mobile-menu-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-strong animate-fade-in-down mx-4 rounded-2xl p-6 space-y-4">
            <a href="#beneficios" className="block py-2 text-white/70 hover:text-white transition-colors">Benefícios</a>
            <a href="#depoimentos" className="block py-2 text-white/70 hover:text-white transition-colors">Depoimentos</a>
            <a href="#planos" className="block py-2 text-white/70 hover:text-white transition-colors">Planos</a>
            <a href="#faq" className="block py-2 text-white/70 hover:text-white transition-colors">FAQ</a>
            <div className="h-px bg-white/10" />
            <div className="flex flex-col gap-3">
              <Link href="/login" className="btn-secondary text-center">Entrar</Link>
              <Link href="/cadastro" className="btn-primary text-center">Começar Agora</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/70">+500 membros ativos na comunidade</span>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6" style={{ animationDelay: '0.1s' }}>
            <span className="text-white">Domine o Mercado com </span>
            <span className="gradient-text-wine-gold">Conhecimento Premium</span>
          </h1>

          {/* Subheadline */}
          <p className="animate-fade-in-up text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Acesso ilimitado a cursos exclusivos, comunidade vibrante e aulas ao vivo 
            com os melhores especialistas do mercado. Transforme sua carreira hoje.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up flex flex-col sm:flex-row items-center justify-center gap-4 mb-16" style={{ animationDelay: '0.3s' }}>
            <Link
              href="/cadastro"
              className="btn-primary text-base px-8 py-4 animate-pulse-glow"
              id="hero-cta"
            >
              Assinar Agora
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#video"
              className="btn-secondary text-base px-8 py-4 group"
              id="hero-video-btn"
            >
              <Play className="w-5 h-5 group-hover:text-wine-400 transition-colors" />
              Ver Apresentação
            </a>
          </div>

          {/* Video Section */}
          <div id="video" className="animate-fade-in-up relative max-w-4xl mx-auto" style={{ animationDelay: '0.4s' }}>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
              {/* Video placeholder / Bunny Stream embed */}
              <div className="aspect-video bg-dark-800 flex items-center justify-center relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
                <div className="relative z-10 w-20 h-20 rounded-full glass-strong flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
                <div className="absolute bottom-6 left-6 z-10">
                  <p className="text-white font-semibold">Conheça a Wine Hot Community</p>
                  <p className="text-white/50 text-sm">2:30 min</p>
                </div>
              </div>
            </div>
            {/* Decorative glow */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-wine-500/20 via-transparent to-gold-500/20 blur-xl -z-10" />
          </div>

          {/* Social proof */}
          <div className="animate-fade-in-up flex items-center justify-center gap-8 mt-12 flex-wrap" style={{ animationDelay: '0.5s' }}>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-3">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-dark-900 gradient-wine flex items-center justify-center text-[10px] font-bold text-white"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="text-sm text-white/50">+500 alunos</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-gold-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm text-white/50 ml-1">4.9/5 de satisfação</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-dark-900 to-transparent" />
    </section>
  )
}
