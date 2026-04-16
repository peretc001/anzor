import serverApi from '@/lib/serverApi'

export const getGalleryApi = async (projectId: number) => {
  try {
    const response = await serverApi.get('projects/gallery', { project_id: projectId })

    return response?.data
  } catch (err) {
    console.log('getGalleryApi', err)

    return null
  }
}
