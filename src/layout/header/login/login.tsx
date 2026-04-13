'use client'

import React from 'react'
import { Button } from 'antd'
import { useTranslations } from 'next-intl'

import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline'

import { eventLoginClick } from '@/lib/amplitudeEvents'
import { openSignupModal } from '@/lib/openSignupModal'
import { useMatchMedia } from '@/lib/useMatchMedia'

import styles from './login.module.scss'

const Login = () => {
  const t = useTranslations('header')

  const { isMobileMD } = useMatchMedia()

  const handleSignup = () => {
    openSignupModal()
    eventLoginClick()
  }

  return (
    <Button className={styles.root} type="primary" onClick={handleSignup}>
      {isMobileMD ? <ArrowRightEndOnRectangleIcon className={styles.icon} /> : t('account')}
    </Button>
  )
}

export default Login
