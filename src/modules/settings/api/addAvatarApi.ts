import serverApi from '@/lib/serverApi'

export const addAvatarApi = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await serverApi.file('settings/user/avatar', formData)

    if (!response?.status) {
      throw new Error(response.error ?? 'Upload failed')
    }

    return response.url
  } catch (err) {
    console.log('addAvatarApi', err)
  }
}
