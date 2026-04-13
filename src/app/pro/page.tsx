import { Metadata } from 'next'

import Home from '@/modules/home'

export const metadata: Metadata = {
  title: 'Главная'
}

const Page = () => (
  <div className="layout-container">
    <div className="page">
      <Home />
    </div>
  </div>
)

export default Page
