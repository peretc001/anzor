'use client'

import React, { useMemo, useState } from 'react'
import { Button, Input } from 'antd'
import cns from 'classnames'
import Link from 'next/link'

import {
  BuildingOffice2Icon,
  ChevronRightIcon,
  ExclamationTriangleIcon,
  HomeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

import { useProjectsStore } from '@/shared/store/projects'

import { paths } from '@/constants'

import styles from './index.module.scss'

const getDurationColorClass = (duration: string) => {
  const days = Number.parseInt(duration, 10)

  if (Number.isNaN(days)) {
    return styles.durationDanger
  }

  if (days < 20) {
    return styles.durationSuccess
  }

  if (days < 30) {
    return styles.durationWarning
  }

  return styles.durationDanger
}

const Home = () => {
  const { projects } = useProjectsStore()
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const filteredProjects = useMemo(
    () =>
      projects.filter(project => {
        if (!normalizedQuery) {
          return true
        }

        const name = project.name.toLowerCase()
        const address = project.address.toLowerCase()

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

  const renderProjectCard = (project: (typeof projects)[number]) => (
    <Link
      key={project.id}
      className={cns(styles.card, !project.active && styles.archive)}
      href={paths.project + '/' + project.id}
    >
      <div className={styles.left}>
        <div className={styles.iconWrap}>
          {project.icon === 'building' ? (
            <BuildingOffice2Icon className={styles.icon} />
          ) : (
            <HomeIcon className={styles.icon} />
          )}
        </div>
      </div>

      <div className={styles.center}>
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{project.name}</h3>
          {project.warningsCount > 0 ? (
            <span className={styles.warning}>
              <ExclamationTriangleIcon className={styles.warningIcon} />
              {project.warningsCount}
            </span>
          ) : null}
        </div>

        <div className={styles.address}>
          <MapPinIcon className={styles.pinIcon} />
          <span>{project.address}</span>
        </div>

        <div className={styles.tags}>
          <span className={styles.tag}>{project.contractor}</span>
          {project.customer ? (
            <span className={`${styles.tag} ${styles.tagCustomer}`}>{project.customer}</span>
          ) : null}
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.rightInfo}>
          <div className={cns(styles.count, getDurationColorClass(project.duration))}>
            {project.duration}
          </div>
          <div className={styles.label}>срок</div>
        </div>
        <ChevronRightIcon className={styles.chevron} />
      </div>
    </Link>
  )

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Button className={styles.addButton} type="primary">
          + Добавить объект
        </Button>
        <Input
          className={styles.filter}
          placeholder="Поиск по названию и адресу"
          value={query}
          onChange={event => {
            setQuery(event.target.value)
          }}
        />
      </div>

      {activeProjects.length > 0 ? (
        <section className={styles.section}>
          <h2 className={styles.title}>Объекты</h2>
          <div className={styles.list}>{activeProjects.map(renderProjectCard)}</div>
        </section>
      ) : null}

      {archiveProjects.length > 0 ? (
        <section className={styles.section}>
          <h2 className={styles.title}>Завершенные</h2>
          <div className={styles.list}>{archiveProjects.map(renderProjectCard)}</div>
        </section>
      ) : null}
    </div>
  )
}

export default Home
