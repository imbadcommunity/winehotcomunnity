# 🍷 Wine Hot Community

Plataforma SaaS premium de cursos e comunidade, estilo Netflix.

## Stack Técnica

- **Next.js 15** (App Router)
- **React** + **TypeScript**
- **Tailwind CSS v4**
- **Supabase** (Auth, PostgreSQL, RLS)
- **Vercel** deployment ready

## 🚀 Instalação

### 1. Clone e instale

```bash
cd wine-hot-community
npm install
```

### 2. Configure o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Copie o arquivo de exemplo de variáveis de ambiente:

```bash
cp .env.local.example .env.local
```

3. Edite `.env.local` com suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

### 3. Configure o Banco de Dados

Execute o schema SQL no Supabase:

1. Acesse o **Supabase Dashboard** → **SQL Editor**
2. Cole o conteúdo de `src/supabase/migrations/001_initial_schema.sql`
3. Execute o SQL

### 4. Configure o Google OAuth (Opcional)

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um OAuth 2.0 Client ID
3. No **Supabase Dashboard** → **Authentication** → **Providers** → **Google**
4. Adicione o Client ID e Client Secret

### 5. Crie um Admin

Após registrar sua conta, execute no SQL Editor do Supabase:

```sql
UPDATE public.profiles SET role = 'admin' WHERE id = 'SEU_USER_ID';
```

### 6. Ative uma assinatura (para desenvolvimento)

```sql
UPDATE public.subscriptions
SET status = 'active', plan = 'yearly', expires_at = NOW() + INTERVAL '1 year'
WHERE user_id = 'SEU_USER_ID';
```

### 7. Execute

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📂 Estrutura do Projeto

```
src/
├── app/
│   ├── (public)/          # Landing page
│   ├── (auth)/            # Login, Cadastro, Recuperar senha
│   ├── (dashboard)/       # Dashboard, Cursos, Comunidade, Calendário
│   ├── (admin)/           # Painel administrativo
│   ├── upgrade/           # Página de upgrade de assinatura
│   └── api/               # API routes (progress, posts, comments, likes)
├── components/
│   ├── landing/           # Componentes da landing page
│   ├── dashboard/         # Sidebar, cards
│   └── community/         # Posts, comentários
├── lib/
│   ├── supabase/          # Clients (browser, server, admin)
│   ├── utils.ts           # Funções utilitárias
│   └── constants.ts       # Constantes da app
├── hooks/                 # Custom hooks (useUser, useProgress, useSubscription)
├── types/                 # TypeScript types
└── middleware.ts           # Auth + Subscription middleware
```

## 🔐 Segurança

- **Middleware** protege todas as rotas privadas
- **Supabase Auth** com cookies HTTP-only
- **RLS Policies** em todas as tabelas
- **Session refresh** automático via middleware
- Verificação de role `admin` para rotas admin
- Verificação de assinatura `active` para conteúdos

## 🎨 Design

- Tema escuro premium (inspirado em Netflix/Skool)
- Paleta: Vinho (#8B1A4A → #C62E65) + Dourado (#D4A853 → #F0C674)
- Glassmorphism, glow effects, micro-animações
- Totalmente responsivo

## 🚢 Deploy na Vercel

1. Push para o GitHub
2. Conecte no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente
4. Deploy!

## 📋 Funcionalidades

| Feature | Status |
|---------|--------|
| Landing page moderna | ✅ |
| Auth (email + Google) | ✅ |
| Middleware de autenticação | ✅ |
| Sistema de assinaturas | ✅ |
| CRUD de cursos | ✅ |
| CRUD de módulos e aulas | ✅ |
| Player de vídeo (Bunny Stream) | ✅ |
| Progresso de aulas | ✅ |
| Dashboard do aluno | ✅ |
| Comunidade (posts, likes, comments) | ✅ |
| Calendário de eventos | ✅ |
| Painel admin completo | ✅ |
| Schema SQL + RLS | ✅ |
| Vercel-ready | ✅ |
