import { Metadata } from 'next'

import Gallery from '@/modules/gallery'

export const metadata: Metadata = {
  title: 'Фотогалерея'
}

const Page = () => <Gallery />

export default Page
