import { FC } from 'react'

import { IProject } from '@/shared/interfaces'

import Main from '@/modules/project/components/main/main'

type IProjectProps = {
  readonly project: IProject
}

const Project: FC<IProjectProps> = ({ project }) => <Main project={project} />

export default Project
