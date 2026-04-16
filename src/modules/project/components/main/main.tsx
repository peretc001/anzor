'use client'

import React, { FC, useState } from 'react'
import { Button, message } from 'antd'
import cns from 'classnames'
import dayjs from 'dayjs'
import Link from 'next/link'

import {
  BuildingOffice2Icon,
  ChevronLeftIcon,
  HomeIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline'

import { IProject } from '@/shared/interfaces'
import type { ProjectJournal } from '@/shared/store/projects'

import { saveProjectApi } from '../../api/saveProjectApi'
import FormModal, { ProjectFormValues } from '../form/form'
import styles from './main.module.scss'

dayjs.locale('ru')

const ADD_BUTTON_LABEL = '+ Создать журнал'
const BACK_LABEL = 'Все объекты'
const EMPTY_LABEL = 'Объект не найден'
const META_OPENED_LABEL = 'открытых'
const META_RESOLVED_LABEL = 'устранено'
const OPEN_SHORT_LABEL = 'откр.'
const EDIT_BUTTON_LABEL = 'Редактировать'
const TAB_JOURNALS = 'Журналы'
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

const formatDate = (date: string) => dayjs(date).locale('ru').format('D MMMM YYYY')

type IMainProps = {
  readonly project: IProject
}

const Main: FC<IMainProps> = ({ project }) => {
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
          onClick={handleOpenEditModal}
          loading={isSaving}
        >
          {EDIT_BUTTON_LABEL}
        </Button>
      </div>

      <FormModal
        open={isEditModalOpen}
        project={projectData}
        onCancel={handleCloseEditModal}
        onSubmit={handleSubmitProject}
        submitting={isSaving}
      />

      <div className={styles.tabs}>
        <button className={cns(styles.tab, styles.tabActive)} type="button">
          {TAB_JOURNALS}
          <span className={styles.tabBadge}>{journals.length}</span>
        </button>
        <button className={styles.tab} type="button">
          {TAB_DOCS}
        </button>
        <button className={styles.tab} type="button">
          {TAB_PHOTO}
          <span className={styles.tabBadge}>{photoReportsCount}</span>
        </button>
        <button className={styles.tab} type="button">
          {TAB_PARTICIPANTS}
        </button>
      </div>

      <section className={styles.section}>
        <Button className={styles.addButton} type="primary">
          {ADD_BUTTON_LABEL}
        </Button>

        <ul className={styles.list}>
          {journals.map(journal => (
            <li key={journal.id} className={styles.listItem}>
              <div className={styles.itemDate}>{formatDate(journal.date)}</div>
              <div className={styles.itemTitle}>{journal.title}</div>
              <div className={styles.itemOpen}>{`${journal.openIssues} ${OPEN_SHORT_LABEL}`}</div>
              <div className={cns(styles.itemStatus, styles[`status_${journal.status}`])}>
                {statusMap[journal.status]}
              </div>
            </li>
          ))}
          {!journals.length ? <li className={styles.listItem}>{EMPTY_LABEL}</li> : null}
        </ul>
      </section>
    </div>
  )
}

export default Main
