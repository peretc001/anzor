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

type JournalEntry = {
  hasAlert: boolean
  dateLabel: string
}

const JOURNAL_ITEMS: JournalEntry[] = [
  { hasAlert: true, dateLabel: '25.04.2026' },
  { hasAlert: false, dateLabel: '25.03.2026' },
  { hasAlert: false, dateLabel: '25.02.2026' }
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

          <div className={styles.addWrap}>
            <Button block color="primary" variant="solid">
              {ADD_BUTTON_LABEL}
            </Button>
          </div>

          <ul className={styles.list}>
            {JOURNAL_ITEMS.map(entry => (
              <li key={entry.dateLabel}>
                <Link className={styles.itemRow} href="/pro/project/journal">
                  <div className={styles.item}>
                    Журнал за {entry.dateLabel}
                    {entry.hasAlert ? (
                      <ExclamationCircleIcon className={cns(styles.icon, styles.warning)} />
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
