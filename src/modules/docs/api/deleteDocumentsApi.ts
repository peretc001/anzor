import serverApi from '@/lib/serverApi'

export const deleteDocumentsApi = async (id: number) => {
  const response = await serverApi.delete('projects/documents', { id })

  if (!response?.status) {
    throw new Error(typeof response?.error === 'string' ? response.error : 'Delete failed')
  }

  return response.status as boolean
}
