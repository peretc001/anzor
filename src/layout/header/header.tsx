import React from 'react'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'

import { paths } from '@/constants'

import { getCurrentUser } from '@/lib/getCurrentUser'

import Auth from '@/layout/header/auth/auth'

import styles from './header.module.scss'

const Header = async () => {
  const t = await getTranslations('header')

  const user = await getCurrentUser()

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <Link className={styles.logo} href="/">
          <img alt="" src="/logo.png" />
          <div className={styles.title}>
            <div className={styles.caption}>{process.env.NEXT_PUBLIC_NAME}</div>
            <div className={styles.description}>{process.env.NEXT_PUBLIC_DESCRIPTION}</div>
          </div>
        </Link>

        <div className={styles.menu}>
          <Link href={paths.catalog}>{t('menu.catalog')}</Link>
          <Link href={paths.portfolio}>{t('menu.portfolio')}</Link>
          <Link href={paths.blog}>{t('menu.blog')}</Link>
        </div>

        <Auth user={user} />
      </div>
    </div>
  )
}

export default Header
