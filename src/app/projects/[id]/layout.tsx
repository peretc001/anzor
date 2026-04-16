import React from 'react'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { getGalleryApi } from '@/modules/gallery/api/getGalleryApi'
import { getProjectApi } from '@/modules/project/api/getProjectApi'
import ProjectHeader from '@/modules/projectHeader/projectHeader'
import ProjectMenu from '@/modules/projectMenu/projectMenu'
import { getTasksApi } from '@/modules/tasks/api/getTasksApi'

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

  const [tasks, galleryData] = await Promise.all([getTasksApi(projectId), getGalleryApi(projectId)])

  return (
    <>
      <ProjectHeader project={project} />

      <ProjectMenu
        galleryPhotosCount={galleryData.length || 0}
        projectId={project.id}
        tasksCount={tasks.length || 0}
      />

      {children}
    </>
  )
}

export default Layout
