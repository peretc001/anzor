import { NextResponse } from 'next/server'

import { ensureUserOwnsProject } from '@/lib/ensureUserOwnsProject'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { s3DeleteObject, s3KeyFromStoredUrl } from '@/lib/s3'
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

  const allowed = await ensureUserOwnsProject(supabase, user.id, projectId)

  if (!allowed) {
    return NextResponse.json({ error: 'Project not found', ok: false }, { status: 404 })
  }

  const { data: taskRows, error: tasksFetchError } = await supabase
    .from('tasks')
    .select('photos')
    .eq('project_id', projectId)
    .eq('owner_id', user.id)

  const { data: galleryRows, error: galleryFetchError } = await supabase
    .from('gallery')
    .select('url')
    .eq('project_id', projectId)
    .eq('owner_id', user.id)

  const { data: documentRows, error: documentsFetchError } = await supabase
    .from('documents')
    .select('url')
    .eq('project_id', projectId)
    .eq('owner_id', user.id)

  const fetchError = tasksFetchError ?? galleryFetchError ?? documentsFetchError

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message, ok: false }, { status: 500 })
  }

  const urls = new Set<string>()

  for (const row of taskRows ?? []) {
    if (Array.isArray(row.photos)) {
      for (const u of row.photos) {
        if (typeof u === 'string' && u.trim() !== '') {
          urls.add(u)
        }
      }
    }
  }

  for (const row of galleryRows ?? []) {
    if (typeof row.url === 'string' && row.url.trim() !== '') {
      urls.add(row.url)
    }
  }

  for (const row of documentRows ?? []) {
    if (typeof row.url === 'string' && row.url.trim() !== '') {
      urls.add(row.url)
    }
  }

  const { error: galleryDeleteError } = await supabase
    .from('gallery')
    .delete()
    .eq('project_id', projectId)
    .eq('owner_id', user.id)

  if (galleryDeleteError) {
    return NextResponse.json({ error: galleryDeleteError.message, ok: false }, { status: 500 })
  }

  const { error: documentsDeleteError } = await supabase
    .from('documents')
    .delete()
    .eq('project_id', projectId)
    .eq('owner_id', user.id)

  if (documentsDeleteError) {
    return NextResponse.json({ error: documentsDeleteError.message, ok: false }, { status: 500 })
  }

  const { error: tasksDeleteError } = await supabase
    .from('tasks')
    .delete()
    .eq('project_id', projectId)
    .eq('owner_id', user.id)

  if (tasksDeleteError) {
    return NextResponse.json({ error: tasksDeleteError.message, ok: false }, { status: 500 })
  }

  for (const url of urls) {
    const key = s3KeyFromStoredUrl(url)
    if (key) {
      await s3DeleteObject(key).catch(() => {})
    }
  }

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
