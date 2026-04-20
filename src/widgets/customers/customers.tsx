import React from 'react'
import { useTranslations } from 'next-intl'

import { UsersIcon } from '@heroicons/react/24/outline'

import styles from './customers.module.scss'

const Customers = () => {
  const t = useTranslations('customers.empty')

  return (
    <div className={styles.root}>
      <div className={styles.iconWrap}>
        <UsersIcon className={styles.icon} aria-hidden />
      </div>
      <div className={styles.text}>
        <h2 className={styles.title}>{t('title')}</h2>
        <p className={styles.description}>{t('description')}</p>
      </div>
    </div>
  )
}

export default Customers
