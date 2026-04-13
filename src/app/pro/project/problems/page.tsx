import { Metadata } from 'next'

import Problems from '@/modules/problems'

export const metadata: Metadata = {
  title: 'Нарушения'
}

const Page = () => (
  <div className="layout-container">
    <div className="page">
      <Problems />
    </div>
  </div>
)

export default Page
