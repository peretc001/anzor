import React, { FC } from 'react'

import { BuildingOffice2Icon, ExclamationTriangleIcon, HomeIcon } from '@heroicons/react/24/outline'

import { IProject } from '@/shared/interfaces'

import styles from './projectInfo.module.scss'

interface IProjectInfo {
  readonly photos?: number
  readonly project: IProject
  readonly tasks?: number
}

const ProjectInfo: FC<IProjectInfo> = ({ photos, project, tasks }) => (
  <div className={styles.root}>
    <div className={styles.type}>
      {project.type === 'flat' ? (
        <BuildingOffice2Icon className={styles.icon} />
      ) : (
        <HomeIcon className={styles.icon} />
      )}
    </div>

    <div className={styles.info}>
      <div className={styles.header}>
        <h3 className={styles.title}>{project.name}</h3>
        {tasks != null && tasks > 0 ? (
          <span className={styles.tasksBadge}>
            <ExclamationTriangleIcon className={styles.tasksBadgeIcon} aria-hidden />
            <span className={styles.tasksBadgeCount}>{tasks}</span>
          </span>
        ) : null}
      </div>
      <p className={styles.address}>{project.address}</p>

      <div className={styles.parties}>
        {project.customer ? <span className={styles.customer}>{project.customer}</span> : null}
        {project.contractor ? (
          <span className={styles.contractor}>{project.contractor}</span>
        ) : null}
      </div>
    </div>
  </div>
)

export default ProjectInfo
