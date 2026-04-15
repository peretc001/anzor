import { Metadata } from 'next'

import Problem from '@/modules/problem'

export const metadata: Metadata = {
  title: 'Кривая стена в зоне фартука кухни'
}

const Page = () => (
  <div className="layout-container">
    <div className="page">
      <Problem />
    </div>
  </div>
)

export default Page
