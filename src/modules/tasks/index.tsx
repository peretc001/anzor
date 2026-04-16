'use client'

import React from 'react'

import { useQuery } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'

import { getTasksApi } from '@/modules/tasks/api/getTasksApi'
import Main from '@/modules/tasks/components/main/main'

const Tasks = () => {
  const { isLoading, data } = useQuery({
    queryFn: getTasksApi,
    queryKey: ['tasks']
  })

  return isLoading ? <Loader isFull /> : <Main tasks={data || []} />
}

export default Tasks
