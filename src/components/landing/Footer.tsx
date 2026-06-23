import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { APP_NAME } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl gradient-wine flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">{APP_NAME}</span>
            </Link>
            <p className="text-white/30 max-w-md leading-relaxed">
              Sua comunidade premium de cursos e networking exclusivo. 
              Transforme sua carreira com conteúdo de alta qualidade.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Plataforma
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="#beneficios" className="text-white/30 hover:text-white transition-colors text-sm">
                  Benefícios
                </a>
              </li>
              <li>
                <a href="#planos" className="text-white/30 hover:text-white transition-colors text-sm">
                  Planos
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="text-white/30 hover:text-white transition-colors text-sm">
                  Depoimentos
                </a>
              </li>
              <li>
                <a href="#faq" className="text-white/30 hover:text-white transition-colors text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Conta
            </h4>
            <ul className="space-y-3">
              <li>
                <Link href="/login" className="text-white/30 hover:text-white transition-colors text-sm">
                  Entrar
                </Link>
              </li>
              <li>
                <Link href="/cadastro" className="text-white/30 hover:text-white transition-colors text-sm">
                  Criar Conta
                </Link>
              </li>
              <li>
                <Link href="/recuperar-senha" className="text-white/30 hover:text-white transition-colors text-sm">
                  Recuperar Senha
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/20 text-sm">
            © {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/20 hover:text-white/50 transition-colors text-sm">
              Termos de Uso
            </a>
            <a href="#" className="text-white/20 hover:text-white/50 transition-colors text-sm">
              Privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
