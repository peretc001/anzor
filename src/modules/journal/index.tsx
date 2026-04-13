'use client'

import React, { useEffect, useState } from 'react'
import { Button } from 'antd'
import Link from 'next/link'

import { ChevronLeftIcon } from '@heroicons/react/24/outline'

import ContactProfileModal from '@/shared/components/contactProfileModal/contactProfileModal'

import type { ProjectContactRole } from '@/constants/projectContact'

import styles from './index.module.scss'

import 'dayjs/locale/ru'

const HEADER_TITLE = 'Журнал авторского надзора от 12.04.2026'
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
const SIG_NOT_SIGNED = 'Не подписано'
const SIG_CUSTOMER_SIGNED = 'УКЭП #45234788 от 11.04.2026'
const BTN_SEND_SIGN = 'Отправить на подпись'
const BTN_AWAITING_SIGNATURES = 'Ожидается подписание'
const SIGN_SEND_COOLDOWN_SEC = 59
const BTN_VIOLATIONS = 'Нарушения (7 / 13 шт)'
const BTN_PHOTO = 'Фотоотчет'

const Journal = () => {
  const [contactModal, setContactModal] = useState<ProjectContactRole | null>(null)
  const [signCooldownLeft, setSignCooldownLeft] = useState<number | null>(null)

  const isSignCooldown = signCooldownLeft !== null

  useEffect(() => {
    if (!isSignCooldown) return
    const id = window.setInterval(() => {
      setSignCooldownLeft((prev) => {
        if (prev === null || prev <= 1) return null
        return prev - 1
      })
    }, 1000)
    return () => {
      window.clearInterval(id)
    }
  }, [isSignCooldown])

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
              <img alt="" src="/journal.png" />

              <div className={styles.documentActions}>
                <button className={styles.documentBtn} type="button">
                  {BTN_VIEW}
                </button>
                <button className={styles.documentBtn} type="button">
                  {BTN_PRINT}
                </button>
              </div>
            </div>

            <div className={styles.signatures}>
              <h3 className={styles.signaturesTitle}>{SIGNATURES_TITLE}</h3>
              <ul className={styles.signatureList}>
                <li className={`${styles.signatureRow} ${styles.signatureRowWarn}`}>
                  <span className={styles.signatureLabel}>{SIG_EXECUTOR}</span>
                  <span className={styles.signatureStatus}>{SIG_NOT_SIGNED}</span>
                </li>
                <li className={`${styles.signatureRow} ${styles.signatureRowWarn}`}>
                  <span className={styles.signatureLabel}>{SIG_CUSTOMER}</span>
                  <span className={styles.signatureStatus}>{SIG_NOT_SIGNED}</span>
                </li>
                <li className={`${styles.signatureRow} ${styles.signatureRowWarn}`}>
                  <span className={styles.signatureLabel}>{SIG_DESIGNER}</span>
                  <span className={styles.signatureStatus}>{SIG_NOT_SIGNED}</span>
                </li>
              </ul>
              <div className={styles.sendRow}>
                <div className={styles.sendCol}>
                  <Button
                    disabled={isSignCooldown}
                    type="primary"
                    onClick={() => {
                      setSignCooldownLeft(SIGN_SEND_COOLDOWN_SEC)
                    }}
                  >
                    {isSignCooldown ? BTN_AWAITING_SIGNATURES : BTN_SEND_SIGN}
                  </Button>
                  {signCooldownLeft !== null ? (
                    <span className={styles.sendCountdown} aria-live="polite">
                      {`Отправить заново через 00:${String(signCooldownLeft).padStart(2, '0')}`}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.bottomStack}>
            <Link href="/pro/project/problems">
              <button className={`${styles.actionBtn} ${styles.actionBtnViolations}`} type="button">
                {BTN_VIOLATIONS}
              </button>
            </Link>
            <Link href="/pro/project/gallery?date=2026-04">
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
    </div>
  )
}

export default Journal
