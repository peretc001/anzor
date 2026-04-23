import serverApi from '@/lib/serverApi'

export const getContractorsApi = async () => {
  try {
    const response = await serverApi.get('contractors/list')

    return response?.data || []
  } catch (err) {
    console.log('getContractorsApi', err)

    return []
  }
}
