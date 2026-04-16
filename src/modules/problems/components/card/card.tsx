import React from 'react'
import cns from 'classnames'
import Link from 'next/link'
import dayjs from 'dayjs'

import {
  ArrowLongRightIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

import { paths } from '@/constants'
import type { IProblem } from '@/shared/interfaces'

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

const formatDeadline = (iso?: string | null) => {
  if (!iso) return null
  const d = dayjs(iso)
  if (!d.isValid()) return null
  return `до ${d.date()} ${MONTHS_SHORT[d.month()]} ${d.year()}`
}

type CardProps = {
  readonly problem: IProblem
}

const Card = ({ problem }: CardProps) => {
  const deadline = formatDeadline(problem.control)
  const comments = problem.comments_count ?? 0
  const isOpen = problem.status !== 'resolved'

  return (
    <li className={styles.root}>
      <div className={styles.left}>
        <span
          className={cns(styles.statusDot, !isOpen && styles.statusDotResolved)}
          aria-hidden
        />
        <div className={styles.content}>
          <Link
            className={styles.titleLink}
            href={`${paths.projects}/problem?id=${encodeURIComponent(String(problem.id))}`}
          >
            <h3 className={styles.title}>{problem.title}</h3>
          </Link>
          {(problem.executor || deadline) && (
            <div className={styles.meta}>
              {problem.executor ? (
                <>
                  <ArrowLongRightIcon className={styles.metaArrow} aria-hidden />
                  <span className={styles.executor}>{problem.executor}</span>
                </>
              ) : null}
              {deadline ? (
                <span className={styles.deadlineWrap}>
                  <ExclamationTriangleIcon className={styles.warnIcon} aria-hidden />
                  <span className={styles.deadline}>{deadline}</span>
                </span>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <div className={styles.right}>
        <span className={styles.commentBadge} aria-label={`Комментариев: ${comments}`}>
          <ChatBubbleLeftRightIcon className={styles.commentIcon} aria-hidden />
          <span className={styles.commentCount}>{comments}</span>
        </span>

        <button className={styles.iconBtn} type="button" aria-label="Развернуть">
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
