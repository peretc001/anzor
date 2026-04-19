import { Metadata } from 'next'

import Documents from '@/modules/docs'

export const metadata: Metadata = {
  title: 'Документы'
}

const Page = () => <Documents />

export default Page
