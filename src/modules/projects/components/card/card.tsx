import React, { FC } from 'react'
import cns from 'classnames'
import Link from 'next/link'

import ProjectInfo from '@/shared/components/projectInfo/projectInfo'
import { IProject } from '@/shared/interfaces'

import { paths } from '@/constants'

import styles from './card.module.scss'

interface IProjectData extends IProject {
  photos_count: number
  tasks_count: number
}

interface ICardProps {
  readonly project: IProjectData
}

const Card: FC<ICardProps> = ({ project }) => (
  <div className={styles.root}>
    <Link
      className={cns(styles.card, !project.active && styles.archive)}
      href={paths.projects + '/' + project.id}
    >
      <ProjectInfo project={project} tasks={project.tasks_count} />
    </Link>
  </div>
)

export default Card
