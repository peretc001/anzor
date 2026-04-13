'use client'

import React, { useState } from 'react'
import { Button, ConfigProvider, DatePicker } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import cns from 'classnames'
import dayjs, { type Dayjs } from 'dayjs'
import Link from 'next/link'

import {
  CheckCircleIcon,
  ChevronLeftIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

import styles from './index.module.scss'

import 'dayjs/locale/ru'

dayjs.locale('ru')

const ADD_BUTTON_LABEL = '+ добавить'

function formatViolationsCount(count: number): string {
  const n = Math.abs(count) % 100
  const n1 = n % 10
  if (n > 10 && n < 20) return `${count} нарушений`
  if (n1 === 1) return `${count} нарушение`
  if (n1 >= 2 && n1 <= 4) return `${count} нарушения`
  return `${count} нарушений`
}

type JournalEntry = {
  hasAlert: boolean
  dateLabel: string
  violationsCount: number
}

const JOURNAL_ITEMS: JournalEntry[] = [
  { hasAlert: true, dateLabel: '25.04.2026', violationsCount: 7 },
  { hasAlert: false, dateLabel: '25.03.2026', violationsCount: 0 },
  { hasAlert: false, dateLabel: '25.02.2026', violationsCount: 2 }
]

const Project = () => {
  const [journalMonth, setJournalMonth] = useState<Dayjs | null>(dayjs())

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Link className={styles.back} href="/pro">
          <ChevronLeftIcon className={styles.icon} />
        </Link>
        <div className={styles.item}>Квартира ЖК Самолет</div>
      </div>

      <div className={styles.container}>
        <div className={styles.info}>
          <div className={styles.item}>
            <span>Исполнитель:</span>
            <span className={styles.value}>ООО "Строительная компания"</span>
          </div>
          <div className={styles.item}>
            <span>Заказчик:</span>
            <span className={styles.value}>Иванов Иван</span>
          </div>
          <div className={styles.item}>
            <span>Дата:</span>
            <span className={styles.value}>01.04.2026</span>
          </div>
        </div>

        <section className={styles.section} aria-labelledby="journal-heading">
          <div className={styles.wrapper}>
            <div className={styles.addWrap}>
              <Button block color="primary" variant="solid">
                {ADD_BUTTON_LABEL}
              </Button>
            </div>

            <ConfigProvider locale={ruRU}>
              <DatePicker
                className={styles.calendarPicker}
                allowClear={false}
                format="MMMM YYYY"
                getPopupContainer={() => document.body}
                inputReadOnly
                picker="month"
                placeholder="Календарь (год, месяц)"
                value={journalMonth}
                onChange={setJournalMonth}
              />
            </ConfigProvider>
          </div>

          <ul className={styles.list}>
            {JOURNAL_ITEMS.map(entry => (
              <li key={entry.dateLabel}>
                <Link className={styles.itemRow} href="/pro/project/journal">
                  <div className={styles.item}>
                    <span className={styles.journalTitle}>Журнал за {entry.dateLabel}</span>
                    {entry.hasAlert ? (
                      <>
                        <span className={styles.violationsCaption}>
                          {formatViolationsCount(entry.violationsCount)}
                        </span>
                        <ExclamationCircleIcon className={cns(styles.icon, styles.warning)} />
                      </>
                    ) : (
                      <CheckCircleIcon className={cns(styles.icon, styles.success)} />
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <div className={styles.bottomStack}>
            <Link href="/pro/project/problems">
              <button className={`${styles.actionBtn} ${styles.actionBtnViolations}`} type="button">
                Все нарушения (7 / 156 шт)
              </button>
            </Link>
            <button className={`${styles.actionBtn} ${styles.actionBtnPhoto}`} type="button">
              Фотоотчет по объекту
            </button>
            <button className={`${styles.actionBtn} ${styles.actionBtnDocs}`} type="button">
              Документы (договор, план)
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Project
