'use client'

import React, { FC, useState } from 'react'
import { Button, message, Modal, Popconfirm } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { useQueryClient } from '@tanstack/react-query'

import { ChevronLeftIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'

import ProjectInfo from '@/shared/components/projectInfo/projectInfo'
import { IProject } from '@/shared/interfaces'

import { paths } from '@/constants'

import { deleteProjectApi } from '@/modules/projects/api/deleteProjectApi'
import EditProject from '@/modules/projects/components/form/form'

import styles from './projectHeader.module.scss'

interface IProjectHeader {
  readonly project: IProject
}

const ProjectHeader: FC<IProjectHeader> = ({ project }) => {
  const t = useTranslations('projects')
  const router = useRouter()
  const queryClient = useQueryClient()

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleOpenEditModal = () => setIsEditModalOpen(true)
  const handleCloseEditModal = () => setIsEditModalOpen(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const ok = await deleteProjectApi(project.id)
    setIsDeleting(false)

    if (!ok) {
      message.error(t('header.deleteFailed'))
      return
    }

    await queryClient.invalidateQueries({ queryKey: ['projects'] })
    router.push(paths.projects)
  }

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

        <Popconfirm
          cancelText={t('header.deleteConfirmCancel')}
          description={t('header.deleteConfirmDescription')}
          okButtonProps={{ danger: true, loading: isDeleting }}
          okText={t('header.delete')}
          title={t('header.deleteConfirmTitle')}
          onConfirm={handleDelete}
        >
          <Button icon={<TrashIcon className={styles.icon} />} loading={isDeleting}>
            {t('header.delete')}
          </Button>
        </Popconfirm>
      </div>

      <Modal
        destroyOnHidden
        footer={null}
        open={isEditModalOpen}
        title={t('header.edit')}
        onCancel={handleCloseEditModal}
      >
        <EditProject project={project} onCancel={handleCloseEditModal} />
      </Modal>
    </div>
  )
}

export default ProjectHeader
