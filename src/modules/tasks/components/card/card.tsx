import React from 'react'
import cns from 'classnames'
import dayjs from 'dayjs'
import Link from 'next/link'

import {
  ArrowLongRightIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

import type { ITask } from '@/shared/interfaces'

import { paths } from '@/constants'

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

const formatDeadline = (iso?: null | string) => {
  if (!iso) return null
  const d = dayjs(iso)
  if (!d.isValid()) return null
  return `до ${d.date()} ${MONTHS_SHORT[d.month()]} ${d.year()}`
}

type CardProps = {
  readonly task: ITask
}

const Card = ({ task }: CardProps) => {
  const deadline = formatDeadline(task.control)
  const comments = task.comments_count ?? 0
  const isOpen = task.status !== 'resolved'

  return (
    <li className={styles.root}>
      <div className={styles.left}>
        <span className={cns(styles.statusDot, !isOpen && styles.statusDotResolved)} aria-hidden />
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
                  href={`${process.env.NEXT_PUBLIC_S3_PATH}${photo}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <img
                    className={styles.photoThumb}
                    alt=""
                    loading="lazy"
                    src={`${process.env.NEXT_PUBLIC_S3_PATH}${photo}`}
                  />
                </a>
              ))}
              {task.photos.length > 4 ? (
                <span className={styles.photoMore}>+{task.photos.length - 4}</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <div className={styles.right}>
        <span className={styles.commentBadge} aria-label={`Комментариев: ${comments}`}>
          <ChatBubbleLeftRightIcon className={styles.commentIcon} aria-hidden />
          <span className={styles.commentCount}>{comments}</span>
        </span>

        <button className={styles.iconBtn} aria-label="Развернуть" type="button">
          <ChevronDownIcon className={styles.chevron} aria-hidden />
        </button>

        {isOpen ? (
          <>
            <span className={styles.badgeOpen}>Открыто</span>
            <button className={styles.fixedBtn} type="button">
              <CheckCircleIcon className={styles.fixedIcon} aria-hidden />
              Исправлено
            </button>
          </>
        ) : (
          <span className={styles.badgeResolved}>Исправлено</span>
        )}
      </div>
    </li>
  )
}

export default Card
