import { IProblem } from '@/shared/interfaces'

import serverApi from '@/lib/serverApi'

export const saveProblemApi = async (problem: IProblem) => {
  try {
    const response = await serverApi.post('problems/', { problem })

    if (!response?.data) {
      return null
    }

    return response.data as IProblem
  } catch {
    return null
  }
}
