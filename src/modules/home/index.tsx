'use client'

import React, { useState } from 'react'
import { Button } from 'antd'
import cns from 'classnames'
import Link from 'next/link'

import styles from './index.module.scss'

const ADD_BUTTON_LABEL = '+ добавить'

type SectionData = {
  archive: string[]
  items: string[]
  tabLabel: string
  title: string
}

const SECTIONS: SectionData[] = [
  {
    archive: ['Квартира на Московской', 'Квартира в Питере', 'Дом у моря'],
    date: 'от 01.04.2026',
    items: ['Квартира ЖК Самолет', 'Квартира ЖК Патрики', 'Дом в Елизаветке'],
    progress: 30,
    tabLabel: 'Объекты',
    title: 'Объекты'
  },
  {
    archive: ['ООО «ЮгСтройИнвест»', 'ИП Иванов', 'ИП Петров'],
    date: 'от 11.03.2026',
    items: ['ООО «Строительная компания»'],
    progress: 50,
    tabLabel: 'Исполнители',
    title: 'Исполнители'
  },
  {
    archive: ['Петров Петр Петрович', 'Сидоров Сидр Сидорович', 'Маск Илон Заремович'],
    date: 'от 01.02.2026',
    items: ['Иванов Иван Иванович'],
    progress: 45,
    tabLabel: 'Заказчики',
    title: 'Заказчики'
  }
]

const Index = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const section = SECTIONS[activeIndex]

  return (
    <div className={styles.root}>
      <div className={styles.tabs} aria-label="Разделы" role="tablist">
        {SECTIONS.map((s, index) => {
          const selected = index === activeIndex

          return (
            <button
              key={s.tabLabel}
              className={`${styles.tab} ${selected ? styles.tabActive : ''}`}
              aria-selected={selected}
              role="tab"
              type="button"
              onClick={() => {
                setActiveIndex(index)
              }}
            >
              {s.tabLabel}
            </button>
          )
        })}
      </div>

      <section
        className={styles.section}
        aria-labelledby={`panel-title-${activeIndex}`}
        role="tabpanel"
      >
        <Button color="primary" variant="solid">
          {ADD_BUTTON_LABEL}
        </Button>

        <h3 className={styles.caption}>Действующие</h3>

        <ul className={styles.list}>
          {section.items.map((label, index) => (
            <li key={label}>
              <Link className={styles.itemRow} href="/pro/project">
                <div className={styles.item}>
                  {label}
                  <span className={styles.date}>{SECTIONS[index].date}</span>
                </div>

                <div
                  className={styles.progress}
                  style={{ width: SECTIONS[index].progress + '%' }}
                />
              </Link>
            </li>
          ))}
        </ul>

        <h3 className={styles.caption}>Архив</h3>

        <ul className={cns(styles.list, styles.archive)}>
          {section.archive.map(label => (
            <li key={label}>
              <div className={styles.itemRow}>
                <div className={styles.item}>{label}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default Index
