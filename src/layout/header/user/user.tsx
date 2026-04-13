'use client'

import { FC } from 'react'
import { Dropdown, MenuProps } from 'antd'
import cns from 'classnames'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

import { ChevronDownIcon } from '@heroicons/react/20/solid'

import { IUser } from '@/shared/interfaces'

import { paths } from '@/constants'

import { eventLogout } from '@/lib/amplitudeEvents'

import styles from './user.module.scss'

import { signout } from '@/app/actions/auth'

interface IUserProps {
  readonly user: IUser
}

const User: FC<IUserProps> = ({ user }) => {
  const t = useTranslations('account')

  const { email, user_metadata } = user || {}
  const { avatar } = user_metadata || {}

  const handleLogout = async () => {
    await signout()
    eventLogout()
  }

  const items: MenuProps['items'] = [
    {
      key: '0',
      label: <Link href={paths.account.index}>{t('menu.index')}</Link>
    },
    {
      key: '1',
      label: <Link href={paths.account.about}>{t('menu.about')}</Link>
    },
    {
      key: '2',
      label: <Link href={paths.account.prices}>{t('menu.prices')}</Link>
    },
    {
      key: '3',
      label: <Link href={paths.account.contacts}>{t('menu.contacts')}</Link>
    },
    {
      key: '4',
      label: <Link href={paths.account.gallery}>{t('menu.gallery')}</Link>
    },
    {
      key: '5',
      label: <Link href={paths.account.portfolio.index}>{t('menu.portfolio')}</Link>
    },
    {
      type: 'divider'
    },
    {
      key: '6',
      label: 'Выйти',
      onClick: handleLogout
    }
  ]

  return (
    <div className={cns(styles.root, !user && styles.loading)}>
      {user ? (
        <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
          <div className={styles.user}>
            {avatar ? (
              <img
                className={styles.avatar}
                alt=""
                src={process.env.NEXT_PUBLIC_S3_PATH + avatar}
              />
            ) : (
              <div className={styles.avatar} />
            )}

            <div className={styles.drop}>
              <ChevronDownIcon className={styles.icon} />
            </div>
            {email ? <div className={styles.email}>{email}</div> : null}
          </div>
        </Dropdown>
      ) : null}
    </div>
  )
}

export default User
