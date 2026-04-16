import { IProject } from '@/shared/interfaces'

import serverApi from '@/lib/serverApi'

export const getProjectApi = async (id: number) => {
  try {
    const response = await serverApi.get('projects/' + id)

    if (!response?.data) {
      return null
    }

    return (response.data as IProject) || null
  } catch {
    return null
  }
}
