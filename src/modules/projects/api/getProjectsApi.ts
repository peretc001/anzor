import { IProfile, IProject } from '@/shared/interfaces'

import serverApi from '@/lib/serverApi'

export const getProjectsApi = async () => {
  try {
    const response = await serverApi.get('projects/list')

    if (!response.data) {
      return []
    }

    return (response.data as IProject[]) || []
  } catch {
    return null
  }
}
