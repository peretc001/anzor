import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import sharp from 'sharp'

import { getCurrentUser } from '@/lib/getCurrentUser'
import { s3DeleteObject, s3KeyFromStoredUrl, s3UploadFile } from '@/lib/s3'
import { createClient } from '@/lib/supabaseServer'

const AVATAR_SIZE = 100

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized', status: false }, { status: 401 })
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

    await s3UploadFile({
      key,
      body,
      contentType: 'image/jpeg'
    })

    const avatarUrl = `/${key}`
    const supabase = await createClient()

    const row = {
      avatar: avatarUrl,
      owner_id: userId
    }

    const { error: saveError } = await supabase
      .from('profiles')
      .upsert(row, { onConflict: 'owner_id' })

    if (saveError) {
      return NextResponse.json({ error: saveError.message, status: false }, { status: 500 })
    }

    await supabase.auth.updateUser({
      data: { avatar: avatarUrl }
    })

    revalidatePath('/', 'layout')

    return NextResponse.json({ status: true, url: avatarUrl })
  } catch (err) {
    return NextResponse.json({ error: String(err), status: false }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized', status: false }, { status: 401 })
    }

    const userId = user.id

    const supabase = await createClient()

    const { data, error: profileError } = await supabase
      .from('profiles')
      .select('avatar')
      .eq('owner_id', userId)
      .maybeSingle()

    if (profileError) {
      return NextResponse.json({ error: profileError.message, status: false }, { status: 500 })
    }

    if (data?.avatar) {
      const key = s3KeyFromStoredUrl(data.avatar)

      if (key) {
        await s3DeleteObject(key)
      }
    }

    const row = {
      avatar: null,
      owner_id: userId
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .upsert(row, { onConflict: 'owner_id' })

    if (updateError) {
      return NextResponse.json({ error: updateError.message, status: false }, { status: 500 })
    }

    await supabase.auth.updateUser({
      data: { avatar: '' }
    })

    revalidatePath('/', 'layout')

    return NextResponse.json({ status: true })
  } catch (err) {
    return NextResponse.json({ error: String(err), status: false }, { status: 500 })
  }
}
