'use client'

import React, { FC } from 'react'
import { Button } from 'antd'
import dayjs from 'dayjs'

import type { ITask } from '@/shared/interfaces'

import { EXECUTOR_TYPES, STATUS_TYPES, TASK_TYPES } from '@/constants'

import useFancybox from '@/lib/useFancybox'

import '@/shared/components/tiptap/tiptap-node/blockquote-node/blockquote-node.scss'
import '@/shared/components/tiptap/tiptap-node/heading-node/heading-node.scss'
import '@/shared/components/tiptap/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss'
import '@/shared/components/tiptap/tiptap-node/image-node/image-node.scss'
import '@/shared/components/tiptap/tiptap-node/list-node/list-node.scss'
import '@/shared/components/tiptap/tiptap-node/paragraph-node/paragraph-node.scss'
import '@/shared/components/tiptap/tiptap-templates/simple/simple-editor.scss'

import styles from './task-preview.module.scss'

const labelOf = (items: readonly { label: string; value: string }[], value?: null | string) => {
  if (value == null || value === '') {
    return '—'
  }
  return items.find(i => i.value === value)?.label ?? value
}

type TaskPreviewProps = {
  readonly onClose: () => void
  readonly onEdit: () => void
  readonly task: ITask
}

const TaskPreview: FC<TaskPreviewProps> = ({ onClose, onEdit, task }) => {
  const s3Base = process.env.NEXT_PUBLIC_S3_PATH ?? ''
  const [setFancyboxRoot] = useFancybox()
  const fancyboxGroup = `task-preview-${task.id}`
  const desc = task.description?.trim()
  const descHtml = desc ? (task.description ?? '') : ''

  return (
    <>
      <div ref={setFancyboxRoot} className={styles.root}>
        <div className={styles.rowPair}>
          <div className={styles.field}>
            <span className={styles.label}>Тип задачи</span>
            <span className={styles.value}>{labelOf(TASK_TYPES, task.type)}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Статус</span>
            <span className={styles.value}>{labelOf(STATUS_TYPES, task.status)}</span>
          </div>
        </div>

        <div className={styles.rowPair}>
          <div className={styles.field}>
            <span className={styles.label}>Ответственный</span>
            <span className={styles.value}>{labelOf(EXECUTOR_TYPES, task.executor)}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.label}>Ожидаемая дата</span>
            <span className={styles.value}>
              {task.control ? dayjs(task.control).format('DD.MM.YYYY') : '—'}
            </span>
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Название</span>
          <span className={styles.titleValue}>{task.title}</span>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Описание</span>
          {descHtml ? (
            <div className={styles.descriptionBox}>
              <div className="simple-editor-content">
                <div
                  className="tiptap ProseMirror simple-editor readonly"
                  // контент из собственного редактора задач
                  dangerouslySetInnerHTML={{ __html: descHtml }}
                />
              </div>
            </div>
          ) : (
            <p className={styles.emptyDescription}>Нет описания</p>
          )}
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Фото</span>
          {task.photos?.length ? (
            <div className={styles.photos}>
              {task.photos.map(photo => (
                <a
                  key={photo}
                  className={styles.photoLink}
                  data-caption={task.title}
                  data-fancybox={fancyboxGroup}
                  href={`${s3Base}${photo}`}
                  rel="noreferrer"
                >
                  <img className={styles.photoThumb} alt="" loading="lazy" src={`${s3Base}${photo}`} />
                </a>
              ))}
            </div>
          ) : (
            <span className={styles.value}>—</span>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="primary" onClick={onEdit}>
          Редактировать
        </Button>
        <Button onClick={onClose}>Закрыть</Button>
      </div>
    </>
  )
}

export default TaskPreview
