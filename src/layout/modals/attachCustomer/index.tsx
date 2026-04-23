'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Modal } from 'antd'

import { useMatchMedia } from '@/lib/useMatchMedia'

import AddForm from '@/layout/modals/attachCustomer/components/form/form'

import styles from './customer.module.scss'

const AttachCustomerModal = () => {
  const { isMobileMD } = useMatchMedia()

  const [projectId, setProjectId] = useState<null | number>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const hideModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  useEffect(() => {
    const handleShowModal = (ev: Event) => {
      const { projectId: nextProjectId } = (ev as CustomEvent<{ projectId: number }>).detail ?? {}
      if (nextProjectId != null) setProjectId(nextProjectId)

      setIsModalOpen(true)
    }

    document.addEventListener('openAttachCustomerModal', handleShowModal)
    return () => document.removeEventListener('openAttachCustomerModal', handleShowModal)
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
      <AddForm projectId={projectId} onClose={hideModal} />
    </Modal>
  )
}

export default AttachCustomerModal
