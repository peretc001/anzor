'use client'

import React from 'react'

import { useQuery } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'

import { getProjectsApi } from '@/modules/projects/api/getProjectsApi'
import Main from '@/modules/projects/components/main/main'

const Projects = () => {
  const { isLoading, data } = useQuery({
    queryFn: getProjectsApi,
    queryKey: ['projects']
  })

  return isLoading ? <Loader isFull /> : <Main projects={data} />
}

export default Projects
