'use client'

import React, { FC } from 'react'
import { Button } from 'antd'
import { useTranslations } from 'next-intl'

import { ListBulletIcon } from '@heroicons/react/24/outline'

import styles from './empty.module.scss'

interface IEmptyTasks {
  readonly onClick: () => void
}

const Empty: FC<IEmptyTasks> = ({ onClick }) => {
  const t = useTranslations('tasks.empty')

  return (
    <div className={styles.root}>
      <div className={styles.iconWrap}>
        <ListBulletIcon className={styles.icon} aria-hidden />
      </div>
      <div className={styles.text}>
        <h2 className={styles.title}>{t('title')}</h2>
        <p className={styles.description}>{t('description')}</p>
      </div>
      <Button className={styles.cta} type="primary" onClick={onClick}>
        {t('cta')}
      </Button>
    </div>
  )
}

export default Empty
