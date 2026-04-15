import { Metadata } from 'next'

export const metadata: Metadata = {
  description: process.env.NEXT_PUBLIC_DESCRIPTION,
  title: 'Чат'
}

const Page = () => <div>Тут будет чат по всем объектам</div>

export default Page
