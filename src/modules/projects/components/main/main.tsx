'use client'

import React, { useMemo, useState } from 'react'
import { Button, Input, Modal } from 'antd'
import { useTranslations } from 'next-intl'

import { IProject } from '@/shared/interfaces'

import Card from '@/modules/projects/components/card/card'
import Empty from '@/modules/projects/components/empty/empty'
import AddProject from '@/modules/projects/components/form/form'

import styles from './main.module.scss'

interface IProjectData extends IProject {
  photos_count: number
  tasks_count: number
}

type MainProps = {
  readonly projects: IProjectData[]
}

const Main = ({ projects }: MainProps) => {
  const t = useTranslations('projects')

  const [query, setQuery] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const normalizedQuery = query.trim().toLowerCase()

  const filteredProjects = useMemo(
    () =>
      projects.filter(project => {
        if (!normalizedQuery) {
          return true
        }

        const name = project.name.toLowerCase()
        const address = (project.address ?? '').toLowerCase()

        return name.includes(normalizedQuery) || address.includes(normalizedQuery)
      }),
    [projects, normalizedQuery]
  )
  const activeProjects = useMemo(
    () => filteredProjects.filter(project => project.active),
    [filteredProjects]
  )
  const archiveProjects = useMemo(
    () => filteredProjects.filter(project => !project.active),
    [filteredProjects]
  )

  const handleOpenCreateModal = () => setIsCreateModalOpen(true)
  const handleCloseCreateModal = () => setIsCreateModalOpen(false)

  return (
    <div className={styles.root}>
      {projects.length > 0 ? (
        <div className={styles.header}>
          <Button className={styles.addButton} type="primary" onClick={handleOpenCreateModal}>
            {t('header.create')}
          </Button>
          <Input
            className={styles.filter}
            placeholder={t('header.search')}
            value={query}
            onChange={event => {
              setQuery(event.target.value)
            }}
          />
        </div>
      ) : (
        <Empty onClick={handleOpenCreateModal} />
      )}

      {projects.length > 0 ? (
        <div className={styles.container}>
          {activeProjects.length > 0 ? (
            <section className={styles.section}>
              <h2 className={styles.title}>{t('list.all')}</h2>
              <div className={styles.list}>
                {activeProjects.map(project => (
                  <Card key={project.id} project={project} />
                ))}
              </div>
            </section>
          ) : null}

          {archiveProjects.length > 0 ? (
            <section className={styles.section}>
              <h2 className={styles.title}>{t('list.archived')}</h2>
              <div className={styles.list}>
                {archiveProjects.map(project => (
                  <Card key={project.id} project={project} />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : null}

      <Modal
        destroyOnHidden
        footer={null}
        open={isCreateModalOpen}
        title={t('header.create')}
        onCancel={handleCloseCreateModal}
      >
        <AddProject onCancel={handleCloseCreateModal} />
      </Modal>
    </div>
  )
}

export default Main
