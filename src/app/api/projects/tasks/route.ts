import { NextResponse } from 'next/server'

import { ensureUserOwnsProject } from '@/lib/ensureUserOwnsProject'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { createClient } from '@/lib/supabaseServer'

export async function GET(request: Request) {
  const user = await getCurrentUser()

  if (!user?.id) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const projectIdRaw = new URL(request.url).searchParams.get('project_id')
  const projectId = projectIdRaw != null && projectIdRaw !== '' ? Number(projectIdRaw) : NaN

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return NextResponse.json({ data: null, error: 'Invalid project_id' }, { status: 400 })
  }

  const supabase = await createClient()

  const allowed = await ensureUserOwnsProject(supabase, user.id, projectId)

  if (!allowed) {
    return NextResponse.json({ data: null, error: 'Project not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('owner_id', user.id)
    .eq('project_id', projectId)
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

  const projectId = Number(task.project_id)

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return NextResponse.json({ data: null, error: 'Invalid project_id' }, { status: 400 })
  }

  const supabase = await createClient()

  const allowed = await ensureUserOwnsProject(supabase, user.id, projectId)

  if (!allowed) {
    return NextResponse.json({ data: null, error: 'Project not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      control: task.control ?? null,
      description: task.description ?? null,
      executor: task.executor ?? null,
      owner_id: user.id,
      photos: Array.isArray(task.photos) ? task.photos : null,
      priority: task.priority,
      project_id: projectId,
      status: task.status,
      title: task.title.trim(),
      type: task.type
    })
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
