import React, { Suspense } from 'react'
import { Metadata } from 'next'

import Projects from '@/modules/projects'

export const metadata: Metadata = {
  description: process.env.NEXT_PUBLIC_DESCRIPTION,
  title: process.env.NEXT_PUBLIC_NAME + ' | ' + process.env.NEXT_PUBLIC_DESCRIPTION
}

const Page = async () => (
  <Suspense>
    <Projects />
  </Suspense>
)

export default Page
