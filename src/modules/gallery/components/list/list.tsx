'use client'

import React, { type FC, useMemo, useState } from 'react'
import { message } from 'antd'
import { useRouter } from 'next/navigation'

import { useQueryClient } from '@tanstack/react-query'

import type { IGallery } from '@/shared/interfaces'

import useFancybox from '@/lib/useFancybox'

import Card from '@/modules/gallery/components/card/card'

import styles from './list.module.scss'

import { deleteGalleryApi } from '../../api/deleteGalleryApi'

const LABEL_REPORT = 'Фотоотчет'

const LABEL_TASKS = 'Фото по задачам'

const LABEL_UNDATED = 'Без даты'

type SourceSubgroup = {
  readonly key: 'report' | 'tasks'
  readonly items: IGallery[]
  readonly label: string
}

type WeekGroup = {
  readonly label: string
  readonly subgroups: SourceSubgroup[]
  readonly weekKey: number
}

function hasGalleryTaskId(item: IGallery): boolean {
  const id = item.task_id
  return typeof id === 'number' && Number.isInteger(id) && id > 0
}

function splitWeekBySource(items: IGallery[]): SourceSubgroup[] {
  const fromTasks = items.filter(hasGalleryTaskId)
  const report = items.filter(i => !hasGalleryTaskId(i))
  const subgroups: SourceSubgroup[] = []
  if (fromTasks.length > 0) {
    subgroups.push({ key: 'tasks', items: fromTasks, label: LABEL_TASKS })
  }
  if (report.length > 0) {
    subgroups.push({ key: 'report', items: report, label: LABEL_REPORT })
  }
  return subgroups
}

export type GalleryListProps = {
  readonly gallery: IGallery[]
  readonly projectId: number
}

function startOfWeekMondayLocal(d: Date): Date {
  const c = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const day = c.getDay()
  const offset = day === 0 ? -6 : 1 - day
  c.setDate(c.getDate() + offset)
  c.setHours(0, 0, 0, 0)
  return c
}

function endOfWeekSundayLocal(weekStart: Date): Date {
  const e = new Date(weekStart)
  e.setDate(e.getDate() + 6)
  e.setHours(23, 59, 59, 999)
  return e
}

function formatWeekLabelRu(weekStart: Date, weekEnd: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
  const formatter = new Intl.DateTimeFormat('ru-RU', options)
  const withRange = formatter as {
    formatRange?(a: Date, b: Date): string
  } & Intl.DateTimeFormat
  if (typeof withRange.formatRange === 'function') {
    return withRange.formatRange(weekStart, weekEnd)
  }
  const dayMonth = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' })
  const yearFmt = new Intl.DateTimeFormat('ru-RU', { year: 'numeric' })
  return `${dayMonth.format(weekStart)} — ${dayMonth.format(weekEnd)} ${yearFmt.format(weekEnd)}`
}

function groupGalleryByWeek(items: IGallery[]): WeekGroup[] {
  const undated: IGallery[] = []
  const bucket = new Map<number, IGallery[]>()

  for (const item of items) {
    const raw = item.created_at
    if (!raw) {
      undated.push(item)
      continue
    }
    const parsed = new Date(raw)
    if (Number.isNaN(parsed.getTime())) {
      undated.push(item)
      continue
    }
    const weekStart = startOfWeekMondayLocal(parsed)
    const key = weekStart.getTime()
    const list = bucket.get(key) ?? []
    list.push(item)
    bucket.set(key, list)
  }

  const sortByCreatedDesc = (a: IGallery, b: IGallery) => {
    const ta = a.created_at ? new Date(a.created_at).getTime() : 0
    const tb = b.created_at ? new Date(b.created_at).getTime() : 0
    return tb - ta
  }

  const groups: WeekGroup[] = [...bucket.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([weekKey, groupItems]) => {
      const sorted = [...groupItems].sort(sortByCreatedDesc)
      const ws = new Date(weekKey)
      const we = endOfWeekSundayLocal(ws)
      return {
        label: formatWeekLabelRu(ws, we),
        subgroups: splitWeekBySource(sorted),
        weekKey
      }
    })

  if (undated.length > 0) {
    const sortedUndated = [...undated].sort(sortByCreatedDesc)
    groups.push({
      label: LABEL_UNDATED,
      subgroups: splitWeekBySource(sortedUndated),
      weekKey: Number.NEGATIVE_INFINITY
    })
  }

  return groups
}

const List: FC<GalleryListProps> = ({ gallery, projectId }) => {
  const fancyboxGroup = `gallery-${projectId}`
  const [setFancyboxRoot] = useFancybox()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [deletingId, setDeletingId] = useState<null | number>(null)
  const galleryByWeek = useMemo(() => groupGalleryByWeek(gallery), [gallery])

  const handleDeletePhoto = async (id: number) => {
    try {
      setDeletingId(id)
      await deleteGalleryApi(id)
      await queryClient.invalidateQueries({ queryKey: ['gallery', projectId] })
      await queryClient.invalidateQueries({ queryKey: ['tasks', projectId] })
      router.refresh()
      message.success('Фото удалено')
    } catch {
      message.error('Не удалось удалить фото')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div ref={setFancyboxRoot} className={styles.feed}>
      {galleryByWeek.map(section => (
        <section key={section.weekKey} className={styles.week}>
          <h3 className={styles.weekTitle}>{section.label}</h3>
          <div className={styles.subgroups}>
            {section.subgroups.map(sub => (
              <div key={`${section.weekKey}-${sub.key}`} className={styles.subgroup}>
                <h4 className={styles.subgroupTitle}>{sub.label}</h4>
                <div className={styles.list}>
                  {sub.items.map(item => (
                    <Card
                      key={item.id}
                      deletingId={deletingId}
                      fancyboxGroup={fancyboxGroup}
                      item={item}
                      onDelete={handleDeletePhoto}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default List
