import { NextResponse } from 'next/server'

import { ensureUserOwnsProject } from '@/lib/ensureUserOwnsProject'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { s3DeleteObject, s3KeyFromStoredUrl, s3UploadFile } from '@/lib/s3'
import { createClient } from '@/lib/supabaseServer'

const MAX_DOCUMENT_BYTES = 20 * 1024 * 1024

const ALLOWED_PDF_TYPES: Record<string, string> = {
  'application/pdf': 'pdf',
  'application/x-pdf': 'pdf'
}

function isPdfFile(file: File): boolean {
  const mime = (file.type || '').toLowerCase()
  if (ALLOWED_PDF_TYPES[mime]) {
    return true
  }
  const name = file.name.toLowerCase()
  return name.endsWith('.pdf')
}

function extensionForPdf(file: File): string | null {
  const mime = (file.type || '').toLowerCase()
  if (ALLOWED_PDF_TYPES[mime]) {
    return ALLOWED_PDF_TYPES[mime]
  }
  if (file.name.toLowerCase().endsWith('.pdf')) {
    return 'pdf'
  }
  return null
}

function sanitizeOriginalFileName(name: string): string {
  const trimmed = name.trim() || 'document.pdf'
  const noPath = trimmed.replace(/[/\\]/g, '_')
  return noPath.slice(0, 200)
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
    .from('documents')
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

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File is required', status: false }, { status: 400 })
    }

    if (!isPdfFile(file)) {
      return NextResponse.json({ error: 'Invalid file type', status: false }, { status: 400 })
    }

    const ext = extensionForPdf(file)

    if (!ext) {
      return NextResponse.json({ error: 'Invalid file type', status: false }, { status: 400 })
    }

    const buffer = await file.arrayBuffer()

    if (buffer.byteLength > MAX_DOCUMENT_BYTES) {
      return NextResponse.json({ error: 'File too large', status: false }, { status: 400 })
    }

    const body = new Uint8Array(buffer)
    let original = sanitizeOriginalFileName(file.name)
    if (!original.toLowerCase().endsWith('.pdf')) {
      original = original.length > 0 ? `${original}.pdf` : 'document.pdf'
    }
    const fileName = `${Date.now()}-${crypto.randomUUID()}-${original}`
    const key = `${user.id}/documents/${projectId}/${fileName}`

    const supabase = await createClient()

    const allowed = await ensureUserOwnsProject(supabase, user.id, projectId)

    if (!allowed) {
      return NextResponse.json({ error: 'Project not found', status: false }, { status: 404 })
    }

    const uploadMime = (file.type || '').toLowerCase()
    const contentType =
      uploadMime && ALLOWED_PDF_TYPES[uploadMime] ? uploadMime : 'application/pdf'

    await s3UploadFile({
      key,
      body,
      contentType
    })

    const docUrl = `/${key}`

    const { error: saveError } = await supabase.from('documents').insert({
      owner_id: user.id,
      project_id: projectId,
      url: docUrl
    })

    if (saveError) {
      await s3DeleteObject(key).catch(() => {})
      return NextResponse.json({ error: saveError.message, status: false }, { status: 500 })
    }

    return NextResponse.json({ status: true, url: docUrl })
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
      .from('documents')
      .select('id, url')
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
    const key = s3KeyFromStoredUrl(url)

    if (key) {
      await s3DeleteObject(key).catch(() => {})
    }

    const { error: deleteError } = await supabase.from('documents').delete().eq('id', id).eq('owner_id', user.id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message, status: false }, { status: 500 })
    }

    return NextResponse.json({ status: true })
  } catch (err) {
    return NextResponse.json({ error: String(err), status: false }, { status: 500 })
  }
}
