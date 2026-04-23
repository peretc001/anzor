import React from 'react'
import { Metadata } from 'next'

import Customers from '@/widgets/customers'

export const metadata: Metadata = {
  description: process.env.NEXT_PUBLIC_DESCRIPTION,
  title: 'Заказчики'
}

const Page = () => <Customers />

export default Page
