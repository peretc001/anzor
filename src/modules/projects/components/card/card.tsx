import React from 'react'
import cns from 'classnames'
import Link from 'next/link'

import {
  BuildingOffice2Icon,
  ExclamationTriangleIcon,
  HomeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

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
      <div className={styles.left}>
        <div className={styles.iconWrap}>
          {project.icon === 'building' ? (
            <BuildingOffice2Icon className={styles.icon} />
          ) : (
            <HomeIcon className={styles.icon} />
          )}
        </div>
      </div>

      <div className={styles.center}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{project.name}</h3>
          {project.warningsCount > 0 ? (
            <span className={styles.warning}>
              <ExclamationTriangleIcon className={styles.warningIcon} />
              {project.warningsCount}
            </span>
          ) : null}
        </div>

        <div className={styles.address}>
          <MapPinIcon className={styles.pinIcon} />
          <span>{project.address ?? ''}</span>
        </div>

        <div className={styles.tags}>
          {project.customer ? (
            <span className={`${styles.tag} ${styles.tagCustomer}`}>{project.customer}</span>
          ) : null}
          {project.contractor ? <span className={styles.tag}>{project.contractor}</span> : null}
        </div>
      </div>
    </Link>
  </div>
)

export default Card
