import { Metadata } from 'next'

export const metadata: Metadata = {
  description: process.env.NEXT_PUBLIC_DESCRIPTION,
  title: 'Исполнители'
}

const Page = () => <div>Тут будет список Исполнителей</div>

export default Page
