import { Metadata } from 'next'

import JournalDone from '@/modules/journalDone'

export const metadata: Metadata = {
  title: 'Журнал авторского надзора'
}

const Page = () => (
  <div className="layout-container">
    <div className="page">
      <JournalDone />
    </div>
  </div>
)

export default Page
