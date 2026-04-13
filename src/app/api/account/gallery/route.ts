import { NextResponse } from 'next/server'

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

export async function GET() {
  const supabase = await createClient()

  const user = await getCurrentUser()

  if (!user?.id) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .eq('owner_id', user.id)
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
    const description = String(formData.get('description') ?? '')
    const type = String(formData.get('type') ?? 'visual')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File is required', status: false }, { status: 400 })
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
    const fileName = `${Date.now()}.${ext}`
    const key = `${user.id}/gallery/${fileName}`

    await s3UploadFile({
      key,
      body,
      contentType: mime
    })

    const galleryUrl = `/${key}`
    const supabase = await createClient()

    const { error: saveError } = await supabase.from('gallery').insert({
      description,
      owner_id: user.id,
      type,
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

    const { error: deleteError } = await supabase.from('gallery').delete().eq('id', id).eq('owner_id', user.id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message, status: false }, { status: 500 })
    }

    return NextResponse.json({ status: true })
  } catch (err) {
    return NextResponse.json({ error: String(err), status: false }, { status: 500 })
  }
}
