import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/lib/getCurrentUser'
import { s3DeleteObject, s3KeyFromStoredUrl } from '@/lib/s3'
import { createClient } from '@/lib/supabaseServer'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params
  const taskId = Number(id)

  if (!Number.isInteger(taskId) || taskId <= 0) {
    return NextResponse.json({ data: null, error: 'Invalid task id' }, { status: 400 })
  }

  const user = await getCurrentUser()

  if (!user?.id) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)

  const updates: {
    photos?: null | string[]
    priority?: string
    status?: string
    type?: string
  } = {}

  if (body && 'photos' in body) {
    const photos = body.photos
    if (photos != null && !Array.isArray(photos)) {
      return NextResponse.json({ data: null, error: 'Invalid photos payload' }, { status: 400 })
    }
    updates.photos = Array.isArray(photos) ? photos : null
  }

  if (body && 'status' in body) {
    updates.status = body.status
  }

  if (body && 'type' in body) {
    updates.type = body.type
  }

  if (body && 'priority' in body) {
    updates.priority = body.priority
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ data: null, error: 'No fields to update' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .eq('owner_id', user.id)
    .select('*')
    .maybeSingle()

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ data: null, error: 'Task not found' }, { status: 404 })
  }

  return NextResponse.json({ data })
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const taskId = Number(id)

  if (!Number.isInteger(taskId) || taskId <= 0) {
    return NextResponse.json({ error: 'Invalid task id', ok: false }, { status: 400 })
  }

  const user = await getCurrentUser()

  if (!user?.id) {
    return NextResponse.json({ error: 'Unauthorized', ok: false }, { status: 401 })
  }

  const supabase = await createClient()

  const { data: task, error: taskFetchError } = await supabase
    .from('tasks')
    .select('id, photos')
    .eq('id', taskId)
    .eq('owner_id', user.id)
    .maybeSingle()

  if (taskFetchError) {
    return NextResponse.json({ error: taskFetchError.message, ok: false }, { status: 500 })
  }

  if (!task) {
    return NextResponse.json({ error: 'Task not found', ok: false }, { status: 404 })
  }

  const { data: galleryRows, error: galleryFetchError } = await supabase
    .from('gallery')
    .select('url')
    .eq('task_id', taskId)
    .eq('owner_id', user.id)

  if (galleryFetchError) {
    return NextResponse.json({ error: galleryFetchError.message, ok: false }, { status: 500 })
  }

  const urls = new Set<string>()

  for (const row of galleryRows ?? []) {
    if (typeof row.url === 'string' && row.url.trim() !== '') {
      urls.add(row.url)
    }
  }

  if (Array.isArray(task.photos)) {
    for (const u of task.photos) {
      if (typeof u === 'string' && u.trim() !== '') {
        urls.add(u)
      }
    }
  }

  const { error: galleryDeleteError } = await supabase
    .from('gallery')
    .delete()
    .eq('task_id', taskId)
    .eq('owner_id', user.id)

  if (galleryDeleteError) {
    return NextResponse.json({ error: galleryDeleteError.message, ok: false }, { status: 500 })
  }

  for (const url of urls) {
    const key = s3KeyFromStoredUrl(url)
    if (key) {
      await s3DeleteObject(key).catch(() => {})
    }
  }

  const { data: deletedRows, error: taskDeleteError } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId)
    .eq('owner_id', user.id)
    .select('id')

  if (taskDeleteError) {
    return NextResponse.json({ error: taskDeleteError.message, ok: false }, { status: 500 })
  }

  if (!deletedRows?.length) {
    return NextResponse.json({ error: 'Task not found', ok: false }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
