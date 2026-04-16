import { IProject } from '@/shared/interfaces'

import serverApi from '@/lib/serverApi'

interface IProjectData extends IProject {
  photos_count: number
  tasks_count: number
}

export const getProjectsApi = async () => {
  try {
    const response = await serverApi.get('projects/list')

    if (!response.data) {
      return []
    }

    return (response.data as IProjectData[]) || []
  } catch {
    return null
  }
}
