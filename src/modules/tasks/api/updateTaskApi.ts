import type { ITask } from '@/shared/interfaces'

import serverApi from '@/lib/serverApi'

export const updateTaskApi = async (
  id: number,
  payload: Partial<Pick<ITask, 'photos' | 'status' | 'type'>>
) => {
  try {
    const response = await serverApi.patch(`projects/tasks/${id}`, payload)

    if (!response?.data) {
      return null
    }

    return response.data as ITask
  } catch {
    return null
  }
}
