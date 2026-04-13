'use client'

import React, { useState } from 'react'
import { Button } from 'antd'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import { ChevronLeftIcon } from '@heroicons/react/24/outline'

import ContactProfileModal from '@/shared/components/contactProfileModal/contactProfileModal'

import type { ProjectContactRole } from '@/constants/projectContact'

import styles from './index.module.scss'

import 'dayjs/locale/ru'

const JournalTitlePdfModal = dynamic(() => import('../journal/JournalTitlePdfModal'), {
  ssr: false
})

const HEADER_TITLE = 'Журнал авторского надзора от 15.03.2026'
const INFO_PROJECT_LABEL = 'Объект:'
const INFO_PROJECT_VALUE = 'Квартира ЖК Самолет'
const INFO_EXECUTOR_LABEL = 'Исполнитель:'
const INFO_EXECUTOR_VALUE = 'ООО «Строительная компания»'
const INFO_CUSTOMER_LABEL = 'Заказчик:'
const INFO_CUSTOMER_VALUE = 'Иванов Иван'
const BTN_VIEW = 'Просмотр'
const BTN_PRINT = 'Печать'
const SIGNATURES_TITLE = 'Подписи'
const SIG_EXECUTOR = 'Исполнитель'
const SIG_CUSTOMER = 'Заказчик'
const SIG_DESIGNER = 'Дизайнер'
const SIG_EXECUTOR_SIGNED = 'УКЭП #45234388 от 11.04.2026'
const SIG_CUSTOMER_SIGNED = 'УКЭП #45234758 от 12.04.2026'
const SIG_DESIGNER_SIGNED = 'УКЭП #45234749 от 13.04.2026'
const BTN_VIOLATIONS = 'Нет нарушений'
const BTN_PHOTO = 'Фотоотчет'

const JournalDone = () => {
  const [contactModal, setContactModal] = useState<ProjectContactRole | null>(null)
  const [titlePdfOpen, setTitlePdfOpen] = useState(false)

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Link className={styles.back} href="/pro/project">
          <ChevronLeftIcon className={styles.icon} />
        </Link>
        <div className={styles.item}>{HEADER_TITLE}</div>
      </div>

      <div className={styles.container}>
        <div className={styles.info}>
          <div className={styles.item}>
            <span>{INFO_PROJECT_LABEL}</span>
            <span className={styles.value}>{INFO_PROJECT_VALUE}</span>
          </div>
          <div className={styles.item}>
            <span>{INFO_EXECUTOR_LABEL}</span>
            <button
              className={styles.valueBtn}
              type="button"
              onClick={() => {
                setContactModal('executor')
              }}
            >
              {INFO_EXECUTOR_VALUE}
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
              {INFO_CUSTOMER_VALUE}
            </button>
          </div>
        </div>

        <section className={styles.section} aria-labelledby="journal-heading">
          <div className={styles.documentRow}>
            <div className={styles.documentCard}>
              <button
                className={styles.documentPreview}
                type="button"
                onClick={() => {
                  setTitlePdfOpen(true)
                }}
              >
                <img alt="Титульный лист журнала" src="/journal.png" />
              </button>

              <div className={styles.documentActions}>
                <button
                  className={styles.documentBtn}
                  type="button"
                  onClick={() => {
                    setTitlePdfOpen(true)
                  }}
                >
                  {BTN_VIEW}
                </button>
              </div>
            </div>

            <div className={styles.signatures}>
              <h3 className={styles.signaturesTitle}>{SIGNATURES_TITLE}</h3>
              <ul className={styles.signatureList}>
                <li className={`${styles.signatureRow} ${styles.signatureRowOk}`}>
                  <span className={styles.signatureLabel}>{SIG_EXECUTOR}</span>
                  <span className={styles.signatureStatus}>{SIG_EXECUTOR_SIGNED}</span>
                </li>
                <li className={`${styles.signatureRow} ${styles.signatureRowOk}`}>
                  <span className={styles.signatureLabel}>{SIG_CUSTOMER}</span>
                  <span className={styles.signatureStatus}>{SIG_CUSTOMER_SIGNED}</span>
                </li>
                <li className={`${styles.signatureRow} ${styles.signatureRowOk}`}>
                  <span className={styles.signatureLabel}>{SIG_DESIGNER}</span>
                  <span className={styles.signatureStatus}>{SIG_DESIGNER_SIGNED}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.bottomStack}>
            <Link href="/pro/project/problems#done">
              <button className={`${styles.actionBtn} ${styles.actionBtnViolations}`} type="button">
                {BTN_VIOLATIONS}
              </button>
            </Link>
            <Link href="/pro/project/gallery?date=2026-03">
              <button className={`${styles.actionBtn} ${styles.actionBtnPhoto}`} type="button">
                {BTN_PHOTO}
              </button>
            </Link>
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

      <JournalTitlePdfModal
        isSigned
        open={titlePdfOpen}
        onClose={() => {
          setTitlePdfOpen(false)
        }}
      />
    </div>
  )
}

export default JournalDone
