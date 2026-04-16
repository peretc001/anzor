import { Metadata } from 'next'

import Gallery from '@/modules/gallery'

export const metadata: Metadata = {
  title: 'Фотоотчет'
}

const Page = () => <Gallery />

export default Page
