'use client'

import React, { useMemo, useState } from 'react'
import { Button, Input, message } from 'antd'
import { useQueryClient } from '@tanstack/react-query'

import type { ProjectCardModel } from '@/shared/store/projects'

import { saveProjectApi } from '@/modules/projects/api/saveProjectApi'
import Card from '@/modules/projects/components/card/card'
import FormModal, { ProjectFormValues } from '@/modules/projects/components/form/form'

import styles from './main.module.scss'

const UI_ADD_PROJECT = 'Добавить объект'
const UI_SEARCH_PLACEHOLDER = 'Поиск по названию и адресу'
const UI_SECTION_ACTIVE = 'Объекты'
const UI_SECTION_ARCHIVE = 'Завершенные'

type MainProps = {
  readonly projects: ProjectCardModel[]
}

const Main = ({ projects }: MainProps) => {
  const queryClient = useQueryClient()
  const [query, setQuery] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
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

  const handleCreateProject = async (values: ProjectFormValues) => {
    setIsCreating(true)

    const savedProject = await saveProjectApi(values)

    setIsCreating(false)

    if (!savedProject) {
      message.error('Не удалось создать объект')
      return
    }

    message.success('Объект создан')
    setIsCreateModalOpen(false)
    await queryClient.invalidateQueries({ queryKey: ['projects'] })
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Button className={styles.addButton} type="primary" onClick={handleOpenCreateModal}>
          {UI_ADD_PROJECT}
        </Button>
        <Input
          className={styles.filter}
          placeholder={UI_SEARCH_PLACEHOLDER}
          value={query}
          onChange={event => {
            setQuery(event.target.value)
          }}
        />
      </div>

      <FormModal
        open={isCreateModalOpen}
        submitting={isCreating}
        onCancel={handleCloseCreateModal}
        onSubmit={handleCreateProject}
      />

      <div className={styles.container}>
        {activeProjects.length > 0 ? (
          <section className={styles.section}>
            <h2 className={styles.title}>{UI_SECTION_ACTIVE}</h2>
            <div className={styles.list}>
              {activeProjects.map(project => (
                <Card key={project.id} project={project} />
              ))}
            </div>
          </section>
        ) : null}

        {archiveProjects.length > 0 ? (
          <section className={styles.section}>
            <h2 className={styles.title}>{UI_SECTION_ARCHIVE}</h2>
            <div className={styles.list}>
              {archiveProjects.map(project => (
                <Card key={project.id} project={project} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}

export default Main
