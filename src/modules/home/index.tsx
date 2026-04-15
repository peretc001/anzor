'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Button, Input } from 'antd'
import cns from 'classnames'
import Link from 'next/link'

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

import styles from './index.module.scss'

const ADD_BUTTON_LABEL = '+ добавить'
const CAPTION_ACTIVE = 'Действующие'
const CAPTION_ARCHIVE = 'Архив'

type SectionItem = {
  date: string
  label: string
}

type SectionData = {
  archive: string[]
  items: SectionItem[]
  progress: number
  tabLabel: string
  title: string
}

const SECTIONS: SectionData[] = [
  {
    archive: ['Квартира на Московской', 'Квартира в Питере', 'Дом у моря'],
    items: [
      { date: 'от 01.04.2026', label: 'Квартира ЖК Самолет' },
      { date: 'от 18.03.2026', label: 'Квартира ЖК Патрики' },
      { date: 'от 05.02.2026', label: 'Дом в Елизаветке' }
    ],
    progress: 30,
    tabLabel: 'Объекты',
    title: 'Объекты'
  },
  {
    archive: ['ООО «ЮгСтройИнвест»', 'ИП Иванов', 'ИП Петров'],
    items: [{ date: 'от 11.03.2026', label: 'ООО «Строительная компания»' }],
    progress: 50,
    tabLabel: 'Исполнители',
    title: 'Исполнители'
  },
  {
    archive: ['Петров Петр Петрович', 'Сидоров Сидр Сидорович', 'Маск Илон Заремович'],
    items: [{ date: 'от 01.02.2026', label: 'Иванов Иван Иванович' }],
    progress: 45,
    tabLabel: 'Заказчики',
    title: 'Заказчики'
  }
]

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [itemsFilter, setItemsFilter] = useState('')
  const section = SECTIONS[activeIndex]

  useEffect(() => {
    setItemsFilter('')
  }, [activeIndex])

  const { filteredArchive, filteredItems } = useMemo(() => {
    const q = itemsFilter.trim().toLowerCase()
    if (!q) {
      return {
        filteredArchive: section.archive,
        filteredItems: section.items
      }
    }
    const matchLabel = (label: string) => label.toLowerCase().includes(q)
    return {
      filteredArchive: section.archive.filter(matchLabel),
      filteredItems: section.items.filter(item => matchLabel(item.label))
    }
  }, [itemsFilter, section.archive, section.items])

  return (
    <div className={styles.root}>
      <section
        className={styles.section}
        aria-labelledby={`panel-title-${activeIndex}`}
        role="tabpanel"
      >
        <div className={styles.wrapper}>
          <div className={styles.addWrap}>
            <Button color="primary" variant="solid">
              {ADD_BUTTON_LABEL}
            </Button>
          </div>
          <Input
            className={styles.itemsFilter}
            allowClear
            aria-label="Фильтр по названию"
            placeholder="Фильтр по названию"
            prefix={<MagnifyingGlassIcon className={styles.filterIcon} aria-hidden />}
            value={itemsFilter}
            onChange={e => setItemsFilter(e.target.value)}
          />
        </div>

        <h3 className={styles.caption}>{CAPTION_ACTIVE}</h3>

        <ul className={styles.list}>
          {filteredItems.map(item => (
            <li key={item.label}>
              <Link className={styles.itemRow} href="/pro/project">
                <div className={styles.item}>
                  {item.label}
                  <span className={styles.date}>{item.date}</span>
                </div>

                <div className={styles.progress} style={{ width: `${section.progress}%` }} />
              </Link>
            </li>
          ))}
        </ul>

        <h3 className={styles.caption}>{CAPTION_ARCHIVE}</h3>

        <ul className={cns(styles.list, styles.archive)}>
          {filteredArchive.map(label => (
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

export default Home
