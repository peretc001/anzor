import type { IProject, SaveProjectPayload } from '@/shared/interfaces'

import serverApi from '@/lib/serverApi'

export type { SaveProjectPayload }

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
