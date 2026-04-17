'use client'

import React, { FC, useState } from 'react'
import { Button, message, Modal } from 'antd'
import { useRouter } from 'next/navigation'

import { useQueryClient } from '@tanstack/react-query'

import { IGallery } from '@/shared/interfaces'

import useFancybox from '@/lib/useFancybox'

import Card from '@/modules/gallery/components/card/card'

import styles from './main.module.scss'

import { deleteGalleryApi } from '../../api/deleteGalleryApi'
import Form from '../form/form'

type IMainProps = {
  readonly gallery: IGallery[]
  readonly projectId: number
}

const GALLERY_UPLOAD_BTN = 'Загрузить фото'

const Main: FC<IMainProps> = ({ gallery, projectId }) => {
  const [setFancyboxRoot] = useFancybox()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<null | number>(null)
  const fancyboxGroup = `gallery-${projectId}`

  const handleOpenUploadModal = () => setIsUploadModalOpen(true)
  const handleCloseUploadModal = () => setIsUploadModalOpen(false)
  const handleDeletePhoto = async (id: number) => {
    try {
      setDeletingId(id)
      await deleteGalleryApi(id)
      await queryClient.invalidateQueries({ queryKey: ['gallery', projectId] })
      await queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      router.refresh()
      message.success('Фото удалено')
    } catch {
      message.error('Не удалось удалить фото')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Button type="primary" onClick={handleOpenUploadModal}>
          {GALLERY_UPLOAD_BTN}
        </Button>
      </div>

      {gallery.length > 0 ? (
        <div ref={setFancyboxRoot} className={styles.list}>
          {gallery.map(item => (
            <Card
              key={item.id}
              deletingId={deletingId}
              fancyboxGroup={fancyboxGroup}
              item={item}
              onDelete={handleDeletePhoto}
            />
          ))}
        </div>
      ) : null}

      <Modal
        destroyOnHidden
        footer={null}
        open={isUploadModalOpen}
        title="Загрузка фото"
        onCancel={handleCloseUploadModal}
      >
        <Form projectId={projectId} onCancel={handleCloseUploadModal} />
      </Modal>
    </div>
  )
}

export default Main
