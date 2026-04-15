import { Metadata } from 'next'

export const metadata: Metadata = {
  description: process.env.NEXT_PUBLIC_DESCRIPTION,
  title: 'Заказчики'
}

const Page = () => <div>Тут будет список Заказчиков</div>

export default Page
