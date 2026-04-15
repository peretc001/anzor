import { Metadata } from 'next'

import Project from '@/modules/project'

export const metadata: Metadata = {
  title: 'Квартира ЖК Самолет'
}

const Page = () => (
  <div className="layout-container">
    <div className="page">
      <Project />
    </div>
  </div>
)

export default Page
