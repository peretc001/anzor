import { ICustomer } from '@/shared/interfaces'

import serverApi from '@/lib/serverApi'

export const addCustomerApi = async (projectId: number, values: ICustomer): Promise<boolean> => {
  try {
    const response = await serverApi.post('customers/create', {
      projectId,
      values
    })

    return response?.status
  } catch (err) {
    console.log('addCustomerApi', err)

    throw new Error('error')
  }
}
