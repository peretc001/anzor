import { Metadata } from 'next'

import Tasks from '@/modules/tasks'

export const metadata: Metadata = {
  title: 'Задачи'
}

const Page = () => <Tasks />

export default Page
