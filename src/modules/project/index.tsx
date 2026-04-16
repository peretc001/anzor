import { FC } from 'react'

import { IProject } from '@/shared/interfaces'

import Main from '@/modules/project/components/main/main'

type IProjectProps = {
  readonly galleryPhotosCount?: number
  readonly project: IProject
  readonly tasksCount?: number
}

const Project: FC<IProjectProps> = ({
  galleryPhotosCount = 0,
  project,
  tasksCount = 0
}) => <Main galleryPhotosCount={galleryPhotosCount} project={project} tasksCount={tasksCount} />

export default Project
