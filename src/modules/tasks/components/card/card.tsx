'use client'

import React from 'react'
import { Dropdown, message, Popconfirm, Spin } from 'antd'
import cns from 'classnames'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  ArrowLongRightIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

import type { ITask } from '@/shared/interfaces'

import { paths, STATUS_TYPES } from '@/constants'

import useFancybox from '@/lib/useFancybox'

import { deleteTaskApi } from '@/modules/tasks/api/deleteTaskApi'
import { updateTaskApi } from '@/modules/tasks/api/updateTaskApi'

import styles from './card.module.scss'

const MONTHS_SHORT = [
  'янв.',
  'фев.',
  'мар.',
  'апр.',
  'мая',
  'июн.',
  'июл.',
  'авг.',
  'сен.',
  'окт.',
  'ноя.',
  'дек.'
] as const

const formatDeadline = (date?: null | string) => {
  if (!date) return null
  const d = dayjs(date).format('DD MMM YYYY')
  return `до ${d}`
}

type CardProps = {
  readonly projectId: number
  readonly task: ITask
}

const Card = ({ projectId, task }: CardProps) => {
  const [setFancyboxRoot] = useFancybox()
  const router = useRouter()
  const queryClient = useQueryClient()
  const deadline = formatDeadline(task.control)
  const s3Base = process.env.NEXT_PUBLIC_S3_PATH ?? ''
  const fancyboxGroup = `task-${task.id}`

  const { isPending, mutateAsync } = useMutation({
    mutationFn: () => deleteTaskApi(task.id),
    onSuccess: async ok => {
      if (!ok) {
        message.error('Не удалось удалить задачу')
        return
      }
      message.success('Задача удалена')
      await queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      await queryClient.invalidateQueries({ queryKey: ['gallery', projectId] })
      router.refresh()
    }
  })

  const { isPending: isSavingStatus, mutateAsync: saveStatus } = useMutation({
    mutationFn: (status: string) => updateTaskApi(task.id, { status }),
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
    },
    onSuccess: data => {
      if (!data) {
        message.error('Не удалось сохранить статус')
      }
    }
  })

  const handleConfirmDelete = async () => {
    try {
      await mutateAsync()
    } catch {
      message.error('Не удалось удалить задачу')
    }
  }

  const handleStatusChange = (status: string) => {
    void saveStatus(status)
  }

  const currentStatus = STATUS_TYPES.find(s => s.value === task.status)

  return (
    <li className={styles.root}>
      <div ref={setFancyboxRoot} className={styles.left}>
        {task.id ? <div className={styles.taskId}>#{task.id}</div> : null}

        <div className={styles.content}>
          <Link
            className={styles.titleLink}
            href={`${paths.projects}/task?id=${encodeURIComponent(String(task.id))}`}
          >
            <h3 className={styles.title}>{task.title}</h3>
          </Link>

          {task.executor || deadline ? (
            <div className={styles.meta}>
              {task.executor ? (
                <>
                  <ArrowLongRightIcon className={styles.metaArrow} aria-hidden />
                  <span className={styles.executor}>{task.executor}</span>
                </>
              ) : null}
              {deadline ? (
                <span className={styles.deadlineWrap}>
                  <ExclamationTriangleIcon className={styles.warnIcon} aria-hidden />
                  <span className={styles.deadline}>{deadline}</span>
                </span>
              ) : null}
            </div>
          ) : null}

          {task.photos?.length ? (
            <div className={styles.photos}>
              {task.photos.slice(0, 4).map(photo => (
                <a
                  key={photo}
                  className={styles.photoLink}
                  data-caption={task.title}
                  data-fancybox={fancyboxGroup}
                  href={`${s3Base}${photo}`}
                  rel="noreferrer"
                >
                  <img
                    className={styles.photoThumb}
                    alt=""
                    loading="lazy"
                    src={`${s3Base}${photo}`}
                  />
                </a>
              ))}
              {task.photos.length > 4 ? (
                <span className={styles.photoMore}>{`+${task.photos.length - 4}`}</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.status}>
          <Dropdown
            classNames={{ root: styles.statusDropdown }}
            disabled={isSavingStatus}
            menu={{
              items: STATUS_TYPES.map(s => ({
                key: s.value,
                label: <span className={cns(styles.statusOption, styles[s.value])}>{s.label}</span>
              })),
              selectable: true,
              selectedKeys:
                task.status && STATUS_TYPES.some(s => s.value === task.status) ? [task.status] : [],
              onClick: ({ key }) => {
                if (key !== task.status) handleStatusChange(String(key))
              }
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <button className={styles.statusTrigger} disabled={isSavingStatus} type="button">
              {currentStatus ? (
                <span className={cns(styles.statusLabel, styles[currentStatus.value])}>
                  {currentStatus.label}
                </span>
              ) : task.status != null && task.status !== '' ? (
                String(task.status)
              ) : null}
              {isSavingStatus ? (
                <Spin className={styles.statusSavingSpin} size="small" />
              ) : (
                <ChevronDownIcon className={styles.statusChevron} aria-hidden />
              )}
            </button>
          </Dropdown>
        </div>

        <Popconfirm
          cancelText="Отмена"
          description="Будут удалены задача и все привязанные к ней фото"
          okButtonProps={{ danger: true, loading: isPending }}
          okText="Удалить"
          title="Удалить задачу?"
          onConfirm={handleConfirmDelete}
        >
          <button
            className={styles.deleteBtn}
            aria-label="Удалить задачу"
            disabled={isPending}
            type="button"
          >
            <TrashIcon className={styles.deleteIcon} aria-hidden />
          </button>
        </Popconfirm>
      </div>
    </li>
  )
}

export default Card
