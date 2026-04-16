import { IProblem } from '@/shared/interfaces'

import serverApi from '@/lib/serverApi'

export const getProblemsApi = async () => {
  try {
    const response = await serverApi.get('problems')

    if (!response?.data) {
      return []
    }

    return (response.data as IProblem[]) || []
  } catch {
    return []
  }
}
