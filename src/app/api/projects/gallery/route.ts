import { NextResponse } from 'next/server'

import { ensureUserOwnsProject } from '@/lib/ensureUserOwnsProject'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { s3DeleteObject, s3KeyFromStoredUrl, s3UploadFile } from '@/lib/s3'
import { createClient } from '@/lib/supabaseServer'

const MAX_GALLERY_BYTES = 15 * 1024 * 1024

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/gif': 'gif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
}

export async function GET(request: Request) {
  const supabase = await createClient()

  const user = await getCurrentUser()

  if (!user?.id) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const projectIdRaw = new URL(request.url).searchParams.get('project_id')
  const projectId = projectIdRaw != null && projectIdRaw !== '' ? Number(projectIdRaw) : NaN

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return NextResponse.json({ data: null, error: 'Invalid project_id' }, { status: 400 })
  }

  const allowed = await ensureUserOwnsProject(supabase, user.id, projectId)

  if (!allowed) {
    return NextResponse.json({ data: null, error: 'Project not found' }, { status: 404 })
  }

  const { data, error } = await supabase
    .from('gallery')
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
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized', status: false }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file')
    const projectIdRaw = formData.get('project_id')
    const projectId =
      typeof projectIdRaw === 'string' && projectIdRaw.trim() !== '' ? Number(projectIdRaw) : NaN

    if (!Number.isInteger(projectId) || projectId <= 0) {
      return NextResponse.json({ error: 'Invalid project_id', status: false }, { status: 400 })
    }

    const taskIdRaw = formData.get('task_id')
    const taskId =
      typeof taskIdRaw === 'string' && taskIdRaw.trim() !== '' ? Number(taskIdRaw) : null

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File is required', status: false }, { status: 400 })
    }

    if (taskIdRaw != null && (!Number.isInteger(taskId) || (taskId as number) <= 0)) {
      return NextResponse.json({ error: 'Invalid task_id', status: false }, { status: 400 })
    }

    const mime = file.type || 'application/octet-stream'
    const ext = ALLOWED_IMAGE_TYPES[mime]

    if (!ext) {
      return NextResponse.json({ error: 'Invalid file type', status: false }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()

    if (buffer.byteLength > MAX_GALLERY_BYTES) {
      return NextResponse.json({ error: 'File too large', status: false }, { status: 400 })
    }

    const body = new Uint8Array(buffer)
    const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`
    const key = `${user.id}/gallery/${projectId}/${fileName}`

    const supabase = await createClient()

    const allowed = await ensureUserOwnsProject(supabase, user.id, projectId)

    if (!allowed) {
      return NextResponse.json({ error: 'Project not found', status: false }, { status: 404 })
    }

    if (taskId != null) {
      const { data: taskRow, error: taskLookupError } = await supabase
        .from('tasks')
        .select('id, project_id')
        .eq('id', taskId)
        .eq('owner_id', user.id)
        .maybeSingle()

      if (taskLookupError) {
        return NextResponse.json({ error: taskLookupError.message, status: false }, { status: 500 })
      }

      if (!taskRow || Number(taskRow.project_id) !== projectId) {
        return NextResponse.json({ error: 'Invalid task_id for this project', status: false }, { status: 400 })
      }
    }

    await s3UploadFile({
      key,
      body,
      contentType: mime
    })

    const galleryUrl = `/${key}`

    const { error: saveError } = await supabase.from('gallery').insert({
      owner_id: user.id,
      project_id: projectId,
      task_id: taskId,
      url: galleryUrl
    })

    if (saveError) {
      await s3DeleteObject(key).catch(() => {})
      return NextResponse.json({ error: saveError.message, status: false }, { status: 500 })
    }

    return NextResponse.json({ status: true, url: galleryUrl })
  } catch (err) {
    return NextResponse.json({ error: String(err), status: false }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized', status: false }, { status: 401 })
    }

    const idParam = new URL(request.url).searchParams.get('id')
    const id = idParam != null && idParam !== '' ? Number(idParam) : NaN

    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: 'Invalid id', status: false }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: row, error: fetchError } = await supabase
      .from('gallery')
      .select('id, project_id, task_id, url')
      .eq('id', id)
      .eq('owner_id', user.id)
      .maybeSingle()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message, status: false }, { status: 500 })
    }

    if (!row) {
      return NextResponse.json({ error: 'Not found', status: false }, { status: 404 })
    }

    const url = typeof row.url === 'string' ? row.url : ''
    const rawTaskId = row.task_id as number | string | null | undefined
    const taskId =
      typeof rawTaskId === 'number' && Number.isInteger(rawTaskId) && rawTaskId > 0
        ? rawTaskId
        : typeof rawTaskId === 'string' && /^\d+$/.test(rawTaskId)
          ? Number(rawTaskId)
          : null

    if (taskId != null) {
      const { data: taskRow, error: taskFetchError } = await supabase
        .from('tasks')
        .select('id, photos')
        .eq('id', taskId)
        .eq('owner_id', user.id)
        .maybeSingle()

      if (taskFetchError) {
        return NextResponse.json({ error: taskFetchError.message, status: false }, { status: 500 })
      }

      if (taskRow && Array.isArray(taskRow.photos) && taskRow.photos.includes(url)) {
        const nextPhotos = taskRow.photos.filter((p: string) => p !== url)
        const { error: taskUpdateError } = await supabase
          .from('tasks')
          .update({ photos: nextPhotos.length > 0 ? nextPhotos : null })
          .eq('id', taskId)
          .eq('owner_id', user.id)

        if (taskUpdateError) {
          return NextResponse.json({ error: taskUpdateError.message, status: false }, { status: 500 })
        }
      }
    }

    const key = s3KeyFromStoredUrl(url)

    if (key) {
      await s3DeleteObject(key).catch(() => {})
    }

    const { error: deleteError } = await supabase.from('gallery').delete().eq('id', id).eq('owner_id', user.id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message, status: false }, { status: 500 })
    }

    return NextResponse.json({ status: true })
  } catch (err) {
    return NextResponse.json({ error: String(err), status: false }, { status: 500 })
  }
}
