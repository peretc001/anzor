'use client'

import React from 'react'
import Link from 'next/link'

import { useUserStore } from '@/shared/store/user'

import { paths } from '@/constants'

import { resolveAvatarPublicUrl } from '@/lib/avatarPublicUrl'

import styles from './user.module.scss'

const User = () => {
  const user = useUserStore()
  const avatarSrc = resolveAvatarPublicUrl(user.avatar)
  const initial = (user.name || '?').trim().charAt(0).toUpperCase()

  return (
    <Link className={styles.root} href={paths.settings}>
      <span className={styles.avatar}>
        {avatarSrc ? <img alt="" src={avatarSrc} /> : <span aria-hidden>{initial}</span>}
      </span>
      <span className={styles.userInfo}>
        <span className={styles.userName}>{user.name || user.email}</span>
        <span className={styles.userRole}>{user.type || 'дизайнер'}</span>
      </span>
    </Link>
  )
}

export default User
