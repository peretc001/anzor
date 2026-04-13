'use client'

import React, { Suspense, useCallback, useEffect, useState } from 'react'
import { Modal } from 'antd'
import { useTranslations } from 'next-intl'

import { useMatchMedia } from '@/lib/useMatchMedia'

import styles from './authModal.module.scss'

import SigninPage from './components/signin/signin'
import SignupPage from './components/signup/signup'

const AuthModal = () => {
  const t = useTranslations('auth')

  const [type, setType] = useState('signin')

  const { isMobileMD } = useMatchMedia()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const hideModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleRegister = () => setType('signup')
  const handleLogin = () => setType('signin')

  useEffect(() => {
    const handleShowModal = () => {
      setIsModalOpen(true)
    }

    document.addEventListener('openSignupModal', handleShowModal as EventListener)
    return () => document.removeEventListener('openSignupModal', handleShowModal as EventListener)
    // eslint-disable-next-line
  }, [])

  return (
    <Modal
      className={styles.root}
      footer={null}
      open={isModalOpen}
      width={isMobileMD ? '100%' : '450px'}
      onCancel={hideModal}
    >
      <div className={styles.container}>
        <h2 className={styles.title}>{type === 'signin' ? t('signin') : t('signup')}</h2>

        <Suspense>
          {type === 'signin' ? (
            <SigninPage actionClose={hideModal} />
          ) : (
            <SignupPage actionClose={hideModal} />
          )}
        </Suspense>

        {type === 'signin' ? (
          <div className={styles.register}>
            {t('register')}
            <span className={styles.action} onClick={handleRegister}>
              {t('submit')}
            </span>
          </div>
        ) : (
          <div className={styles.register}>
            {t('login')}
            <span className={styles.action} onClick={handleLogin}>
              {t('confirm')}
            </span>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default AuthModal
