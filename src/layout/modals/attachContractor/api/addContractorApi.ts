import { IContractor } from '@/shared/interfaces'

import serverApi from '@/lib/serverApi'

export const addContractorApi = async (
  projectId: number,
  values: IContractor
): Promise<boolean> => {
  try {
    const response = await serverApi.post('contractor/create', {
      projectId,
      values
    })

    return response?.status
  } catch (err) {
    console.log('addContractorApi', err)

    return false
  }
}
