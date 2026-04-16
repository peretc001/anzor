import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/lib/getCurrentUser'
import { createClient } from '@/lib/supabaseServer'

export async function GET() {
  const user = await getCurrentUser()

  if (!user?.id) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: data ?? [] })
}

export async function POST(request: Request) {
  const user = await getCurrentUser()

  if (!user?.id) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const task = body?.task
  if (!task?.title || typeof task.title !== 'string') {
    return NextResponse.json({ data: null, error: 'Invalid task payload' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      id: Number(task.id) || Date.now(),
      control: task.control ?? null,
      description: task.description ?? null,
      executor: task.executor ?? null,
      owner_id: user.id,
      photos: Array.isArray(task.photos) ? task.photos : null,
      title: task.title.trim()
    })
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
