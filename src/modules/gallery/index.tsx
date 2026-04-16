'use client'

import React from 'react'

import { useParams } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'

import { getGalleryApi } from '@/modules/gallery/api/getGalleryApi'
import Main from '@/modules/gallery/components/main/main'

const Gallery = () => {
  const params = useParams()
  const idRaw = params?.id
  const projectId =
    typeof idRaw === 'string' ? Number(idRaw) : Array.isArray(idRaw) ? Number(idRaw[0]) : NaN

  const projectOk = Number.isInteger(projectId) && projectId > 0

  const { isLoading, data } = useQuery({
    enabled: projectOk,
    queryFn: () => getGalleryApi(projectId),
    queryKey: ['gallery', projectId]
  })

  if (!projectOk) {
    return null
  }

  return isLoading ? <Loader isFull /> : <Main gallery={data ?? []} projectId={projectId} />
}

export default Gallery
