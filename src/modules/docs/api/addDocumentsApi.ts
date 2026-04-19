import serverApi from '@/lib/serverApi'

export const addDocumentsApi = async ({ file, projectId }: { file: File; projectId: number }) => {
  const formData = new FormData()

  formData.append('file', file)
  formData.append('project_id', String(projectId))

  const response = await serverApi.file('projects/documents', formData)

  if (!response?.status) {
    throw new Error(typeof response?.error === 'string' ? response.error : 'Upload failed')
  }

  return response.url as string | undefined
}
