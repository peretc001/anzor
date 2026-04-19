import serverApi from '@/lib/serverApi'

export const getDocumentsApi = async (projectId: number) => {
  try {
    const response = await serverApi.get('projects/documents', { project_id: projectId })

    return response?.data
  } catch (err) {
    console.log('getDocumentsApi', err)

    return null
  }
}
