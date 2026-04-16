import { cookies } from 'next/headers'

import type { ProjectCardModel } from '@/shared/store/projects'

import serverApi from '@/lib/serverApi'

/** GET `/api/projects` — список проектов текущего пользователя (Supabase). */
export async function getProjectsApi(): Promise<ProjectCardModel[]> {
  try {
    const cookieStore = await cookies()
    const cookieHeader = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
      .join('; ')

    const response = await serverApi.get(
      'projects',
      {},
      undefined,
      undefined,
      cookieHeader ? { Cookie: cookieHeader } : undefined
    )

    if (!response?.data) {
      return []
    }

    return response.data as ProjectCardModel[]
  } catch {
    return []
  }
}
