'use client'

import React from 'react'

import { useQuery } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'

import { getGalleryApi } from '@/modules/gallery/api/getGalleryApi'
import Main from '@/modules/gallery/components/main/main'

const Gallery = () => {
  const { isLoading, data } = useQuery({
    queryFn: getGalleryApi,
    queryKey: ['gallery']
  })

  return isLoading ? <Loader isFull /> : <Main gallery={data} />
}

export default Gallery
