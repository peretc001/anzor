'use client'

import React, { useCallback, useState } from 'react'
import { Modal } from 'antd'

import styles from './beta.module.scss'

const Beta = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const hideShow = () => {
    setIsModalOpen(true)
  }

  const hideModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  return (
    <>
      <div className={styles.root}>
        <div className={styles.wrapper} onClick={hideShow}>
          <div className={styles.beta}>beta</div>
          <div className={styles.text}>Сервис находится в стадии разработки. Подробнее</div>
        </div>
      </div>

      <Modal
        className={styles.modal}
        footer={null}
        open={isModalOpen}
        width="450px"
        onCancel={hideModal}
      >
        <div className={styles.description}>
          <p>🚀 Сервис в стадии активной разработки.</p>
          <p>Но Вы уже можете добавить свой профиль.</p>
          <p>Если у вас есть вопросы или идеи, пишите:</p>

          <a
            className={styles.contact}
            href="https://t.me/planirovochka_io"
            rel="noreferrer"
            target="_blank"
          >
            <img alt="" src="/icons/socials/telegram.svg" />
            Написать в ТГ
          </a>

          <a
            className={styles.contact}
            href="https://max.ru/u/f9LHodD0cOL4b1mEHv1WgU1vavXAfY2QK002Qrgd0YcCdO0PRgHaGArPhjw"
            rel="noreferrer"
            target="_blank"
          >
            <img alt="" src="/icons/socials/max.svg" />
            Написать в Мах
          </a>
        </div>
      </Modal>
    </>
  )
}

export default Beta
