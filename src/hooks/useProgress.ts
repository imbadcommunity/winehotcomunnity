'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useProgress(userId: string | null) {
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const saveProgress = useCallback(
    async (lessonId: string, percentage: number, completed: boolean = false) => {
      if (!userId) return
      setSaving(true)

      const { data: existing } = await supabase
        .from('progress')
        .select('id')
        .eq('user_id', userId)
        .eq('lesson_id', lessonId)
        .single()

      if (existing) {
        await supabase
          .from('progress')
          .update({
            watched_percentage: percentage,
            completed,
            last_watched_at: new Date().toISOString(),
          })
          .eq('id', existing.id)
      } else {
        await supabase.from('progress').insert({
          user_id: userId,
          lesson_id: lessonId,
          watched_percentage: percentage,
          completed,
        })
      }

      setSaving(false)
    },
    [userId]
  )

  const markComplete = useCallback(
    async (lessonId: string) => {
      await saveProgress(lessonId, 100, true)
    },
    [saveProgress]
  )

  return { saveProgress, markComplete, saving }
}
