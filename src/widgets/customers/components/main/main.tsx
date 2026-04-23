'use client'

import React from 'react'

import { useQuery } from '@tanstack/react-query'

import Loader from '@/shared/components/loader/loader'

import styles from './main.module.scss'

import { getCustomersApi } from '@/widgets/customers/api/getCustomersApi'
import List from '@/widgets/customers/components/list/list'

const Main = () => {
  const { isLoading, data } = useQuery({
    queryFn: () => getCustomersApi(),
    queryKey: ['customers']
  })

  return (
    <div className={styles.root}>{isLoading ? <Loader isFull /> : <List customers={data} />}</div>
  )
}

export default Main
