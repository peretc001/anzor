import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import Project from '@/modules/project'
import { getProjectApi } from '@/modules/project/api/getProjectApi'

export const metadata: Metadata = {
  title: 'Журналы авторского надзора'
}

type Props = {
  readonly params: Promise<{ id: string }>
}

const Page = async ({ params }: Props) => {
  const { id } = await params
  const projectId = Number(id)

  if (!Number.isInteger(projectId) || projectId <= 0) {
    notFound()
  }

  const project = await getProjectApi(projectId)

  if (!project) {
    notFound()
  }

  return <Project project={project} />
}

export default Page
