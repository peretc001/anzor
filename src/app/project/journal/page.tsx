import { Metadata } from 'next'

import Journal from '@/modules/journal'

export const metadata: Metadata = {
  title: 'Журнал авторского надзора'
}

const Page = () => (
  <div className="layout-container">
    <div className="page">
      <Journal />
    </div>
  </div>
)

export default Page
