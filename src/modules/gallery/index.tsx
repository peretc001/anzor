'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ConfigProvider, DatePicker } from 'antd'
import ruRU from 'antd/locale/ru_RU'
import dayjs, { type Dayjs } from 'dayjs'
import Link from 'next/link'

import { ChevronLeftIcon } from '@heroicons/react/24/outline'

import '@fancyapps/ui/dist/fancybox/fancybox.css'
import styles from './index.module.scss'

import 'dayjs/locale/ru'
import { Fancybox } from '@fancyapps/ui'

dayjs.locale('ru')

/** Внешние URL: глобальный loader в next.config ведёт все next/image через S3. */
const MONTH_LABEL: Record<string, string> = {
  '2026-01': 'Январь 2026',
  '2026-02': 'Февраль 2026',
  '2026-03': 'Март 2026',
  '2026-04': 'Апрель 2026',
}

/** От новых к старым (апрель — под ваши фото, пока пусто) */
const MONTH_ORDER = ['2026-04', '2026-03', '2026-02', '2026-01'] as const

type GalleryPhoto = {
  alt: string
  monthKey: string
  src: string
}

const INTERIOR_PHOTOS: GalleryPhoto[] = [
  // Январь — 7
  {
    alt: 'Интерьер в процессе ремонта',
    monthKey: '2026-01',
    src: 'https://avatars.mds.yandex.net/i?id=b8e0c8936f36a684c1c7f241dbae7959_l-9706270-images-thumbs&n=13'
  },
  {
    alt: 'Укладка керамической плитки',
    monthKey: '2026-01',
    src: 'https://img.freepik.com/premium-photo/industrial-worker-handyman-installing-ceramic-tiles_255667-54303.jpg?semt=ais_hybrid&w=740'
  },
  {
    alt: 'Ремонт помещения',
    monthKey: '2026-01',
    src: 'https://www.brickunderground.com/sites/default/files/blog/images/P1030582.JPG'
  },
  {
    alt: 'Подготовка стен, лестница и краска',
    monthKey: '2026-01',
    src: 'https://img.freepik.com/premium-photo/ladder-bucket-paint-old-building-apartment-renovation-after-moving-flattened-drywall-walls_157125-7096.jpg?semt=ais_hybrid&w=740'
  },
  {
    alt: 'Гостиная с радиатором: до и после ремонта',
    monthKey: '2026-01',
    src: 'https://media.istockphoto.com/id/1460997824/ru/%D1%84%D0%BE%D1%82%D0%BE/%D0%B3%D0%BE%D1%81%D1%82%D0%B8%D0%BD%D0%B0%D1%8F-%D1%81-%D1%80%D0%B0%D0%B4%D0%B8%D0%B0%D1%82%D0%BE%D1%80%D0%BE%D0%BC-%D0%BE%D1%82%D0%BE%D0%BF%D0%BB%D0%B5%D0%BD%D0%B8%D1%8F-%D0%B4%D0%BE-%D0%B8-%D0%BF%D0%BE%D1%81%D0%BB%D0%B5-%D1%80%D0%B5%D0%BC%D0%BE%D0%BD%D1%82%D0%B0.jpg?s=612x612&w=0&k=20&c=AtvhyYiZDWmGsqmsaRuvuv36Aq7sIATZeD-UN9a8AAw='
  },
  {
    alt: 'Спальня: сравнение до и после',
    monthKey: '2026-01',
    src: 'https://www.shutterstock.com/image-photo/comparison-apartment-bedroom-large-panoramic-260nw-2439782797.jpg'
  },
  {
    alt: 'Квартира до ремонта и в подготовке',
    monthKey: '2026-01',
    src: 'https://media.istockphoto.com/id/1306536775/ru/%D1%84%D0%BE%D1%82%D0%BE/%D1%81%D1%82%D0%B0%D1%80%D0%B0%D1%8F-%D0%BA%D0%B2%D0%B0%D1%80%D1%82%D0%B8%D1%80%D0%B0-%D0%BD%D0%B5%D0%B4%D0%B2%D0%B8%D0%B6%D0%B8%D0%BC%D0%BE%D1%81%D1%82%D0%B8-%D0%BF%D0%BE%D0%B4%D0%B3%D0%BE%D1%82%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%BD%D0%B0%D1%8F-%D0%B8-%D0%B3%D0%BE%D1%82%D0%BE%D0%B2%D0%B0%D1%8F-%D0%BA-%D1%80%D0%B5%D0%BC%D0%BE%D0%BD%D1%82%D1%83.jpg?s=170667a&w=0&k=20&c=REKQX0PMHhv9x7ciX9WnqxDIbSyRoAZJErMgYsNpdPA='
  },
  // Февраль — 8
  {
    alt: 'Коллаж квартиры до и после реставрации',
    monthKey: '2026-02',
    src: 'https://img.freepik.com/premium-photo/photo-collage-apartment-before-after-restoration_10069-12557.jpg?semt=ais_hybrid&w=740'
  },
  {
    alt: 'Ход отделочных работ',
    monthKey: '2026-02',
    src: 'https://vaex102.ru/wp-content/uploads/2023/12/img_20191204_203014-2048x1536.jpg.webp'
  },
  {
    alt: 'Ремонт стен и укладка ламината',
    monthKey: '2026-02',
    src: 'https://media.istockphoto.com/id/925488966/ru/%D1%84%D0%BE%D1%82%D0%BE/%D0%BA%D0%B2%D0%B0%D1%80%D1%82%D0%B8%D1%80%D0%B0-%D1%80%D0%B5%D0%BC%D0%BE%D0%BD%D1%82-%D1%81%D1%82%D0%B5%D0%BD%D1%8B-%D1%80%D0%B5%D0%BC%D0%BE%D0%BD%D1%82-%D0%B4%D0%BE%D0%BC%D0%B0-%D1%80%D0%B5%D0%BC%D0%BE%D0%BD%D1%82-%D0%B4%D0%BE%D0%BC%D0%B0-%D1%80%D0%B5%D0%BC%D0%BE%D0%B4%D0%B5%D0%BB%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F-%D0%BB%D0%B0%D0%BC%D0%B8%D0%BD%D0%B0%D1%82%D0%B0.jpg?s=612x612&w=0&k=20&c=7JBQbQ7UkfJf0oW_ifDrMf0e_SQLdq3B0Anz4nf2okY='
  },
  {
    alt: 'Ремонтные работы в квартире',
    monthKey: '2026-02',
    src: 'https://avatars.mds.yandex.net/i?id=ef6222bb4c408b50dcbc7cc0d99a704c_l-5177029-images-thumbs&n=13'
  },
  {
    alt: 'Документация по объекту',
    monthKey: '2026-02',
    src: 'https://avatars.mds.yandex.net/get-ydo/3904573/2a000001947b4c6a4eb19d171c5910b201c1/diploma'
  },
  {
    alt: 'Номер до и после ремонта',
    monthKey: '2026-02',
    src: 'https://media.istockphoto.com/id/1691820297/ru/%D1%84%D0%BE%D1%82%D0%BE/%D0%BD%D0%BE%D0%BC%D0%B5%D1%80-%D0%B4%D0%BE-%D0%B8-%D0%BF%D0%BE%D1%81%D0%BB%D0%B5-%D1%80%D0%B5%D0%BC%D0%BE%D0%BD%D1%82%D0%B0-%D0%B8%D0%BB%D0%B8-%D1%80%D0%B5%D0%BC%D0%BE%D0%BD%D1%82%D0%B0.jpg?s=170667a&w=0&k=20&c=Ej5Bcbrcr7W9_gkUf-7xhLYTJulrHwb25C2DebNWyxw='
  },
  {
    alt: 'Интерьер после ремонта',
    monthKey: '2026-02',
    src: 'https://i.pinimg.com/originals/d8/68/39/d868393f6af6777e0bbfb5ab14aa451c.jpg?nii=t'
  },
  {
    alt: 'Отделка помещения',
    monthKey: '2026-02',
    src: 'https://i.pinimg.com/736x/1a/a5/4d/1aa54de8a6e32708722bb50bf5eb088c.jpg'
  },
  // Март — 8
  {
    alt: 'Пустая комната до ремонта',
    monthKey: '2026-03',
    src: 'https://www.shutterstock.com/image-photo/flat-renovation-empty-room-before-260nw-1368594125.jpg'
  },
  {
    alt: 'Внутренние отделочные работы',
    monthKey: '2026-03',
    src: 'https://clevergrad.ru/%D0%B2%D0%BD%D1%83%D1%82%D1%80%D0%B5%D0%BD%20%D0%BE%D1%82%D0%B4%D0%B5%D0%BB%D0%BE%D1%87%20%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B_1.jpg'
  },
  {
    alt: 'Состояние объекта',
    monthKey: '2026-03',
    src: 'https://www.intex48.com/wp-content/uploads/2025/07/photo_5440738659767809585_y-1.jpg'
  },
  {
    alt: 'Подготовка к ремонту вторичной квартиры',
    monthKey: '2026-03',
    src: 'https://bigfoto.name/photo/uploads/posts/2023-03/1679956516_bigfoto-name-p-s-chego-nachinat-remont-v-kvartire-vtorich-24.jpg'
  },
  {
    alt: 'Ремонт квартиры',
    monthKey: '2026-03',
    src: 'https://60.img.avito.st/image/1/1.uO_EYra4FAbyy9YDuCSH14zDFgB6w5YOssYWBHTLHAxy.0sn52lP44mF3Z79LcBHnJBub44EysU_O3thbmP4vIcs'
  },
  {
    alt: 'Готовый интерьер',
    monthKey: '2026-03',
    src: 'https://remontikpro.ru/stat_detail/imj/450_17281940931.webp'
  },
  {
    alt: 'Результат отделки',
    monthKey: '2026-03',
    src: 'https://gallery.profi.ru/xfiles/pfiles/6294a5fe3feb4d3b8f4751cee705d5a0.jpg-w400.jpg'
  },
  {
    alt: 'Финальный вид комнаты',
    monthKey: '2026-03',
    src: 'https://i.pinimg.com/736x/d5/d2/6d/d5d26d5c8810704b48fa6d8a1ece43f3.jpg'
  },
  // Апрель — 5
  {
    alt: 'Кухня с островом и обеденной зоной, визуализация',
    monthKey: '2026-04',
    src: 'https://s3.regru.cloud/s3.planirovochka/e1aeb5fd-9afa-409c-8e14-d8dfe9b58624/gallery/1774802737956.jpg',
  },
  {
    alt: 'Гостиная и кухня-гостиная, общий вид',
    monthKey: '2026-04',
    src: 'https://s3.regru.cloud/s3.planirovochka/e1aeb5fd-9afa-409c-8e14-d8dfe9b58624/gallery/1774802737959.jpg',
  },
  {
    alt: 'Студия: кухня, остров и зона отдыха',
    monthKey: '2026-04',
    src: 'https://s3.regru.cloud/s3.planirovochka/e1aeb5fd-9afa-409c-8e14-d8dfe9b58624/gallery/1774802737334.jpg',
  },
  {
    alt: 'Спальня с рабочим местом и проектором',
    monthKey: '2026-04',
    src: 'https://s3.regru.cloud/s3.planirovochka/e1aeb5fd-9afa-409c-8e14-d8dfe9b58624/gallery/1774802737312.jpg',
  },
  {
    alt: 'Гостиная с диваном и кухонной зоной',
    monthKey: '2026-04',
    src: 'https://s3.regru.cloud/s3.planirovochka/e1aeb5fd-9afa-409c-8e14-d8dfe9b58624/gallery/1774802737342.jpg',
  },
]

const GALLERY_BY_MONTH = MONTH_ORDER.map((key) => ({
  monthKey: key,
  monthLabel: MONTH_LABEL[key],
  photos: INTERIOR_PHOTOS.filter((p) => p.monthKey === key),
}))

const HEADER_TITLE = 'Фотоотчет'
const INFO_EXECUTOR_LABEL = 'Исполнитель:'
const INFO_EXECUTOR_VALUE = 'ООО «Строительная компания»'
const INFO_CUSTOMER_LABEL = 'Заказчик:'
const INFO_CUSTOMER_VALUE = 'Иванов Иван'
const FILTER_LABEL = 'Месяц'
const FILTER_PLACEHOLDER = 'Все месяцы'
const EMPTY_MONTH_MESSAGE = 'Фотографий за этот месяц пока нет.'
const PHOTOS_COUNT_UNIT = 'фото'
const FANCYBOX_SELECTOR = '[data-fancybox="photoreport"]'
const FANCYBOX_GROUP = 'photoreport'

const Gallery = () => {
  const [filterMonth, setFilterMonth] = useState<Dayjs | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const visibleGroups = useMemo(() => {
    if (!filterMonth) return GALLERY_BY_MONTH
    const key = filterMonth.format('YYYY-MM')
    const photos = INTERIOR_PHOTOS.filter((p) => p.monthKey === key)
    const monthLabel = MONTH_LABEL[key] ?? filterMonth.locale('ru').format('MMMM YYYY')
    return [{ monthKey: key, monthLabel, photos }]
  }, [filterMonth])

  useEffect(() => {
    const root = scrollRef.current
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
  }, [filterMonth])

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
            <span>{INFO_EXECUTOR_LABEL}</span>
            <span className={styles.value}>{INFO_EXECUTOR_VALUE}</span>
          </div>
          <div className={styles.item}>
            <span>{INFO_CUSTOMER_LABEL}</span>
            <span className={styles.value}>{INFO_CUSTOMER_VALUE}</span>
          </div>
        </div>

        <section className={styles.section} aria-label="Фотогалерея по месяцам">
          <div className={styles.filterRow}>
            <span id="gallery-month-filter-label" className={styles.filterLabel}>
              {FILTER_LABEL}
            </span>
            <ConfigProvider locale={ruRU}>
              <DatePicker
                className={styles.monthPicker}
                allowClear
                aria-labelledby="gallery-month-filter-label"
                format="MMMM YYYY"
                getPopupContainer={() => document.body}
                inputReadOnly
                picker="month"
                placeholder={FILTER_PLACEHOLDER}
                value={filterMonth}
                onChange={setFilterMonth}
              />
            </ConfigProvider>
          </div>

          <div ref={scrollRef} className={styles.scroll}>
            {visibleGroups.map(({ monthKey, monthLabel, photos }) => (
              <div key={monthKey} className={styles.monthBlock}>
                <h2 className={styles.monthTitle}>
                  {monthLabel}
                  <span className={styles.monthCount}>
                    {photos.length} {PHOTOS_COUNT_UNIT}
                  </span>
                </h2>
                {photos.length === 0 ? (
                  <p className={styles.emptyHint}>{EMPTY_MONTH_MESSAGE}</p>
                ) : (
                  <ul className={styles.grid}>
                    {photos.map((photo) => (
                      <li key={photo.src} className={styles.cell}>
                        <a
                          className={styles.thumbLink}
                          aria-label={`Открыть в полном размере: ${photo.alt}`}
                          data-caption={photo.alt}
                          data-fancybox={FANCYBOX_GROUP}
                          href={photo.src}
                          rel="noreferrer"
                        >
                          <img
                            className={styles.thumb}
                            alt=""
                            decoding="async"
                            loading="lazy"
                            src={photo.src}
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Gallery
