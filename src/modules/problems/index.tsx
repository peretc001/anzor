'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'

import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ExclamationCircleIcon,
  QueueListIcon,
} from '@heroicons/react/24/outline'

import styles from './index.module.scss'

type ViolationStatus = 'active' | 'resolved'

type Violation = {
  id: string
  title: string
  status: ViolationStatus
  responsible: string
  dateText: string
  chatLabel: string
}

const MOCK_VIOLATIONS: Violation[] = [
  {
    id: '1',
    title: 'Кривая стена в зоне фартука кухни',
    status: 'active',
    responsible: 'Исполнитель',
    dateText: '15.05.2026',
    chatLabel: 'Чат 8 сообщений',
  },
  {
    id: '2',
    title: 'Заменить петли двери в ванную — царапины на полотне и перекос',
    status: 'active',
    responsible: 'Исполнитель',
    dateText: '18.05.2026',
    chatLabel: 'Чат',
  },
  {
    id: '3',
    title: 'Поломанный плинтус — заменить',
    status: 'resolved',
    responsible: 'Исполнитель',
    dateText: '02.05.2026',
    chatLabel: 'Чат 23 сообщения',
  },
  {
    id: '4',
    title: 'Щель между подоконником и стеной в спальне — требуется заделка',
    status: 'active',
    responsible: 'Исполнитель',
    dateText: '22.05.2026',
    chatLabel: 'Чат 3 сообщения',
  },
  {
    id: '5',
    title: 'Несовпадение оттенка краски на стыке с коридором',
    status: 'active',
    responsible: 'Исполнитель',
    dateText: '25.05.2026',
    chatLabel: 'Чат 12 сообщений',
  },
  {
    id: '6',
    title: 'Влажные пятна на потолке после дождя — проверить гидроизоляцию',
    status: 'active',
    responsible: 'Исполнитель',
    dateText: '28.05.2026',
    chatLabel: 'Чат 5 сообщений',
  },
  {
    id: '7',
    title: 'Скол керамогранита в зоне входа',
    status: 'resolved',
    responsible: 'Исполнитель',
    dateText: '28.04.2026',
    chatLabel: 'Чат',
  },
  {
    id: '8',
    title: 'Некорректная установка розеток в кухонной зоне — ниже нормы',
    status: 'resolved',
    responsible: 'Исполнитель',
    dateText: '30.04.2026',
    chatLabel: 'Чат 4 сообщения',
  },
  {
    id: '9',
    title: 'Скрип ламината в гостиной у балконного блока',
    status: 'active',
    responsible: 'Заказчик',
    dateText: '01.06.2026',
    chatLabel: 'Чат 1 сообщение',
  },
  {
    id: '10',
    title: 'Отсутствует заглушка на сифоне под раковиной в санузле',
    status: 'resolved',
    responsible: 'Исполнитель',
    dateText: '05.05.2026',
    chatLabel: 'Чат 2 сообщения',
  },
  {
    id: '11',
    title: 'Трещина на штукатурке в углу коридора',
    status: 'active',
    responsible: 'Исполнитель',
    dateText: '10.06.2026',
    chatLabel: 'Чат',
  },
  {
    id: '12',
    title: 'Неплотное прилегание межкомнатной двери к коробке',
    status: 'resolved',
    responsible: 'Исполнитель',
    dateText: '08.05.2026',
    chatLabel: 'Чат 15 сообщений',
  },
  {
    id: '13',
    title: 'Загрязнение стеклопакета после монтажа — требуется уборка',
    status: 'resolved',
    responsible: 'Исполнитель',
    dateText: '12.05.2026',
    chatLabel: 'Чат 6 сообщений',
  },
]

const VIOLATIONS_TOTAL = MOCK_VIOLATIONS.length
const VIOLATIONS_ACTIVE = MOCK_VIOLATIONS.filter((v) => v.status === 'active').length

const SORTED_VIOLATIONS = [...MOCK_VIOLATIONS].sort((a, b) => {
  if (a.status === b.status) return 0
  return a.status === 'active' ? -1 : 1
})

type FilterTab = 'all' | 'active' | 'resolved'

const Problems = () => {
  const [filter, setFilter] = useState<FilterTab>('all')

  const { countAll, countActive, countResolved } = useMemo(() => {
    const active = MOCK_VIOLATIONS.filter((v) => v.status === 'active').length
    return {
      countAll: MOCK_VIOLATIONS.length,
      countActive: active,
      countResolved: MOCK_VIOLATIONS.length - active,
    }
  }, [])

  const visibleViolations = useMemo(() => {
    if (filter === 'all') return SORTED_VIOLATIONS
    return SORTED_VIOLATIONS.filter((v) => v.status === filter)
  }, [filter])

  return (
  <div className={styles.root}>
    <div className={styles.header}>
      <Link className={styles.back} href="/pro/project/journal">
        <ChevronLeftIcon className={styles.icon} />
      </Link>
      <div className={styles.headerMain}>
        <h1 className={styles.title}>Нарушения</h1>
        <div className={styles.counter} aria-label={`Активных нарушений: ${VIOLATIONS_ACTIVE} из ${VIOLATIONS_TOTAL}`}>
          <span className={styles.counterActive}>{VIOLATIONS_ACTIVE}</span>
          <span className={styles.counterRest}> / {VIOLATIONS_TOTAL}</span>
        </div>
      </div>
    </div>

    <div className={styles.container}>
      <div className={styles.filterRow} role="tablist" aria-label="Фильтр по статусу">
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'all'}
          className={`${styles.filterBtn} ${filter === 'all' ? styles.filterBtnSelected : ''}`}
          onClick={() => setFilter('all')}
        >
          <QueueListIcon className={`${styles.filterIcon} ${styles.filterIconNeutral}`} aria-hidden />
          <span>Все ({countAll})</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'active'}
          className={`${styles.filterBtn} ${filter === 'active' ? styles.filterBtnSelected : ''}`}
          onClick={() => setFilter('active')}
        >
          <ExclamationCircleIcon className={`${styles.filterIcon} ${styles.filterIconWarn}`} aria-hidden />
          <span>
            К исправлению ({countActive})
          </span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={filter === 'resolved'}
          className={`${styles.filterBtn} ${filter === 'resolved' ? styles.filterBtnSelected : ''}`}
          onClick={() => setFilter('resolved')}
        >
          <CheckCircleIcon className={`${styles.filterIcon} ${styles.filterIconOk}`} aria-hidden />
          <span>
            Исправлено ({countResolved})
          </span>
        </button>
      </div>
      <ul className={styles.list}>
        {visibleViolations.map((v) => (
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
                  Ответственный: <span className={styles.metaValue}>{v.responsible}</span>
                </p>
                {v.status === 'active' ? (
                  <p className={styles.meta}>
                    Ожидаемая дата исправления:{' '}
                    <span className={styles.metaValue}>{v.dateText}</span>
                  </p>
                ) : (
                  <p className={styles.metaFixed}>
                    Исправлено: <span className={styles.metaFixedValue}>{v.dateText}</span>
                  </p>
                )}
                <div className={styles.photos} aria-label="Фотографии">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className={styles.photoPlaceholder}>
                      фото
                    </div>
                  ))}
                </div>
              </div>
            </Link>
            <button className={styles.chatBtn} type="button">
              {v.chatLabel}
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
  )
}

export default Problems
