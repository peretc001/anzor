'use client'

import React, { FC } from 'react'
import { Button } from 'antd'

import {
  BuildingOffice2Icon,
  BuildingStorefrontIcon,
  ExclamationTriangleIcon,
  HomeIcon
} from '@heroicons/react/24/outline'

import { IProject } from '@/shared/interfaces'

import { openAttachContractorModal } from '@/lib/openAttachContractorModal'
import { openAttachCustomerModal } from '@/lib/openAttachCustomerModal'

import styles from './projectInfo.module.scss'

interface IProjectInfo {
  readonly project: IProject
  readonly tasks?: number
}

const ProjectInfo: FC<IProjectInfo> = ({ project, tasks }) => {
  const handleAttachContractor = () => {
    openAttachContractorModal()
  }
  const handleAttachCustomer = () => {
    openAttachCustomerModal()
  }

  return (
    <div className={styles.root}>
      <div className={styles.type}>
        {project.type === 'flat' ? (
          <BuildingOffice2Icon className={styles.icon} />
        ) : project.type === 'house' ? (
          <HomeIcon className={styles.icon} />
        ) : (
          <BuildingStorefrontIcon className={styles.icon} />
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
          {project.customer?.name ? (
            <span className={styles.customer}>{project.customer.name}</span>
          ) : (
            <Button onClick={handleAttachContractor}>Привязать Исполнителя</Button>
          )}
          {project.contractor?.name ? (
            <span className={styles.contractor}>{project.contractor.name}</span>
          ) : (
            <Button onClick={handleAttachCustomer}>Привязать Заказчика</Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectInfo
