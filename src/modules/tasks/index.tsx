'use client'

import React from 'react'

import { useParams } from 'next/navigation'

import { useQuery } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'

import { getTasksApi } from '@/modules/tasks/api/getTasksApi'
import Main from '@/modules/tasks/components/main/main'

const Tasks = () => {
  const params = useParams()
  const idRaw = params?.id
  const projectId =
    typeof idRaw === 'string' ? Number(idRaw) : Array.isArray(idRaw) ? Number(idRaw[0]) : NaN

  const projectOk = Number.isInteger(projectId) && projectId > 0

  const { isLoading, data } = useQuery({
    enabled: projectOk,
    queryFn: () => getTasksApi(projectId),
    queryKey: ['tasks', projectId]
  })

  if (!projectOk) {
    return null
  }

  return isLoading ? <Loader isFull /> : <Main projectId={projectId} tasks={data || []} />
}

export default Tasks
