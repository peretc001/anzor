'use client'

import React from 'react'
import { Button } from 'antd'

import { openSignupModal } from '@/lib/openSignupModal'

import styles from './login.module.scss'

const Login = () => {
  const handleLogin = () => {
    openSignupModal()
  }

  return (
    <div className={styles.root}>
      <span>Вы не авторизованны.</span>
      <Button type="primary" onClick={handleLogin}>
        Авторизоваться
      </Button>
    </div>
  )
}

export default Login
