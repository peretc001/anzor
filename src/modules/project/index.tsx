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

import ContactProfileModal from '@/shared/components/contactProfileModal/contactProfileModal'

import { PROJECT_CONTACT, type ProjectContactRole } from '@/constants/projectContact'

import styles from './index.module.scss'

import 'dayjs/locale/ru'

dayjs.locale('ru')

const ADD_BUTTON_LABEL = '+ добавить'
const HEADER_OBJECT_TITLE = 'Квартира ЖК Самолет'
const INFO_EXECUTOR_LABEL = 'Исполнитель:'
const INFO_CUSTOMER_LABEL = 'Заказчик:'
const INFO_DATE_LABEL = 'Дата начала работ:'
const INFO_DATE_VALUE = '01.02.2026'
const JOURNAL_TITLE_PREFIX = 'Журнал за'
const BTN_VIOLATIONS_ALL = 'Все нарушения (7 / 156 шт)'
const BTN_PHOTO_REPORT = 'Фотоотчет по объекту'
const BTN_DOCS = 'Документы (договор, план)'

function formatViolationsCount(count: number): string {
  const n = Math.abs(count) % 100
  const n1 = n % 10
  if (n > 10 && n < 20) return `${count} нарушений`
  if (n1 === 1) return `${count} нарушение`
  if (n1 >= 2 && n1 <= 4) return `${count} нарушения`
  return `${count} нарушений`
}

type JournalEntry = {
  dateLabel: string
  hasAlert: boolean
  link: string
  violationsCount: number
}

const JOURNAL_ITEMS: JournalEntry[] = [
  { dateLabel: '12.04.2026', hasAlert: true, link: '/pro/project/journal', violationsCount: 7 },
  {
    dateLabel: '15.03.2026',
    hasAlert: false,
    link: '/pro/project/journalDone',
    violationsCount: 0,
  },
  { dateLabel: '11.02.2026', hasAlert: false, link: '/pro/project/journalDone', violationsCount: 2 },
]

const Project = () => {
  const [journalMonth, setJournalMonth] = useState<Dayjs | null>(dayjs())
  const [contactModal, setContactModal] = useState<ProjectContactRole | null>(null)

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Link className={styles.back} href="/pro">
          <ChevronLeftIcon className={styles.icon} />
        </Link>
        <div className={styles.item}>{HEADER_OBJECT_TITLE}</div>
      </div>

      <div className={styles.container}>
        <div className={styles.info}>
          <div className={styles.item}>
            <span>{INFO_EXECUTOR_LABEL}</span>
            <button
              className={styles.valueBtn}
              type="button"
              onClick={() => {
                setContactModal('executor')
              }}
            >
              {PROJECT_CONTACT.executor.name}
            </button>
          </div>
          <div className={styles.item}>
            <span>{INFO_CUSTOMER_LABEL}</span>
            <button
              className={styles.valueBtn}
              type="button"
              onClick={() => {
                setContactModal('customer')
              }}
            >
              {PROJECT_CONTACT.customer.name}
            </button>
          </div>
          <div className={styles.item}>
            <span>{INFO_DATE_LABEL}</span>
            <span className={styles.value}>{INFO_DATE_VALUE}</span>
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
                <Link className={styles.itemRow} href={entry.link}>
                  <div className={styles.item}>
                    <span className={styles.journalTitle}>
                      {JOURNAL_TITLE_PREFIX} {entry.dateLabel}
                    </span>
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
                {BTN_VIOLATIONS_ALL}
              </button>
            </Link>
            <Link href="/pro/project/gallery">
              <button className={`${styles.actionBtn} ${styles.actionBtnPhoto}`} type="button">
                {BTN_PHOTO_REPORT}
              </button>
            </Link>
            <button className={`${styles.actionBtn} ${styles.actionBtnDocs}`} type="button">
              {BTN_DOCS}
            </button>
          </div>
        </section>
      </div>

      <ContactProfileModal
        open={contactModal !== null}
        role={contactModal ?? 'customer'}
        onClose={() => {
          setContactModal(null)
        }}
      />
    </div>
  )
}

export default Project
