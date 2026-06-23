'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Subscription } from '@/types/database'

export function useUser() {
  const [user, setUser] = useState<{
    id: string
    email: string
    profile: Profile | null
    subscription: Subscription | null
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        setUser(null)
        setLoading(false)
        return
      }

      const [profileResult, subResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', authUser.id).single(),
        supabase.from('subscriptions').select('*').eq('user_id', authUser.id).single(),
      ])

      setUser({
        id: authUser.id,
        email: authUser.email || '',
        profile: profileResult.data,
        subscription: subResult.data,
      })
      setLoading(false)
    }

    fetchUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      fetchUser()
    })

    return () => subscription.unsubscribe()
  }, [])

  return { user, loading }
}
