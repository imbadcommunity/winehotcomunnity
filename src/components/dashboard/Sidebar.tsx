'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  Calendar,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  Shield,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { APP_NAME } from '@/lib/constants'
import { getInitials } from '@/lib/utils'

interface SidebarProps {
  user: {
    id: string
    email: string
    full_name: string
    avatar_url: string
    role: string
  }
}

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Cursos', href: '/cursos', icon: BookOpen },
  { label: 'Comunidade', href: '/comunidade', icon: MessageSquare },
  { label: 'Calendário', href: '/calendario', icon: Calendar },
]

export function Sidebar({ user }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl gradient-wine flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">{APP_NAME}</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        <p className="text-[11px] font-semibold text-white/20 uppercase tracking-wider px-3 mb-3">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}

        {user.role === 'admin' && (
          <>
            <div className="h-px bg-white/5 my-4" />
            <p className="text-[11px] font-semibold text-white/20 uppercase tracking-wider px-3 mb-3">
              Admin
            </p>
            <Link
              href="/admin"
              className={`sidebar-link ${pathname.startsWith('/admin') ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <Shield className="w-5 h-5" />
              Painel Admin
            </Link>
          </>
        )}
      </nav>

      {/* User section */}
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full gradient-wine-gold flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {getInitials(user.full_name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user.full_name || 'Usuário'}
            </p>
            <p className="text-white/30 text-xs truncate">{user.email}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href="/perfil"
            className="btn-ghost text-xs flex-1 py-2"
            onClick={() => setMobileOpen(false)}
          >
            <User className="w-4 h-4" />
            Perfil
          </Link>
          <button
            onClick={handleLogout}
            className="btn-ghost text-xs flex-1 py-2 hover:text-red-400"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl glass"
        id="sidebar-toggle"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-dark-800 border-r border-white/5 z-50 transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setMobileOpen(false)}
          className="absolute top-4 right-4 text-white/50 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        {renderSidebarContent()}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 bottom-0 w-72 bg-dark-800 border-r border-white/5 z-30">
        {renderSidebarContent()}
      </aside>
    </>
  )
}
