import { Metadata } from 'next'

import Settings from '@/modules/settings'

export const metadata: Metadata = {
  description: process.env.NEXT_PUBLIC_DESCRIPTION,
  title: 'Профиль'
}

const Page = () => <Settings />

export default Page
