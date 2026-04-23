'use client'

import React from 'react'

import { useQuery } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'

import styles from './main.module.scss'

import { getContractorsApi } from '@/widgets/contractors/api/getContractorsApi'
import List from '@/widgets/contractors/components/list/list'

const Main = () => {
  const { isLoading, data } = useQuery({
    queryFn: () => getContractorsApi(),
    queryKey: ['contractors']
  })

  return (
    <div className={styles.root}>{isLoading ? <Loader isFull /> : <List contractors={data} />}</div>
  )
}

export default Main
