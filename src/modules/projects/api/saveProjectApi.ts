import { IProject } from '@/shared/interfaces'

import serverApi from '@/lib/serverApi'

type CreateProjectPayload = Omit<IProject, 'id'>

export const saveProjectApi = async (project: CreateProjectPayload) => {
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
