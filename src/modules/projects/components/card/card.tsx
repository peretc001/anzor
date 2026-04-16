import React, { FC } from 'react'
import cns from 'classnames'
import Link from 'next/link'

import ProjectInfo from '@/shared/components/projectInfo/projectInfo'
import { IProject } from '@/shared/interfaces'

import { paths } from '@/constants'

import styles from './card.module.scss'

interface ICardProps {
  readonly project: IProject
}

const Card: FC<ICardProps> = ({ project }) => (
  <div className={styles.root}>
    <Link
      className={cns(styles.card, !project.active && styles.archive)}
      href={paths.projects + '/' + project.id}
    >
      <ProjectInfo project={project} />
    </Link>
  </div>
)

export default Card
