'use client'

import React, { FC, useState } from 'react'
import { Button, message, Modal } from 'antd'

import { useQueryClient } from '@tanstack/react-query'

import { IGallery } from '@/shared/interfaces'

import styles from './main.module.scss'

import { deleteGalleryApi } from '../../api/deleteGalleryApi'
import Card from '@/modules/gallery/components/card/card'
import Form from '../form/form'

type IMainProps = {
  readonly gallery: IGallery[]
  readonly projectId: number
}

const Main: FC<IMainProps> = ({ gallery, projectId }) => {
  const queryClient = useQueryClient()
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<null | number>(null)

  const handleOpenUploadModal = () => setIsUploadModalOpen(true)
  const handleCloseUploadModal = () => setIsUploadModalOpen(false)
  const handleDeletePhoto = async (id: number) => {
    try {
      setDeletingId(id)
      await deleteGalleryApi(id)
      await queryClient.invalidateQueries({ queryKey: ['gallery', projectId] })
      await queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
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
          Загрузить фото
        </Button>
      </div>

      <section className={styles.section}>
        {gallery.length > 0 ? (
          <div className={styles.scroll}>
            {gallery.map(item => (
              <Card
                key={item.id}
                deletingId={deletingId}
                item={item}
                onDelete={handleDeletePhoto}
              />
            ))}
          </div>
        ) : null}
      </section>

      <Modal
        destroyOnHidden
        footer={null}
        open={isUploadModalOpen}
        title="Загрузка фото"
        onCancel={handleCloseUploadModal}
      >
        <Form onCancel={handleCloseUploadModal} projectId={projectId} />
      </Modal>
    </div>
  )
}

export default Main
