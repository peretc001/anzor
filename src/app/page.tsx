import React, { Suspense } from 'react'
import { Metadata } from 'next'

import Home from '@/modules/home'

export const metadata: Metadata = {
  description: process.env.NEXT_PUBLIC_DESCRIPTION,
  title: process.env.NEXT_PUBLIC_NAME + ' | ' + process.env.NEXT_PUBLIC_DESCRIPTION
}

const Page = () => (
  <Suspense>
    <Home />
  </Suspense>
)

export default Page
