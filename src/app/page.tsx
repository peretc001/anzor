import React, { Suspense } from 'react'
import { Metadata } from 'next'

import Welcome from '../modules/welcome'

export const metadata: Metadata = {
  description: process.env.NEXT_PUBLIC_DESCRIPTION,
  title: process.env.NEXT_PUBLIC_NAME + ' | ' + process.env.NEXT_PUBLIC_DESCRIPTION
}

const Page = () => (
  <Suspense>
    <Welcome />
  </Suspense>
)

export default Page
