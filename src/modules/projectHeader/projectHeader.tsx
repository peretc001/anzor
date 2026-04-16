'use client'

import React, { FC, useState } from 'react'
import { Button, Modal } from 'antd'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { ChevronLeftIcon, PencilSquareIcon } from '@heroicons/react/24/outline'

import ProjectInfo from '@/shared/components/projectInfo/projectInfo'
import { IProject } from '@/shared/interfaces'

import { paths } from '@/constants'

import FormModal from '@/modules/project/components/form/form'

import styles from './projectHeader.module.scss'

interface IProjectHeader {
  readonly project: IProject
}

const ProjectHeader: FC<IProjectHeader> = ({ project }) => {
  const t = useTranslations('projects')

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleOpenEditModal = () => setIsEditModalOpen(true)
  const handleCloseEditModal = () => setIsEditModalOpen(false)

  return (
    <div className={styles.root}>
      <Link className={styles.back} href={paths.projects}>
        <ChevronLeftIcon className={styles.icon} />
        {t('header.all')}
      </Link>

      <div className={styles.container}>
        <ProjectInfo project={project} />

        <Button icon={<PencilSquareIcon className={styles.icon} />} onClick={handleOpenEditModal}>
          {t('header.edit')}
        </Button>
      </div>

      <Modal
        destroyOnHidden
        footer={null}
        open={isEditModalOpen}
        title={t('header.edit')}
        onCancel={handleCloseEditModal}
      >
        <FormModal project={project} onCancel={handleCloseEditModal} />
      </Modal>
    </div>
  )
}

export default ProjectHeader
