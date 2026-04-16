import { Metadata } from 'next'

import Problems from '@/modules/problems'

export const metadata: Metadata = {
  title: 'Нарушения'
}

const Page = () => <Problems />

export default Page
