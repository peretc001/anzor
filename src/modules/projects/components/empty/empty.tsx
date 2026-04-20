'use client'

import React, { FC } from 'react'
import { Button } from 'antd'
import { useTranslations } from 'next-intl'

import { BuildingOffice2Icon } from '@heroicons/react/24/outline'

import styles from './empty.module.scss'

type EmptyProps = {
  readonly onAddProject: () => void
}

const Empty: FC<EmptyProps> = ({ onAddProject }) => {
  const t = useTranslations('projects.empty')

  return (
    <div className={styles.root}>
      <div className={styles.iconWrap}>
        <BuildingOffice2Icon className={styles.icon} aria-hidden />
      </div>
      <div className={styles.text}>
        <h2 className={styles.title}>{t('title')}</h2>
        <p className={styles.description}>{t('description')}</p>
      </div>
      <Button className={styles.cta} type="primary" onClick={onAddProject}>
        {t('cta')}
      </Button>
    </div>
  )
}

export default Empty
