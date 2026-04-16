'use client'

import React, { FC, useState } from 'react'
import { Button, message } from 'antd'
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
import type { ProjectJournal } from '@/shared/store/projects'

import { paths } from '@/constants'

import styles from './main.module.scss'

import { saveProjectApi } from '../../api/saveProjectApi'
import FormModal, { ProjectFormValues } from '../form/form'

dayjs.locale('ru')

const ADD_BUTTON_LABEL = '+ Создать журнал'
const BACK_LABEL = 'Все объекты'
const EMPTY_LABEL = 'Объект не найден'
const META_OPENED_LABEL = 'открытых'
const META_RESOLVED_LABEL = 'устранено'
const OPEN_SHORT_LABEL = 'откр.'
const EDIT_BUTTON_LABEL = 'Редактировать'
const TAB_JOURNALS = 'Журналы'
const TAB_PROBLEMS = 'Нарушения'
const TAB_DOCS = 'Документы'
const TAB_PHOTO = 'Фотоотчёт'
const TAB_PARTICIPANTS = 'Участники'

const statusMap = {
  awaiting: 'Ожидает подписи',
  done: 'Подписан',
  draft: 'Черновик'
} as const

function pluralizeJournals(count: number): string {
  const n = Math.abs(count) % 100
  const n1 = n % 10
  if (n > 10 && n < 20) return `${count} журналов`
  if (n1 === 1) return `${count} журнал`
  if (n1 >= 2 && n1 <= 4) return `${count} журнала`
  return `${count} журналов`
}

type IMainProps = {
  readonly project: IProject
}

const Main: FC<IMainProps> = ({ project }) => {
  const pathname = usePathname()
  const [projectData, setProjectData] = useState<IProject>(project)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const journals: ProjectJournal[] = []
  const icon = projectData.type
  const photoReportsCount = 0

  const openedCount = journals.reduce((acc, journal) => acc + journal.openIssues, 0)
  const resolvedCount = journals.reduce((acc, journal) => acc + journal.resolvedIssues, 0)

  const handleOpenEditModal = () => setIsEditModalOpen(true)
  const handleCloseEditModal = () => setIsEditModalOpen(false)

  const handleSubmitProject = async (values: ProjectFormValues) => {
    setIsSaving(true)

    const savedProject = await saveProjectApi({ ...projectData, ...values })

    setIsSaving(false)

    if (!savedProject) {
      message.error('Не удалось сохранить изменения')
      return
    }

    setProjectData(savedProject)
    setIsEditModalOpen(false)
    message.success('Изменения сохранены')
  }

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
              <span>{pluralizeJournals(journals.length)}</span>
              <span className={styles.metaDanger}>{`${openedCount} ${META_OPENED_LABEL}`}</span>
              <span
                className={styles.metaSuccess}
              >{`${resolvedCount} ${META_RESOLVED_LABEL}`}</span>
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

      <FormModal
        open={isEditModalOpen}
        project={projectData}
        submitting={isSaving}
        onCancel={handleCloseEditModal}
        onSubmit={handleSubmitProject}
      />

      <div className={styles.tabs}>
        <Link
          className={cns(
            styles.tab,
            pathname === paths.projects + '/' + project.id + '/journals' && styles.tabActive
          )}
          href={paths.projects + '/' + project.id + '/journals'}
        >
          {TAB_JOURNALS}
          <span className={styles.tabBadge}>{journals.length}</span>
        </Link>
        <Link
          className={cns(
            styles.tab,
            pathname === paths.projects + '/' + project.id + '/tasks' && styles.tabActive
          )}
          href={paths.projects + '/' + project.id + '/tasks'}
        >
          {TAB_PROBLEMS}
          <span className={styles.tabBadge}>{journals.length}</span>
        </Link>
        <Link
          className={cns(
            styles.tab,
            pathname === paths.projects + '/' + project.id + '/gallery' && styles.tabActive
          )}
          href={paths.projects + '/' + project.id + '/gallery'}
        >
          {TAB_PHOTO}
          <span className={styles.tabBadge}>{photoReportsCount}</span>
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
