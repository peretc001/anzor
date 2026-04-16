'use client'

import React, { FC, useState } from 'react'
import { Button, message, Modal } from 'antd'
import cns from 'classnames'
import dayjs from 'dayjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  BuildingOffice2Icon,
  ChevronLeftIcon,
  HomeIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline'

import { IProject } from '@/shared/interfaces'

import { paths } from '@/constants'

import styles from './main.module.scss'

import { saveProjectApi } from '../../api/saveProjectApi'
import FormModal, { ProjectFormValues } from '../form/form'

dayjs.locale('ru')

const BACK_LABEL = 'Все объекты'
const EDIT_BUTTON_LABEL = 'Редактировать'
const TAB_TASKS = 'Задачи'
const TAB_DOCS = 'Документы'
const TAB_GALLERY = 'Фотогалерея'

type IMainProps = {
  readonly galleryPhotosCount?: number
  readonly project: IProject
  readonly tasksCount?: number
}

const Main: FC<IMainProps> = ({ galleryPhotosCount = 0, project, tasksCount = 0 }) => {
  const pathname = usePathname()
  const [projectData, setProjectData] = useState<IProject>(project)
  const [isSaving, setIsSaving] = useState(false)
  const icon = projectData.type

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const handleOpenEditModal = () => setIsEditModalOpen(true)
  const handleCloseEditModal = () => setIsEditModalOpen(false)

  return (
    <div className={styles.root}>
      <Link className={styles.back} href="/">
        <ChevronLeftIcon className={styles.backIcon} />
        {BACK_LABEL}
      </Link>

      <div className={styles.headerCard}>
        <div className={styles.mainInfo}>
          <div className={styles.preview}>
            {icon === 'building' ? (
              <BuildingOffice2Icon className={styles.previewIcon} />
            ) : (
              <HomeIcon className={styles.previewIcon} />
            )}
          </div>
          <div className={styles.titleWrap}>
            <h1 className={styles.title}>{projectData.name}</h1>
            <p className={styles.address}>{projectData.address}</p>
            <div className={styles.parties}>
              {projectData.customer ? (
                <span className={styles.customer}>{projectData.customer}</span>
              ) : null}
              {projectData.contractor ? (
                <span className={styles.contractor}>{projectData.contractor}</span>
              ) : null}
            </div>
            <div className={styles.meta}>
              {/*<span>{pluralizeJournals(journals.length)}</span>*/}
              {/*<span className={styles.metaDanger}>{`${openedCount} ${META_OPENED_LABEL}`}</span>*/}
              {/*<span*/}
              {/*  className={styles.metaSuccess}*/}
              {/*>{`${resolvedCount} ${META_RESOLVED_LABEL}`}</span>*/}
            </div>
          </div>
        </div>
        <Button
          className={styles.editButton}
          icon={<PencilSquareIcon className={styles.editIcon} />}
          loading={isSaving}
          onClick={handleOpenEditModal}
        >
          {EDIT_BUTTON_LABEL}
        </Button>
      </div>

      <Modal
        destroyOnHidden
        footer={null}
        open={isEditModalOpen}
        title="header.edit"
        onCancel={handleCloseEditModal}
      >
        <FormModal project={project} onCancel={handleCloseEditModal} />
      </Modal>

      <div className={styles.tabs}>
        {/*<Link*/}
        {/*  className={cns(*/}
        {/*    styles.tab,*/}
        {/*    pathname === paths.projects + '/' + project.id + '/journals' && styles.tabActive*/}
        {/*  )}*/}
        {/*  href={paths.projects + '/' + project.id + '/journals'}*/}
        {/*>*/}
        {/*  {TAB_JOURNALS}*/}
        {/*  <span className={styles.tabBadge}>{journals.length}</span>*/}
        {/*</Link>*/}
        <Link
          className={cns(
            styles.tab,
            pathname === paths.projects + '/' + project.id + '/tasks' && styles.tabActive
          )}
          href={paths.projects + '/' + project.id + '/tasks'}
        >
          {TAB_TASKS}
          <span className={styles.tabBadge}>{tasksCount}</span>
        </Link>
        <Link
          className={cns(
            styles.tab,
            pathname === paths.projects + '/' + project.id + '/gallery' && styles.tabActive
          )}
          href={paths.projects + '/' + project.id + '/gallery'}
        >
          {TAB_GALLERY}
          <span className={styles.tabBadge}>{galleryPhotosCount}</span>
        </Link>
        <Link
          className={cns(
            styles.tab,
            pathname === paths.projects + '/' + project.id + '/docs' && styles.tabActive
          )}
          href={paths.projects + '/' + project.id + '/docs'}
        >
          {TAB_DOCS}
        </Link>
      </div>
    </div>
  )
}

export default Main
