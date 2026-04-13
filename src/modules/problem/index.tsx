'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ConfigProvider, DatePicker, Select } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import cns from 'classnames'
import dayjs, { type Dayjs } from 'dayjs'
import Link from 'next/link'

import { ChevronLeftIcon, PlusIcon } from '@heroicons/react/24/outline'

import '@fancyapps/ui/dist/fancybox/fancybox.css'
import styles from './index.module.scss'
import listStyles from '@/modules/problems/index.module.scss'

import 'dayjs/locale/ru'
import { Fancybox } from '@fancyapps/ui'

dayjs.locale('ru')

const HEADER_TITLE = 'Нарушения'
const COUNTER_SEP = ' / '
const VIOLATION_TITLE = 'Кривая стена в зоне фартука кухни'
const RESPONSIBLE_CUSTOMER = 'Заказчик'
const RESPONSIBLE_DESIGNER = 'Дизайнер'
const RESPONSIBLE_EXECUTOR = 'Исполнитель'
const META_RESPONSIBLE_LABEL = 'Ответственный:'
const META_DATE_LABEL = 'Ожидаемая дата исправления:'
const PHOTO_ADD_LABEL = 'Добавить фото'
const INPUT_PLACEHOLDER = 'Написать сообщение'
const INPUT_ARIA = 'Написать сообщение'
const BTN_SEND = 'Отправить'
const BTN_MARK_FIXED = 'Отметить как исправлено'

const VIOLATION_PHOTO_URLS = [
  'https://i.pinimg.com/736x/59/ce/c7/59cec73bb09298a578a5dcff09ee89f6.jpg',
  'https://avatars.mds.yandex.net/get-ydo/3918388/2a0000019170b9265111157c9b35cbd3876b/diploma',
  'https://i.sstatic.net/cuHl5l.jpg',
] as const

const FANCYBOX_GROUP = 'violation-photos'
const FANCYBOX_SELECTOR = `[data-fancybox="${FANCYBOX_GROUP}"]`

type ChatRole = 'designer' | 'executor'

type ChatMessage = {
  id: string
  name: string
  role: ChatRole
  text: string
  time: string
}

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    name: 'Исполнитель',
    role: 'executor',
    text: 'Добрый день, да есть такое, исправим',
    time: '23.04.2025 в 11:32'
  },
  {
    id: '2',
    name: 'Дизайнер',
    role: 'designer',
    text: 'Подскажите ориентировочную дату',
    time: '23.04.2025 в 14:05'
  },
  {
    id: '3',
    name: 'Исполнитель',
    role: 'executor',
    text: 'До конца недели сделаем',
    time: '23.04.2025 в 15:18'
  },
  {
    id: '4',
    name: 'Дизайнер',
    role: 'designer',
    text: 'Ок, ждем до 30.04.2026',
    time: '23.04.2025 в 15:22'
  }
]

const VIOLATIONS_TOTAL = 13
const VIOLATIONS_ACTIVE = 7

const DATE_IN_MESSAGE_RE = /\d{2}\.\d{2}\.\d{4}/g

const BTN_SET_CORRECTION_DATE = 'Установить как ожидаемую дату исправления'

const RESPONSIBLE_OPTIONS = [
  { label: RESPONSIBLE_EXECUTOR, value: RESPONSIBLE_EXECUTOR },
  { label: RESPONSIBLE_DESIGNER, value: RESPONSIBLE_DESIGNER },
  { label: RESPONSIBLE_CUSTOMER, value: RESPONSIBLE_CUSTOMER }
]

const parseRuDottedDate = (value: string): Dayjs | null => {
  const segments = value.split('.')
  if (segments.length !== 3) return null
  const day = Number.parseInt(segments[0], 10)
  const month = Number.parseInt(segments[1], 10)
  const year = Number.parseInt(segments[2], 10)
  if (
    Number.isNaN(day) ||
    Number.isNaN(month) ||
    Number.isNaN(year) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null
  }
  const d = dayjs(new Date(year, month - 1, day))
  return d.isValid() ? d : null
}

type TextPart = { id: string; type: 'date' | 'text'; value: string }

const splitTextWithDates = (messageId: string, text: string): TextPart[] => {
  const parts: TextPart[] = []
  let last = 0
  let m: RegExpExecArray | null
  const re = new RegExp(DATE_IN_MESSAGE_RE.source, 'g')
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      parts.push({
        id: `${messageId}-text-${last}`,
        type: 'text',
        value: text.slice(last, m.index)
      })
    }
    parts.push({ id: `${messageId}-date-${m.index}`, type: 'date', value: m[0] })
    last = m.index + m[0].length
  }
  if (last < text.length) {
    parts.push({ id: `${messageId}-text-${last}`, type: 'text', value: text.slice(last) })
  }
  if (parts.length === 0) {
    parts.push({ id: `${messageId}-text-0`, type: 'text', value: text })
  }
  return parts
}

const Problem = () => {
  const [draft, setDraft] = useState('')
  const [responsible, setResponsible] = useState(RESPONSIBLE_EXECUTOR)
  const [correctionDate, setCorrectionDate] = useState<Dayjs>(() => dayjs())
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES)
  const photosRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = photosRef.current
    if (!root) return

    Fancybox.bind(root, FANCYBOX_SELECTOR, {
      Carousel: {
        infinite: false,
      },
    })

    return () => {
      Fancybox.unbind(root, FANCYBOX_SELECTOR)
      Fancybox.close()
    }
  }, [])

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setMessages(prev => [
      ...prev,
      {
        id: String(Date.now()),
        name: 'Дизайнер',
        role: 'designer',
        text,
        time: new Intl.DateTimeFormat('ru-RU', {
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
          .format(new Date())
          .replace(',', ' в')
      }
    ])
    setDraft('')
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <Link className={styles.back} href="/pro/project/problems">
          <ChevronLeftIcon className={styles.icon} />
        </Link>
        <div className={styles.headerMain}>
          <h1 className={styles.title}>{HEADER_TITLE}</h1>
          <div
            className={styles.counter}
            aria-label={`Активных нарушений: ${VIOLATIONS_ACTIVE} из ${VIOLATIONS_TOTAL}`}
          >
            <span className={styles.counterActive}>{VIOLATIONS_ACTIVE}</span>
            <span className={styles.counterRest}>
              {COUNTER_SEP}
              {VIOLATIONS_TOTAL}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.violationBlock}>
          <div className={listStyles.card}>
            <div className={listStyles.cardLink}>
              <div className={listStyles.statusRingActive} aria-hidden />
              <div className={listStyles.cardBody}>
                <p className={listStyles.cardTitleActive} title={VIOLATION_TITLE}>
                  {VIOLATION_TITLE}
                </p>
                <ConfigProvider locale={ruRU}>
                  <div className={`${listStyles.meta} ${styles.metaRow}`}>
                    <span className={styles.metaLabel}>{META_RESPONSIBLE_LABEL}</span>
                    <Select
                      className={styles.responsibleSelect}
                      aria-label={META_RESPONSIBLE_LABEL}
                      getPopupContainer={n => n.parentElement ?? document.body}
                      options={RESPONSIBLE_OPTIONS}
                      size="small"
                      value={responsible}
                      variant="borderless"
                      onChange={setResponsible}
                    />
                  </div>
                  <div className={`${listStyles.meta} ${styles.metaRow}`}>
                    <span className={styles.metaLabel}>{META_DATE_LABEL}</span>
                    <DatePicker
                      className={styles.correctionDatePicker}
                      allowClear={false}
                      aria-label={META_DATE_LABEL}
                      format="DD.MM.YYYY"
                      getPopupContainer={() => document.body}
                      inputReadOnly
                      size="small"
                      value={correctionDate}
                      variant="borderless"
                      onChange={d => {
                        if (d) setCorrectionDate(d)
                      }}
                    />
                  </div>
                </ConfigProvider>
                <div ref={photosRef} className={listStyles.photos} aria-label="Фотографии">
                  {VIOLATION_PHOTO_URLS.map(src => (
                    <a
                      key={src}
                      className={cns(listStyles.photoPlaceholder, styles.photoFancyLink)}
                      aria-label={`Открыть фото: ${VIOLATION_TITLE}`}
                      data-caption={VIOLATION_TITLE}
                      data-fancybox={FANCYBOX_GROUP}
                      href={src}
                      rel="noreferrer"
                    >
                      <img
                        className={styles.photoFancyImg}
                        alt=""
                        decoding="async"
                        loading="lazy"
                        src={src}
                      />
                    </a>
                  ))}
                  <div
                    className={cns(listStyles.photoPlaceholder, styles.photoUploadStub)}
                    aria-label={PHOTO_ADD_LABEL}
                  >
                    <PlusIcon className={styles.photoUploadIcon} aria-hidden />
                    <span className={styles.photoUploadText} aria-hidden>
                      {PHOTO_ADD_LABEL}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button className={styles.markFixedBtn} type="button">
              {BTN_MARK_FIXED}
            </button>
          </div>
        </div>

        <div className={styles.chatLayout}>
          <div className={styles.history} aria-live="polite" aria-relevant="additions" role="log">
            <div className={styles.messages}>
              {messages.map(m => (
                <article
                  key={m.id}
                  className={
                    m.role === 'designer' ? styles.messageOutgoing : styles.messageIncoming
                  }
                >
                  <div className={styles.messageBlock}>
                    <header className={styles.msgHeader}>
                      <span
                        className={`${styles.avatar} ${
                          m.role === 'designer' ? styles.avatarDesigner : styles.avatarExecutor
                        }`}
                        aria-hidden
                      >
                        {m.name.slice(0, 1)}
                      </span>
                      <span className={styles.msgName}>{m.name}</span>
                      <time className={styles.msgTime} dateTime={m.time}>
                        {m.time}
                      </time>
                    </header>
                    <p className={styles.bubble}>
                      {splitTextWithDates(m.id, m.text).map(part =>
                        part.type === 'date' ? (
                          <button
                            key={part.id}
                            className={styles.messageDateBtn}
                            aria-label={`${BTN_SET_CORRECTION_DATE}: ${part.value}`}
                            type="button"
                            onClick={() => {
                              const next = parseRuDottedDate(part.value)
                              if (next) setCorrectionDate(next)
                            }}
                          >
                            {part.value}
                          </button>
                        ) : (
                          <React.Fragment key={part.id}>{part.value}</React.Fragment>
                        )
                      )}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className={styles.composer}>
            <input
              className={styles.input}
              aria-label={INPUT_ARIA}
              placeholder={INPUT_PLACEHOLDER}
              type="text"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
            />
            <button className={styles.sendBtn} type="button" onClick={send}>
              {BTN_SEND}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Problem
