import React, { FC } from 'react'
import { Popconfirm, Tag } from 'antd'
import Image from 'next/image'

import { TrashIcon } from '@heroicons/react/24/outline'

import type { IGallery } from '@/shared/interfaces'

import styles from './card.module.scss'

type GalleryCardProps = {
  readonly deletingId: null | number
  readonly item: Pick<IGallery, 'id' | 'task_id' | 'url'>
  readonly onDelete: (id: number) => void
}

const GalleryCard: FC<GalleryCardProps> = ({
  deletingId,
  item: { id, task_id, url },
  onDelete
}) => {
  const s3Base = process.env.NEXT_PUBLIC_S3_PATH ?? ''

  return (
    <div className={styles.root}>
      {task_id ? <Tag className={styles.taskTag}>Задача #{task_id}</Tag> : null}
      <Popconfirm
        cancelText="Отмена"
        description="Действие нельзя отменить"
        okButtonProps={{ danger: true, loading: deletingId === id }}
        okText="Удалить"
        title="Удалить фото?"
        onConfirm={() => onDelete(id)}
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
        href={s3Base + url}
        rel="noreferrer"
        target="_blank"
      >
        <Image alt="" className={styles.thumb} height={300} loading="lazy" src={url} width={300} />
      </a>
    </div>
  )
}

export default GalleryCard
