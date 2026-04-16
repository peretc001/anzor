import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/lib/getCurrentUser'
import { createClient } from '@/lib/supabaseServer'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const projectId = Number(id)

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return NextResponse.json({ data: null, error: 'Invalid project id' }, { status: 400 })
  }

  const user = await getCurrentUser()

  if (!user?.id) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('owner_id', user.id)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ data: null, error: 'Project not found' }, { status: 404 })
  }

  return NextResponse.json({ data })
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const projectId = Number(id)

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return NextResponse.json({ error: 'Invalid project id', ok: false }, { status: 400 })
  }

  const user = await getCurrentUser()

  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized', ok: false }, { status: 401 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .delete()
    .eq('id', projectId)
    .eq('owner_id', user.id)
    .select('id')

  if (error) {
    return NextResponse.json({ error: error.message, ok: false }, { status: 500 })
  }

  if (!data?.length) {
    return NextResponse.json({ error: 'Project not found', ok: false }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
