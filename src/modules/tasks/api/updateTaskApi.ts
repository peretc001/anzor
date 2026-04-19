import type { ITask } from '@/shared/interfaces'

import serverApi from '@/lib/serverApi'

export type UpdateTaskPayload = Partial<
  Pick<ITask, 'control' | 'description' | 'executor' | 'photos' | 'priority' | 'status' | 'title' | 'type'>
>

export const updateTaskApi = async (id: number, payload: UpdateTaskPayload) => {
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
