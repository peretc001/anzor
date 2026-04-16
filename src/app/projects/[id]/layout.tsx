import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { getGalleryApi } from '@/modules/gallery/api/getGalleryApi'
import Project from '@/modules/project'
import { getProjectApi } from '@/modules/project/api/getProjectApi'
import { getTasksApi } from '@/modules/tasks/api/getTasksApi'

export const metadata: Metadata = {
  title: 'Журналы авторского надзора'
}

type Props = {
  readonly children: ReactNode
  readonly params: Promise<{ id: string }>
}

const Layout = async ({ children, params }: Props) => {
  const { id } = await params
  const projectId = Number(id)

  if (!Number.isInteger(projectId) || projectId <= 0) {
    notFound()
  }

  const project = await getProjectApi(projectId)

  if (!project) {
    notFound()
  }

  const [tasks, galleryData] = await Promise.all([
    getTasksApi(projectId),
    getGalleryApi(projectId)
  ])

  const tasksCount = tasks.length
  const photosCount = Array.isArray(galleryData) ? galleryData.length : 0

  return (
    <div>
      <Project galleryPhotosCount={photosCount} project={project} tasksCount={tasksCount} />
      {children}
    </div>
  )
}

export default Layout
