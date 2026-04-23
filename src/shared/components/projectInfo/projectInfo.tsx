'use client'

import React, { FC, MouseEvent } from 'react'
import { Button } from 'antd'
import { useTranslations } from 'next-intl'

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
  const t = useTranslations('projects.header')

  const handleAttachContractor = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    openAttachContractorModal(project.id)
  }

  const handleAttachCustomer = (e: MouseEvent<HTMLElement>) => {
    e.preventDefault()
    openAttachCustomerModal(project.id)
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
          ) : project.active ? (
            <Button
              color="primary"
              disabled={!project.active}
              variant="outlined"
              onClick={handleAttachCustomer}
            >
              {t('attachCustomer')}
            </Button>
          ) : null}
          {project.contractor?.name ? (
            <span className={styles.contractor}>{project.contractor.name}</span>
          ) : project.active ? (
            <Button
              color="primary"
              disabled={!project.active}
              variant="outlined"
              onClick={handleAttachContractor}
            >
              {t('attachContractor')}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default ProjectInfo
