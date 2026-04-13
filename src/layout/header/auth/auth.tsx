import React, { FC } from 'react'

import { IUser } from '@/shared/interfaces'

import Login from '@/layout/header/login/login'
import User from '@/layout/header/user/user'

interface IAuth {
  readonly user: IUser | null
}

const Auth: FC<IAuth> = ({ user }) => (user ? <User user={user} /> : <Login />)

export default Auth
