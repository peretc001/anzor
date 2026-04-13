'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import cns from 'classnames'
import Link from 'next/link'

import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ExclamationCircleIcon,
  QueueListIcon
} from '@heroicons/react/24/outline'

import '@fancyapps/ui/dist/fancybox/fancybox.css'
import styles from './index.module.scss'

import { Fancybox } from '@fancyapps/ui'

type ViolationStatus = 'active' | 'resolved'

type Violation = {
  id: string
  chatLabel: string
  dateText: string
  responsible: string
  status: ViolationStatus
  title: string
}

const MOCK_VIOLATIONS: Violation[] = [
  {
    id: '1',
    chatLabel: 'Чат 8 сообщений',
    dateText: '15.05.2026',
    responsible: 'Исполнитель',
    status: 'active',
    title: 'Кривая стена в зоне фартука кухни'
  },
  {
    id: '2',
    chatLabel: 'Чат',
    dateText: '18.05.2026',
    responsible: 'Исполнитель',
    status: 'active',
    title: 'Заменить петли двери в ванную — царапины на полотне и перекос'
  },
  {
    id: '3',
    chatLabel: 'Чат 23 сообщения',
    dateText: '02.05.2026',
    responsible: 'Исполнитель',
    status: 'resolved',
    title: 'Поломанный плинтус — заменить'
  },
  {
    id: '4',
    chatLabel: 'Чат 3 сообщения',
    dateText: '22.05.2026',
    responsible: 'Исполнитель',
    status: 'active',
    title: 'Щель между подоконником и стеной в спальне — требуется заделка'
  },
  {
    id: '5',
    chatLabel: 'Чат 12 сообщений',
    dateText: '25.05.2026',
    responsible: 'Исполнитель',
    status: 'active',
    title: 'Несовпадение оттенка краски на стыке с коридором'
  },
  {
    id: '6',
    chatLabel: 'Чат 5 сообщений',
    dateText: '28.05.2026',
    responsible: 'Исполнитель',
    status: 'active',
    title: 'Влажные пятна на потолке после дождя — проверить гидроизоляцию'
  },
  {
    id: '7',
    chatLabel: 'Чат',
    dateText: '28.04.2026',
    responsible: 'Исполнитель',
    status: 'resolved',
    title: 'Скол керамогранита в зоне входа'
  },
  {
    id: '8',
    chatLabel: 'Чат 4 сообщения',
    dateText: '30.04.2026',
    responsible: 'Исполнитель',
    status: 'resolved',
    title: 'Некорректная установка розеток в кухонной зоне — ниже нормы'
  },
  {
    id: '9',
    chatLabel: 'Чат 1 сообщение',
    dateText: '01.06.2026',
    responsible: 'Заказчик',
    status: 'active',
    title: 'Скрип ламината в гостиной у балконного блока'
  },
  {
    id: '10',
    chatLabel: 'Чат 2 сообщения',
    dateText: '05.05.2026',
    responsible: 'Исполнитель',
    status: 'resolved',
    title: 'Отсутствует заглушка на сифоне под раковиной в санузле'
  },
  {
    id: '11',
    chatLabel: 'Чат',
    dateText: '10.06.2026',
    responsible: 'Исполнитель',
    status: 'active',
    title: 'Трещина на штукатурке в углу коридора'
  },
  {
    id: '12',
    chatLabel: 'Чат 15 сообщений',
    dateText: '08.05.2026',
    responsible: 'Исполнитель',
    status: 'resolved',
    title: 'Неплотное прилегание межкомнатной двери к коробке'
  },
  {
    id: '13',
    chatLabel: 'Чат 6 сообщений',
    dateText: '12.05.2026',
    responsible: 'Исполнитель',
    status: 'resolved',
    title: 'Загрязнение стеклопакета после монтажа — требуется уборка'
  }
]

const VIOLATIONS_TOTAL = MOCK_VIOLATIONS.length
const VIOLATIONS_ACTIVE = MOCK_VIOLATIONS.filter(v => v.status === 'active').length

const SORTED_VIOLATIONS = [...MOCK_VIOLATIONS].sort((a, b) => {
  if (a.status === b.status) return 0
  return a.status === 'active' ? -1 : 1
})

/** Демо-превью (как на странице нарушения) */
const VIOLATION_PHOTO_URLS = [
  'https://i.pinimg.com/736x/59/ce/c7/59cec73bb09298a578a5dcff09ee89f6.jpg',
  'https://avatars.mds.yandex.net/get-ydo/3918388/2a0000019170b9265111157c9b35cbd3876b/diploma',
  'https://i.sstatic.net/cuHl5l.jpg'
] as const

const FANCYBOX_ITEM_SELECTOR = 'a[data-fancybox]'
const OPEN_PHOTO_ARIA_PREFIX = 'Открыть фото:'

const PAGE_TITLE = 'Нарушения'
const COUNTER_DISPLAY_SEP = ' / '
const FILTER_LABEL_ALL = 'Все'
const FILTER_LABEL_ACTIVE = 'К исправлению'
const FILTER_LABEL_RESOLVED = 'Исправлено'
const META_RESPONSIBLE = 'Ответственный:'
const META_DATE_EXPECTED = 'Ожидаемая дата исправления:'
const META_FIXED_PREFIX = 'Исправлено:'
const PAREN_OPEN = ' ('
const PAREN_CLOSE = ')'
const FILTER_ROW_ARIA = 'Фильтр по статусу'
const PHOTOS_SECTION_ARIA = 'Фотографии'

type FilterTab = 'active' | 'all' | 'resolved'

const Problems = () => {
  const [filter, setFilter] = useState<FilterTab>('all')
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const root = listRef.current
    if (!root) return

    Fancybox.bind(root, FANCYBOX_ITEM_SELECTOR, {
      Carousel: {
        infinite: false
      }
    })

    return () => {
      Fancybox.unbind(root, FANCYBOX_ITEM_SELECTOR)
      Fancybox.close()
    }
  }, [])

  const { countActive, countAll, countResolved } = useMemo(() => {
    const active = MOCK_VIOLATIONS.filter(v => v.status === 'active').length
    return {
      countActive: active,
      countAll: MOCK_VIOLATIONS.length,
      countResolved: MOCK_VIOLATIONS.length - active
    }
  }, [])

  const visibleViolations = useMemo(() => {
    if (filter === 'all') return SORTED_VIOLATIONS
    return SORTED_VIOLATIONS.filter(v => v.status === filter)
  }, [filter])

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Link className={styles.back} href="/pro/project/journal">
          <ChevronLeftIcon className={styles.icon} />
        </Link>
        <div className={styles.headerMain}>
          <h1 className={styles.title}>{PAGE_TITLE}</h1>
          <div
            className={styles.counter}
            aria-label={`Активных нарушений: ${VIOLATIONS_ACTIVE} из ${VIOLATIONS_TOTAL}`}
          >
            <span className={styles.counterActive}>{VIOLATIONS_ACTIVE}</span>
            <span className={styles.counterRest}>
              {COUNTER_DISPLAY_SEP}
              {VIOLATIONS_TOTAL}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.filterRow} aria-label={FILTER_ROW_ARIA} role="tablist">
          <button
            className={`${styles.filterBtn} ${filter === 'all' ? styles.filterBtnSelected : ''}`}
            aria-selected={filter === 'all'}
            role="tab"
            type="button"
            onClick={() => setFilter('all')}
          >
            <QueueListIcon
              className={`${styles.filterIcon} ${styles.filterIconNeutral}`}
              aria-hidden
            />
            <span>
              {FILTER_LABEL_ALL}
              {PAREN_OPEN}
              {countAll}
              {PAREN_CLOSE}
            </span>
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'active' ? styles.filterBtnSelected : ''}`}
            aria-selected={filter === 'active'}
            role="tab"
            type="button"
            onClick={() => setFilter('active')}
          >
            <ExclamationCircleIcon
              className={`${styles.filterIcon} ${styles.filterIconWarn}`}
              aria-hidden
            />
            <span>
              {FILTER_LABEL_ACTIVE}
              {PAREN_OPEN}
              {countActive}
              {PAREN_CLOSE}
            </span>
          </button>
          <button
            className={`${styles.filterBtn} ${filter === 'resolved' ? styles.filterBtnSelected : ''}`}
            aria-selected={filter === 'resolved'}
            role="tab"
            type="button"
            onClick={() => setFilter('resolved')}
          >
            <CheckCircleIcon
              className={`${styles.filterIcon} ${styles.filterIconOk}`}
              aria-hidden
            />
            <span>
              {FILTER_LABEL_RESOLVED}
              {PAREN_OPEN}
              {countResolved}
              {PAREN_CLOSE}
            </span>
          </button>
        </div>

        <ul ref={listRef} className={styles.list}>
          {visibleViolations.map(v => (
            <li key={v.id} className={styles.card}>
              <Link
                className={styles.cardLink}
                href={`/pro/project/problem?id=${encodeURIComponent(v.id)}`}
              >
                <div
                  className={
                    v.status === 'active' ? styles.statusRingActive : styles.statusRingResolved
                  }
                  aria-hidden
                />
                <div className={styles.cardBody}>
                  <p
                    className={
                      v.status === 'active' ? styles.cardTitleActive : styles.cardTitleResolved
                    }
                    title={v.title}
                  >
                    {v.title}
                  </p>
                  <p className={styles.meta}>
                    {META_RESPONSIBLE} <span className={styles.metaValue}>{v.responsible}</span>
                  </p>
                  {v.status === 'active' ? (
                    <p className={styles.meta}>
                      {META_DATE_EXPECTED} <span className={styles.metaValue}>{v.dateText}</span>
                    </p>
                  ) : (
                    <p className={styles.metaFixed}>
                      {META_FIXED_PREFIX}{' '}
                      <span className={styles.metaFixedValue}>{v.dateText}</span>
                    </p>
                  )}
                </div>
              </Link>
              <div className={styles.cardPhotos}>
                <div className={styles.photos} aria-label={PHOTOS_SECTION_ARIA}>
                  {VIOLATION_PHOTO_URLS.map(src => (
                    <a
                      key={`${v.id}-${src}`}
                      className={cns(styles.photoPlaceholder, styles.photoFancyLink)}
                      aria-label={`${OPEN_PHOTO_ARIA_PREFIX} ${v.title}`}
                      data-caption={v.title}
                      data-fancybox={`violation-list-${v.id}`}
                      href={src}
                      rel="noreferrer"
                    >
                      <img
                        className={styles.photoFancyImg}
                        alt=""
                        aria-hidden
                        decoding="async"
                        loading="lazy"
                        src={src}
                      />
                    </a>
                  ))}
                </div>
              </div>
              <Link href={`/pro/project/problem?id=${encodeURIComponent(v.id)}`}>
                <button className={styles.chatBtn} type="button">
                  {v.chatLabel}
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Problems
