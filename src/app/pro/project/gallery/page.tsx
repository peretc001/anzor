import { Metadata } from 'next'

import Gallery from '@/modules/gallery'

export const metadata: Metadata = {
  title: 'Фотоотчет'
}

const Page = () => (
  <div className="layout-container">
    <div className="page">
      <Gallery />
    </div>
  </div>
)

export default Page
