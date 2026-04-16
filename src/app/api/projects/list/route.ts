import { NextRequest, NextResponse } from 'next/server'

import { getCurrentUser } from '@/lib/getCurrentUser'
import { createClient } from '@/lib/supabaseServer'

export async function GET() {
  const supabase = await createClient()

  const user = await getCurrentUser()

  if (!user?.id) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase.from('projects').select('*').eq('owner_id', user.id)

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ data: null })
  }

  return NextResponse.json({ data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized', status: false }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const project = body?.project

  if (!project?.name || (project?.type !== 'building' && project?.type !== 'home')) {
    return NextResponse.json({ data: null, error: 'Invalid project payload' }, { status: 400 })
  }

  const { data: insertedProject, error } = await supabase
    .from('projects')
    .insert({
      id: Date.now(),
      active: Boolean(project.active),
      address: project.address ?? null,
      contractor: project.contractor ?? null,
      customer: project.customer ?? null,
      name: project.name,
      owner_id: user.id,
      type: project.type
    })
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: insertedProject })
}
