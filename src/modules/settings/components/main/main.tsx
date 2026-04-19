import React, { FC } from 'react'

import type { IUser } from '@/shared/interfaces'

import UserForm from '@/modules/settings/components/userForm/userForm'

import styles from './main.module.scss'

interface IMain {
  readonly user: IUser | null
}

const Main: FC<IMain> = ({ user }) => (
  <div className={styles.root}>
    <UserForm user={user} />
  </div>
)

export default Main
