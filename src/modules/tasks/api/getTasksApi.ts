import { ITask } from '@/shared/interfaces'

import serverApi from '@/lib/serverApi'

export const getTasksApi = async () => {
  try {
    const response = await serverApi.get('projects/tasks')

    if (!response?.data) {
      return []
    }

    return (response.data as ITask[]) || []
  } catch {
    return []
  }
}
