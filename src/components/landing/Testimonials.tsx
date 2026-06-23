'use client'

import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/constants'

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  const next = () => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length)
  }

  const prev = () => {
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  }

  return (
    <section id="depoimentos" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-wine-700/5 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="badge badge-gold mb-4">⭐ Depoimentos</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
            O que nossos{' '}
            <span className="gradient-text-gold">membros dizem</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Histórias reais de transformação de quem já faz parte da comunidade
          </p>
        </div>

        {/* Testimonials carousel */}
        <div className="max-w-4xl mx-auto">
          {/* Main testimonial */}
          <div className="card-glass p-8 sm:p-12 relative">
            <Quote className="absolute top-6 right-6 w-12 h-12 text-wine-500/10" />

            <div className="flex flex-col items-center text-center">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(TESTIMONIALS[activeIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-gold-400 fill-current" />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-xl sm:text-2xl text-white/80 leading-relaxed mb-8 font-light italic">
                &ldquo;{TESTIMONIALS[activeIndex].text}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full gradient-wine-gold flex items-center justify-center text-white font-bold text-lg">
                  {TESTIMONIALS[activeIndex].name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold text-lg">
                    {TESTIMONIALS[activeIndex].name}
                  </p>
                  <p className="text-white/40">
                    {TESTIMONIALS[activeIndex].role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="btn-secondary p-3 rounded-full"
              id="testimonial-prev"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'bg-wine-500 w-8'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Depoimento ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="btn-secondary p-3 rounded-full"
              id="testimonial-next"
              aria-label="Próximo depoimento"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mini testimonial cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
          {TESTIMONIALS.map((testimonial, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`card-glass p-5 text-left transition-all duration-300 cursor-pointer ${
                index === activeIndex
                  ? 'border-wine-500/30 bg-wine-500/5'
                  : 'hover:border-white/10'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full gradient-wine flex items-center justify-center text-white text-xs font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{testimonial.name}</p>
                  <p className="text-white/30 text-xs">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-white/40 text-sm line-clamp-2">
                {testimonial.text}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
