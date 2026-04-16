import { ITask } from '@/shared/interfaces'

import serverApi from '@/lib/serverApi'

export const getTasksApi = async (projectId: number) => {
  try {
    const response = await serverApi.get('projects/tasks', { project_id: projectId })

    if (!response?.data) {
      return []
    }

    return (response.data as ITask[]) || []
  } catch {
    return []
  }
}
