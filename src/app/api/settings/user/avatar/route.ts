import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import sharp from 'sharp'

import { paths } from '@/constants'

import { getCurrentUser } from '@/lib/getCurrentUser'
import { s3DeleteObject, s3KeyFromStoredUrl, s3UploadFile } from '@/lib/s3'
import { createClient } from '@/lib/supabaseServer'

const AVATAR_SIZE = 100

function mergeUserMetadata(
  user: NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>
): Record<string, unknown> {
  const meta = user.user_metadata
  if (typeof meta === 'object' && meta !== null && !Array.isArray(meta)) {
    return { ...meta }
  }
  return {}
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'File is required', status: false }, { status: 400 })
    }

    const userId = user.id
    const fileName = `${Date.now()}.jpg`
    const key = `${userId}/${fileName}`

    let body: Uint8Array

    try {
      const processed = await sharp(Buffer.from(await file.arrayBuffer()))
        .rotate()
        .resize(AVATAR_SIZE, AVATAR_SIZE, { fit: 'cover', position: 'centre' })
        .jpeg({ mozjpeg: true, quality: 85 })
        .toBuffer()

      body = new Uint8Array(processed)
    } catch {
      return NextResponse.json({ error: 'Invalid image', status: false }, { status: 400 })
    }

    const prevMeta = mergeUserMetadata(user)
    const prevAvatar = typeof prevMeta.avatar === 'string' ? prevMeta.avatar : ''
    if (prevAvatar) {
      const oldKey = s3KeyFromStoredUrl(prevAvatar)
      if (oldKey) {
        try {
          await s3DeleteObject(oldKey)
        } catch {
          // старый объект мог уже быть удалён — не блокируем загрузку нового
        }
      }
    }

    await s3UploadFile({
      key,
      body,
      contentType: 'image/jpeg'
    })

    const avatarUrl = `/${key}`
    const supabase = await createClient()

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        ...prevMeta,
        avatar: avatarUrl
      }
    })

    if (updateError) {
      try {
        await s3DeleteObject(key)
      } catch {
        // откат загрузки best-effort
      }
      return NextResponse.json({ error: updateError.message, status: false }, { status: 500 })
    }

    revalidatePath('/', 'layout')
    revalidatePath(paths.settings)

    return NextResponse.json({ status: true, url: avatarUrl })
  } catch (err) {
    return NextResponse.json({ error: String(err), status: false }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const prevMeta = mergeUserMetadata(user)
    const stored = typeof prevMeta.avatar === 'string' ? prevMeta.avatar : ''

    if (stored) {
      const objectKey = s3KeyFromStoredUrl(stored)
      if (objectKey) {
        try {
          await s3DeleteObject(objectKey)
        } catch {
          // продолжаем сброс метаданных даже если объект в S3 уже отсутствует
        }
      }
    }

    const { avatar: _a, ...rest } = prevMeta

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        ...rest,
        avatar: ''
      }
    })

    if (updateError) {
      return NextResponse.json({ error: updateError.message, status: false }, { status: 500 })
    }

    revalidatePath('/', 'layout')
    revalidatePath(paths.settings)

    return NextResponse.json({ status: true })
  } catch (err) {
    return NextResponse.json({ error: String(err), status: false }, { status: 500 })
  }
}
