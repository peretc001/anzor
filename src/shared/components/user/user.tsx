'use client'

import React from 'react'

import { useUserStore } from '@/shared/store/user'

import styles from './user.module.scss'

const User = () => {
  const user = useUserStore()

  return (
    <div className={styles.root}>
      <span className={styles.avatar}>
        <img alt="" src={user.avatar} />
      </span>
      <span className={styles.userInfo}>
        <span className={styles.userName}>{user.name}</span>
        <span className={styles.userRole}>{user.type}</span>
      </span>
    </div>
  )
}

export default User
