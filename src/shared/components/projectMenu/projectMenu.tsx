'use client'

import React, { FC } from 'react'
import cns from 'classnames'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'

import { paths } from '@/constants'

import styles from './projectMenu.module.scss'

interface IProjectMenu {
  readonly galleryPhotosCount: number
  readonly projectId: number
  readonly tasksCount: number
}

const ProjectMenu: FC<IProjectMenu> = ({ galleryPhotosCount, projectId, tasksCount }) => {
  const t = useTranslations('projects')

  const pathname = usePathname()

  return (
    <div className={styles.root}>
      <Link
        className={cns(
          styles.tab,
          pathname === paths.projects + '/' + projectId + '/tasks' && styles.active
        )}
        href={paths.projects + '/' + projectId + '/tasks'}
      >
        {t('menu.tasks')}
        <span className={styles.badge}>{tasksCount}</span>
      </Link>
      <Link
        className={cns(
          styles.tab,
          pathname === paths.projects + '/' + projectId + '/gallery' && styles.active
        )}
        href={paths.projects + '/' + projectId + '/gallery'}
      >
        {t('menu.gallery')}
        <span className={styles.badge}>{galleryPhotosCount}</span>
      </Link>
      <Link
        className={cns(
          styles.tab,
          pathname === paths.projects + '/' + projectId + '/docs' && styles.active
        )}
        href={paths.projects + '/' + projectId + '/docs'}
      >
        {t('menu.docs')}
      </Link>
    </div>
  )
}

export default ProjectMenu
