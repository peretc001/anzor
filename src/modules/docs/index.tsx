'use client'

import React from 'react'
import { useParams } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'

import { getDocumentsApi } from '@/modules/docs/api/getDocumentsApi'
import Main from '@/modules/docs/components/main/main'

const Documents = () => {
  const params = useParams()
  const idRaw = params?.id
  const projectId =
    typeof idRaw === 'string' ? Number(idRaw) : Array.isArray(idRaw) ? Number(idRaw[0]) : NaN

  const projectOk = Number.isInteger(projectId) && projectId > 0

  const { isLoading, data } = useQuery({
    enabled: projectOk,
    queryFn: () => getDocumentsApi(projectId),
    queryKey: ['documents', projectId]
  })

  if (!projectOk) {
    return null
  }

  return isLoading ? <Loader isFull /> : <Main documents={data ?? []} projectId={projectId} />
}

export default Documents
