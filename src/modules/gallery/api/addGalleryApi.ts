import serverApi from '@/lib/serverApi'

export const addGalleryApi = async ({
  file,
  projectId,
  taskId
}: {
  file: File
  projectId: number
  taskId?: number
}) => {
  const formData = new FormData()

  formData.append('file', file)
  formData.append('project_id', String(projectId))
  if (taskId) {
    formData.append('task_id', String(taskId))
  }

  const response = await serverApi.file('projects/gallery', formData)

  if (!response?.status) {
    throw new Error(typeof response?.error === 'string' ? response.error : 'Upload failed')
  }

  return response.url as string | undefined
}
