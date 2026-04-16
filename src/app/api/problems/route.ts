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
    .from('problems')
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
  const problem = body?.problem

  if (!problem?.title || typeof problem.title !== 'string') {
    return NextResponse.json({ data: null, error: 'Invalid problem payload' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('problems')
    .insert({
      id: Number(problem.id) || Date.now(),
      title: problem.title.trim(),
      description: problem.description ?? null,
      executor: problem.executor ?? null,
      photos: Array.isArray(problem.photos) ? problem.photos : null,
      control: problem.control ?? null,
      owner_id: user.id
    })
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
