'use client'

import React, { useMemo, useState } from 'react'
import { Button, Input } from 'antd'

import type { ProjectCardModel } from '@/shared/store/projects'

import Card from '@/modules/projects/components/card/card'

import styles from './main.module.scss'

const UI_ADD_PROJECT = 'Добавить объект'
const UI_SEARCH_PLACEHOLDER = 'Поиск по названию и адресу'
const UI_SECTION_ACTIVE = 'Объекты'
const UI_SECTION_ARCHIVE = 'Завершенные'

type MainProps = {
  readonly projects: ProjectCardModel[]
}

const Main = ({ projects }: MainProps) => {
  const [query, setQuery] = useState('')
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

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Button className={styles.addButton} type="primary">
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
