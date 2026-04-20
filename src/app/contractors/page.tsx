import { Metadata } from 'next'

import Contractors from '@/widgets/contractors/contractors'

export const metadata: Metadata = {
  description: process.env.NEXT_PUBLIC_DESCRIPTION,
  title: 'Исполнители'
}

const Page = () => <Contractors />

export default Page
