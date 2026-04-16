import { IProject } from '@/shared/interfaces'

import serverApi from '@/lib/serverApi'

/** С `id` — обновление, без — создание (один POST на `projects/list`). */
export type SaveProjectPayload = Omit<IProject, 'id'> & { id?: number }

export const saveProjectApi = async (project: SaveProjectPayload) => {
  try {
    const response = await serverApi.post('projects/list', { project })

    if (!response?.data) {
      return null
    }

    return (response.data as IProject) || null
  } catch {
    return null
  }
}
