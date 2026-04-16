import { ITask } from '@/shared/interfaces'

import serverApi from '@/lib/serverApi'

export const saveTaskApi = async (task: ITask) => {
  try {
    const response = await serverApi.post('projects/tasks/', { task })

    if (!response?.data) {
      return null
    }

    return response.data as ITask
  } catch {
    return null
  }
}
