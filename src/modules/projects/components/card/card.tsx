import React from 'react'
import cns from 'classnames'
import Link from 'next/link'

import {
  BuildingOffice2Icon,
  ExclamationTriangleIcon,
  HomeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

import ProjectInfo from '@/shared/components/projectInfo/projectInfo'
import type { ProjectCardModel } from '@/shared/store/projects'

import { paths } from '@/constants'

import styles from './card.module.scss'

type CardProps = {
  readonly project: ProjectCardModel
}

const Card = ({ project }: CardProps) => (
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
