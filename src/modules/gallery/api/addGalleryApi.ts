import serverApi from '@/lib/serverApi'

export const addGalleryApi = async ({
  description,
  file,
  type
}: {
  description: string
  file: File
  type: string
}) => {
  const formData = new FormData()

  formData.append('file', file)
  formData.append('description', description ?? '')
  formData.append('type', type ?? 'visual')

  const response = await serverApi.file('projects/gallery', formData)

  if (!response?.status) {
    throw new Error(typeof response?.error === 'string' ? response.error : 'Upload failed')
  }

  return response.url as string | undefined
}
