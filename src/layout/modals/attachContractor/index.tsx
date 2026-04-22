'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Modal } from 'antd'

import { useMatchMedia } from '@/lib/useMatchMedia'

import AddForm from '@/layout/modals/attachContractor/components/form/form'

import styles from './authModal.module.scss'

const AttachContractorModal = () => {
  const { isMobileMD } = useMatchMedia()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const hideModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  useEffect(() => {
    const handleShowModal = () => {
      setIsModalOpen(true)
    }

    document.addEventListener('openAttachContractorModal', handleShowModal as EventListener)
    return () =>
      document.removeEventListener('openAttachContractorModal', handleShowModal as EventListener)
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
      <AddForm />
    </Modal>
  )
}

export default AttachContractorModal
