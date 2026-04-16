import React, { FC } from 'react'

import { BuildingOffice2Icon, HomeIcon } from '@heroicons/react/24/outline'

import { IProject } from '@/shared/interfaces'

import styles from './projectInfo.module.scss'

interface IProjectInfo {
  readonly project: IProject
}

const ProjectInfo: FC<IProjectInfo> = ({ project }) => (
  <div className={styles.root}>
    <div className={styles.type}>
      {project.type === 'building' ? (
        <BuildingOffice2Icon className={styles.icon} />
      ) : (
        <HomeIcon className={styles.icon} />
      )}
    </div>

    <div className={styles.info}>
      <h1 className={styles.title}>{project.name}</h1>
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
