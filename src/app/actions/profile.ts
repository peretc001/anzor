'use server'

import { revalidatePath } from 'next/cache'

import { paths } from '@/constants'
import { createClient } from '@/lib/supabaseServer'

export type UpdateProfileState = { error?: string; ok?: boolean }

export async function updateProfile(
  _prev: UpdateProfileState | undefined,
  formData: FormData
): Promise<UpdateProfileState> {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser()

  if (userError || !user?.id) {
    return { error: 'auth' }
  }

  const name = String(formData.get('name') ?? '').trim()
  const type = String(formData.get('type') ?? '').trim()
  const avatarField = formData.get('avatar')

  if (!name) {
    return { error: 'name' }
  }

  const prevMeta =
    typeof user.user_metadata === 'object' && user.user_metadata !== null
      ? { ...user.user_metadata }
      : {}

  let avatarUrl =
    typeof prevMeta.avatar === 'string' && prevMeta.avatar.length > 0
      ? prevMeta.avatar
      : undefined

  if (avatarField instanceof File && avatarField.size > 0) {
    const extFromName = avatarField.name.split('.').pop()
    const ext =
      extFromName && /^[a-z0-9]+$/i.test(extFromName) ? extFromName.toLowerCase() : 'jpg'
    const path = `${user.id}/avatar.${ext}`

    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, avatarField, {
      contentType: avatarField.type || 'image/jpeg',
      upsert: true
    })

    if (uploadError) {
      return { error: 'upload' }
    }

    const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path)
    avatarUrl = pub.publicUrl
  }

  const nextData: Record<string, unknown> = {
    ...prevMeta,
    name,
    type
  }

  if (avatarUrl !== undefined) {
    nextData.avatar = avatarUrl
  }

  const { error: updateError } = await supabase.auth.updateUser({
    data: nextData
  })

  if (updateError) {
    return { error: 'update' }
  }

  revalidatePath(paths.settings)
  return { ok: true }
}
