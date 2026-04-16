import serverApi from '@/lib/serverApi'

export const deleteProjectApi = async (id: number) => {
  try {
    const response = await serverApi.delete(`projects/${id}`)

    return response?.ok === true
  } catch {
    return null
  }
}
