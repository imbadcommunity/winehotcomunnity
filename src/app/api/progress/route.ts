import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('progress')
    .select('*, lessons(title, module_id, modules(title, course_id, courses(title)))')
    .eq('user_id', user.id)
    .order('last_watched_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { lesson_id, watched_percentage, completed } = body

  if (!lesson_id) return NextResponse.json({ error: 'lesson_id required' }, { status: 400 })

  // Upsert progress
  const { data: existing } = await supabase
    .from('progress')
    .select('id')
    .eq('user_id', user.id)
    .eq('lesson_id', lesson_id)
    .single()

  if (existing) {
    const { data, error } = await supabase
      .from('progress')
      .update({
        watched_percentage: watched_percentage ?? undefined,
        completed: completed ?? undefined,
        last_watched_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  }

  const { data, error } = await supabase
    .from('progress')
    .insert({
      user_id: user.id,
      lesson_id,
      watched_percentage: watched_percentage ?? 0,
      completed: completed ?? false,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
