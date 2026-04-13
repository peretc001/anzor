'use client'

import React from 'react'
import { Modal } from 'antd'

import { MapPinIcon, PhoneArrowUpRightIcon } from '@heroicons/react/24/outline'

import { PROJECT_CONTACT, type ProjectContactRole } from '@/constants/projectContact'

import styles from './contactProfileModal.module.scss'

type ContactProfileModalProps = {
  readonly open: boolean
  readonly role: ProjectContactRole
  readonly onClose: () => void
}

const LINK_LABEL_MAX = 'Max'
const LINK_LABEL_TELEGRAM = 'Telegram'

const ContactProfileModal = ({ open, role, onClose }: ContactProfileModalProps) => {
  const profile = role === 'executor' ? PROJECT_CONTACT.executor : PROJECT_CONTACT.customer
  const bio = role === 'executor' ? PROJECT_CONTACT.bioExecutor : PROJECT_CONTACT.bioCustomer

  return (
    <Modal
      className={styles.modalRoot}
      styles={{
        wrapper: {
          alignItems: 'flex-start',
          paddingTop: 100,
        },
      }}
      centered={false}
      footer={null}
      open={open}
      width={380}
      onCancel={onClose}
    >
      <div className={styles.card}>
        <div className={styles.avatar} aria-hidden>
          {profile.initials}
        </div>
        <div className={styles.body}>
          <h2 className={styles.name}>{profile.name}</h2>
          <p className={styles.subtitle}>{profile.subtitle}</p>
          <p className={styles.bio}>{bio}</p>

          <p className={styles.location}>
            <MapPinIcon className={styles.rowIcon} aria-hidden />
            <span>{PROJECT_CONTACT.address}</span>
          </p>

          <div className={styles.contacts}>
            <a className={styles.contactRow} href={PROJECT_CONTACT.phoneHref}>
              <PhoneArrowUpRightIcon className={styles.rowIcon} aria-hidden />
              <span>{PROJECT_CONTACT.phoneLabel}</span>
            </a>
            <a className={styles.contactRow} href={PROJECT_CONTACT.phoneHref}>
              <img alt="" src="/icons/socials/max.svg" />
              <span>{LINK_LABEL_MAX}</span>
            </a>
            <a className={styles.contactRow} href={PROJECT_CONTACT.phoneHref}>
              <img alt="" src="/icons/socials/telegram.svg" />
              <span>{LINK_LABEL_TELEGRAM}</span>
            </a>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ContactProfileModal
