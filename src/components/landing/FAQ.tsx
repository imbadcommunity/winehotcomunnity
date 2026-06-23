'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { FAQ_ITEMS } from '@/lib/constants'

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="badge badge-wine mb-4">❓ FAQ</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
            Perguntas{' '}
            <span className="gradient-text-wine">Frequentes</span>
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto">
            Tire suas dúvidas sobre a plataforma
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className={`card-glass overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'border-wine-500/20' : ''
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left group"
                id={`faq-item-${index}`}
              >
                <span className="text-white font-semibold pr-4 group-hover:text-wine-400 transition-colors">
                  {item.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-white/30 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180 text-wine-400' : ''
                  }`}
                />
              </button>

              <div
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index
                    ? 'max-h-96 opacity-100'
                    : 'max-h-0 opacity-0'
                } overflow-hidden`}
              >
                <div className="px-6 pb-6">
                  <p className="text-white/40 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
