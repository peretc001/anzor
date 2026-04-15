import { Metadata } from 'next'
import { Suspense } from 'react'

import Gallery from '@/modules/gallery'

export const metadata: Metadata = {
  title: 'Фотоотчет'
}

const Page = () => (
  <div className="layout-container">
    <div className="page">
      <Suspense fallback={null}>
        <Gallery />
      </Suspense>
    </div>
  </div>
)

export default Page
