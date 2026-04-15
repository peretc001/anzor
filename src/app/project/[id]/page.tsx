import { Metadata } from 'next'

import Project from '@/modules/project'

export const metadata: Metadata = {
  title: 'Журналы авторского надзора'
}

type ProjectPageProps = {
  params: {
    id: string
  }
}

const Page = (_: ProjectPageProps) => <Project />

export default Page
