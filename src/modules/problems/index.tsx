'use client'

import React from 'react'

import { useQuery } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'

import { getProblemsApi } from '@/modules/problems/api/getProblemsApi'
import Main from '@/modules/problems/components/main/main'

const Problems = () => {
  const { isLoading, data } = useQuery({
    queryFn: getProblemsApi,
    queryKey: ['problems']
  })

  return isLoading ? <Loader isFull /> : <Main problems={data || []} />
}

export default Problems
