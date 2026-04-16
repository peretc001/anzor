'use client'

import React, { FC, useEffect, useRef, useState } from 'react'
import { Button, message, Modal, Popconfirm, Tag } from 'antd'
import dayjs from 'dayjs'
import Image from 'next/image'

import { useQueryClient } from '@tanstack/react-query'

import { TrashIcon } from '@heroicons/react/24/outline'

import { IGallery } from '@/shared/interfaces'

import '@fancyapps/ui/dist/fancybox/fancybox.css'
import styles from './main.module.scss'

import 'dayjs/locale/ru'
import { deleteGalleryApi } from '../../api/deleteGalleryApi'
import Form from '../form/form'
import { Fancybox } from '@fancyapps/ui'

dayjs.locale('ru')

const FILTER_LABEL = 'Месяц'
const FANCYBOX_SELECTOR = '[data-fancybox="photoreport"]'
const FANCYBOX_GROUP = 'photoreport'

type IMainProps = {
  readonly gallery: IGallery[]
}

const Main: FC<IMainProps> = ({ gallery }) => {
  const queryClient = useQueryClient()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<null | number>(null)

  useEffect(() => {
    const root = scrollRef.current
    if (!root) return

    Fancybox.bind(root, FANCYBOX_SELECTOR, {
      Carousel: {
        infinite: false
      }
    })

    return () => {
      Fancybox.unbind(root, FANCYBOX_SELECTOR)
      Fancybox.close()
    }
  }, [])

  const handleOpenUploadModal = () => setIsUploadModalOpen(true)
  const handleCloseUploadModal = () => setIsUploadModalOpen(false)
  const handleDeletePhoto = async (id: number) => {
    try {
      setDeletingId(id)
      await deleteGalleryApi(id)
      await queryClient.invalidateQueries({ queryKey: ['gallery'] })
      await queryClient.invalidateQueries({ queryKey: ['tasks'] })
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
          <div ref={scrollRef} className={styles.scroll}>
            {gallery.map(({ id, task_id, url }) => (
              <div key={id} className={styles.cell}>
                {task_id ? <Tag className={styles.taskTag}>Задача #{task_id}</Tag> : null}
                <Popconfirm
                  cancelText="Отмена"
                  description="Действие нельзя отменить"
                  okButtonProps={{ danger: true, loading: deletingId === id }}
                  okText="Удалить"
                  title="Удалить фото?"
                  onConfirm={() => handleDeletePhoto(id)}
                >
                  <button
                    className={styles.deleteButton}
                    aria-label="Удалить фото"
                    disabled={deletingId === id}
                    type="button"
                  >
                    <TrashIcon className={styles.trashIcon} />
                  </button>
                </Popconfirm>
                <a
                  className={styles.thumbLink}
                  aria-label="Открыть в полном размере"
                  data-fancybox={FANCYBOX_GROUP}
                  href={process.env.NEXT_PUBLIC_S3_PATH + url}
                  rel="noreferrer"
                >
                  <Image
                    className={styles.thumb}
                    alt=""
                    height={300}
                    loading="lazy"
                    src={url}
                    width={300}
                  />
                </a>
              </div>
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
        <Form onCancel={handleCloseUploadModal} />
      </Modal>
    </div>
  )
}

export default Main
