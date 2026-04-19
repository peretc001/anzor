'use client'

import React, { type FC, useMemo, useState } from 'react'
import { message, Popconfirm } from 'antd'
import { useRouter } from 'next/navigation'

import { useQueryClient } from '@tanstack/react-query'

import { TrashIcon } from '@heroicons/react/24/outline'

import type { IDocument } from '@/shared/interfaces'

import styles from './list.module.scss'

import { deleteDocumentsApi } from '../../api/deleteDocumentsApi'

/** Префикс `{timestamp}-{uuid}-` в имени файла в хранилище. */
const STORED_NAME_PREFIX =
  /^\d+-[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-/i

export function documentDisplayNameFromUrl(url: string): string {
  const segment = url.split('/').filter(Boolean).pop()
  if (!segment) {
    return url
  }
  const stripped = segment.replace(STORED_NAME_PREFIX, '')
  return stripped || segment
}

export type DocumentsListProps = {
  readonly documents: IDocument[]
  readonly projectId: number
}

const List: FC<DocumentsListProps> = ({ documents, projectId }) => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [deletingId, setDeletingId] = useState<null | number>(null)
  const s3Base = process.env.NEXT_PUBLIC_S3_PATH ?? ''

  const sorted = useMemo(() => {
    const copy = [...documents]
    copy.sort((a, b) => {
      const ta = a.created_at ? new Date(a.created_at).getTime() : 0
      const tb = b.created_at ? new Date(b.created_at).getTime() : 0
      return tb - ta
    })
    return copy
  }, [documents])

  const handleDelete = async (id: number) => {
    try {
      setDeletingId(id)
      await deleteDocumentsApi(id)
      await queryClient.invalidateQueries({ queryKey: ['documents', projectId] })
      router.refresh()
      message.success('Документ удалён')
    } catch {
      message.error('Не удалось удалить документ')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <ul className={styles.root}>
      {sorted.map(item => {
        const href = s3Base + item.url
        const title = documentDisplayNameFromUrl(item.url)

        return (
          <li key={item.id} className={styles.row}>
            <span className={styles.name} title={title}>
              {title}
            </span>
            <a className={styles.openLink} href={href} rel="noopener noreferrer" target="_blank">
              Открыть
            </a>
            <Popconfirm
              cancelText="Отмена"
              description="Действие нельзя отменить"
              okButtonProps={{ danger: true, loading: deletingId === item.id }}
              okText="Удалить"
              title="Удалить документ?"
              onConfirm={() => {
                void handleDelete(item.id)
              }}
            >
              <button
                aria-label="Удалить документ"
                className={styles.deleteButton}
                disabled={deletingId === item.id}
                type="button"
              >
                <TrashIcon className={styles.trashIcon} />
              </button>
            </Popconfirm>
          </li>
        )
      })}
    </ul>
  )
}

export default List
