import serverApi from '@/lib/serverApi'

export const getCustomersApi = async () => {
  try {
    const response = await serverApi.get('customers/list')

    return response?.data || []
  } catch (err) {
    console.log('getCustomersApi', err)

    return []
  }
}
