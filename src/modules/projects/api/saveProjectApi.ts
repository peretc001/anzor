import type { SaveProjectPayload } from '@/shared/interfaces'

import serverApi from '@/lib/serverApi'

export type { SaveProjectPayload }

export const saveProjectApi = async (project: SaveProjectPayload) => {
  try {
    const response = await serverApi.post('projects/create', project)

    return response?.status
  } catch {
    return null
  }
}
