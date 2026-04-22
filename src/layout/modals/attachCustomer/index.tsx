'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Modal } from 'antd'
import { useTranslations } from 'next-intl'

import { useMatchMedia } from '@/lib/useMatchMedia'

import styles from './authModal.module.scss'

const AttachCustomerModal = () => {
  const t = useTranslations('auth')

  const { isMobileMD } = useMatchMedia()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const hideModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  useEffect(() => {
    const handleShowModal = () => {
      setIsModalOpen(true)
    }

    document.addEventListener('openAttachCustomerModal', handleShowModal as EventListener)
    return () =>
      document.removeEventListener('openAttachCustomerModal', handleShowModal as EventListener)
    // eslint-disable-next-line
  }, [])

  return (
    <Modal
      className={styles.root}
      destroyOnHidden
      footer={null}
      open={isModalOpen}
      width={isMobileMD ? '100%' : '450px'}
      onCancel={hideModal}
    >
      <div className={styles.container}>
        <h2 className={styles.title}>openAttachContractorModal</h2>
      </div>
    </Modal>
  )
}

export default AttachCustomerModal
