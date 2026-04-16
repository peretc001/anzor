import { IProject } from '@/shared/interfaces'

import serverApi from '@/lib/serverApi'

export const saveProjectApi = async (project: IProject) => {
  try {
    const response = await serverApi.post('projects/' + project.id, { project })

    if (!response?.data) {
      return null
    }

    return (response.data as IProject) || null
  } catch {
    return null
  }
}
