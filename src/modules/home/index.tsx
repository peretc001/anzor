'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Button, Input } from 'antd'
import cns from 'classnames'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

import styles from './index.module.scss'

const ADD_BUTTON_LABEL = '+ добавить'

type SectionData = {
  archive: string[]
  date: string
  items: string[]
  progress: number
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
  const [itemsFilter, setItemsFilter] = useState('')
  const section = SECTIONS[activeIndex]

  useEffect(() => {
    setItemsFilter('')
  }, [activeIndex])

  const { filteredItems, filteredArchive } = useMemo(() => {
    const q = itemsFilter.trim().toLowerCase()
    if (!q) {
      return {
        filteredItems: section.items,
        filteredArchive: section.archive
      }
    }
    const match = (label: string) => label.toLowerCase().includes(q)
    return {
      filteredItems: section.items.filter(match),
      filteredArchive: section.archive.filter(match)
    }
  }, [itemsFilter, section.archive, section.items])

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
        <div className={styles.wrapper}>
          <div className={styles.addWrap}>
            <Button color="primary" variant="solid">
              {ADD_BUTTON_LABEL}
            </Button>
          </div>
          <Input
            allowClear
            aria-label="Фильтр по названию"
            className={styles.itemsFilter}
            placeholder="Фильтр по названию"
            prefix={<MagnifyingGlassIcon aria-hidden className={styles.filterIcon} />}
            value={itemsFilter}
            onChange={e => setItemsFilter(e.target.value)}
          />
        </div>

        <h3 className={styles.caption}>Действующие</h3>

        <ul className={styles.list}>
          {filteredItems.map(label => (
            <li key={label}>
              <Link className={styles.itemRow} href="/pro/project">
                <div className={styles.item}>
                  {label}
                  <span className={styles.date}>{section.date}</span>
                </div>

                <div
                  className={styles.progress}
                  style={{ width: `${section.progress}%` }}
                />
              </Link>
            </li>
          ))}
        </ul>

        <h3 className={styles.caption}>Архив</h3>

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

export default Index
