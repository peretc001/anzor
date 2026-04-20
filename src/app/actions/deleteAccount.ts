'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { getCurrentUser } from '@/lib/getCurrentUser'
import { mapSessionUserForMenu } from '@/lib/mapSessionUserForMenu'
import { s3DeleteObject, s3KeyFromStoredUrl } from '@/lib/s3'
import { supabaseClient } from '@/lib/supabaseClient'

export type DeleteAccountResult = { error: string; ok: false }

/**
 * Удаляет текущего пользователя из Supabase Auth и связанные строки в public
 * (каскадом через projects.owner_id → auth.users).
 * Предварительно чистит S3 и файлы в бакете avatars.
 */
export async function deleteAccount(): Promise<DeleteAccountResult> {
  const user = await getCurrentUser()

  if (!user?.id) {
    return { error: 'Unauthorized', ok: false }
  }

  const userId = user.id
  const admin = supabaseClient()

  const { data: projects, error: projectsError } = await admin.from('projects').select('id').eq('owner_id', userId)

  if (projectsError) {
    return { error: projectsError.message, ok: false }
  }

  const projectIds = (projects ?? []).map(row => row.id as number)
  const urls = new Set<string>()

  const { avatar } = mapSessionUserForMenu(user)

  if (avatar.trim() !== '') {
    urls.add(avatar)
  }

  if (projectIds.length > 0) {
    const [tasksRes, galleryRes, documentsRes] = await Promise.all([
      admin.from('tasks').select('photos').eq('owner_id', userId).in('project_id', projectIds),
      admin.from('gallery').select('url').eq('owner_id', userId).in('project_id', projectIds),
      admin.from('documents').select('url').eq('owner_id', userId).in('project_id', projectIds)
    ])

    const fetchError = tasksRes.error ?? galleryRes.error ?? documentsRes.error

    if (fetchError) {
      return { error: fetchError.message, ok: false }
    }

    for (const row of tasksRes.data ?? []) {
      if (Array.isArray(row.photos)) {
        for (const u of row.photos) {
          if (typeof u === 'string' && u.trim() !== '') {
            urls.add(u)
          }
        }
      }
    }

    for (const row of galleryRes.data ?? []) {
      if (typeof row.url === 'string' && row.url.trim() !== '') {
        urls.add(row.url)
      }
    }

    for (const row of documentsRes.data ?? []) {
      if (typeof row.url === 'string' && row.url.trim() !== '') {
        urls.add(row.url)
      }
    }
  }

  for (const url of urls) {
    const key = s3KeyFromStoredUrl(url)

    if (key) {
      await s3DeleteObject(key).catch(() => {})
    }
  }

  const { data: avatarObjects, error: listAvatarError } = await admin.storage.from('avatars').list(userId)

  if (!listAvatarError && avatarObjects?.length) {
    const paths = avatarObjects.map(o => `${userId}/${o.name}`)
    await admin.storage.from('avatars').remove(paths).catch(() => {})
  }

  const { error: deleteUserError } = await admin.auth.admin.deleteUser(userId)

  if (deleteUserError) {
    return { error: deleteUserError.message, ok: false }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
