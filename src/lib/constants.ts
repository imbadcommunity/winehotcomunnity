export const APP_NAME = 'Wine Hot Community'
export const APP_DESCRIPTION = 'Sua comunidade premium de cursos e networking exclusivo'

export const PLANS = {
  monthly: {
    id: 'monthly',
    name: 'Mensal',
    price: 'R$ 49,90',
    priceValue: 49.90,
    interval: '/mês',
    features: [
      'Acesso a todos os cursos',
      'Comunidade exclusiva',
      'Aulas ao vivo semanais',
      'Certificados de conclusão',
      'Suporte prioritário',
    ],
  },
  yearly: {
    id: 'yearly',
    name: 'Anual',
    price: 'R$ 399,90',
    priceValue: 399.90,
    interval: '/ano',
    badge: 'Mais popular',
    savings: 'Economize R$ 198,90',
    features: [
      'Tudo do plano mensal',
      'Acesso a todos os cursos',
      'Comunidade exclusiva',
      'Aulas ao vivo semanais',
      'Certificados de conclusão',
      'Suporte prioritário',
      'Mentorias em grupo mensais',
      'Conteúdo antecipado',
    ],
  },
} as const

export const BENEFITS = [
  {
    icon: 'GraduationCap',
    title: 'Cursos Premium',
    description: 'Acesso ilimitado a cursos exclusivos com conteúdo atualizado constantemente.',
  },
  {
    icon: 'Users',
    title: 'Comunidade Ativa',
    description: 'Conecte-se com outros membros, compartilhe experiências e cresça junto.',
  },
  {
    icon: 'Video',
    title: 'Aulas ao Vivo',
    description: 'Participe de aulas ao vivo semanais com especialistas do mercado.',
  },
  {
    icon: 'Award',
    title: 'Certificados',
    description: 'Receba certificados ao concluir cada curso para comprovar seu conhecimento.',
  },
  {
    icon: 'Headphones',
    title: 'Suporte Dedicado',
    description: 'Tenha suporte prioritário para tirar todas as suas dúvidas rapidamente.',
  },
  {
    icon: 'TrendingUp',
    title: 'Resultados Reais',
    description: 'Metodologia comprovada com foco em resultados práticos e aplicáveis.',
  },
] as const

export const TESTIMONIALS = [
  {
    name: 'Maria Santos',
    role: 'Empreendedora',
    avatar: null,
    text: 'A plataforma transformou completamente minha forma de aprender. O conteúdo é incrível e a comunidade é muito acolhedora.',
    rating: 5,
  },
  {
    name: 'João Silva',
    role: 'Investidor',
    avatar: null,
    text: 'Melhor investimento que fiz. Os cursos são práticos e direto ao ponto. Já recuperei o valor da assinatura no primeiro mês.',
    rating: 5,
  },
  {
    name: 'Ana Oliveira',
    role: 'Consultora',
    avatar: null,
    text: 'A comunidade é o grande diferencial. Networking de qualidade e troca de experiências que não encontro em nenhum outro lugar.',
    rating: 5,
  },
  {
    name: 'Carlos Mendes',
    role: 'Empresário',
    avatar: null,
    text: 'As aulas ao vivo são incríveis. Poder interagir com os professores em tempo real faz toda a diferença no aprendizado.',
    rating: 5,
  },
] as const

export const FAQ_ITEMS = [
  {
    question: 'Como funciona a assinatura?',
    answer: 'Ao assinar, você terá acesso imediato a todos os cursos, comunidade, aulas ao vivo e materiais exclusivos. A assinatura é recorrente e pode ser cancelada a qualquer momento.',
  },
  {
    question: 'Posso cancelar a qualquer momento?',
    answer: 'Sim! Não há fidelidade. Você pode cancelar sua assinatura quando quiser e continuará tendo acesso até o fim do período pago.',
  },
  {
    question: 'Os cursos possuem certificado?',
    answer: 'Sim! Ao concluir cada curso, você receberá um certificado digital que pode ser compartilhado no LinkedIn e outras redes.',
  },
  {
    question: 'Como acesso a comunidade?',
    answer: 'A comunidade é acessada diretamente pela plataforma. Basta fazer login e navegar até a seção "Comunidade" para interagir com outros membros.',
  },
  {
    question: 'Tem suporte técnico?',
    answer: 'Sim! Oferecemos suporte técnico e pedagógico. Assinantes do plano anual têm acesso a suporte prioritário com resposta em até 24 horas.',
  },
  {
    question: 'Os conteúdos são atualizados?',
    answer: 'Sim! Novos conteúdos são adicionados semanalmente e os cursos existentes são atualizados regularmente para manter a relevância.',
  },
] as const

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Cursos', href: '/cursos', icon: 'BookOpen' },
  { label: 'Comunidade', href: '/comunidade', icon: 'MessageSquare' },
  { label: 'Calendário', href: '/calendario', icon: 'Calendar' },
] as const

export const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: 'LayoutDashboard' },
  { label: 'Cursos', href: '/admin/cursos', icon: 'BookOpen' },
  { label: 'Usuários', href: '/admin/usuarios', icon: 'Users' },
  { label: 'Assinaturas', href: '/admin/assinaturas', icon: 'CreditCard' },
] as const
