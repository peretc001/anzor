'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  BellIcon,
  BuildingOffice2Icon,
  ChatBubbleBottomCenterIcon,
  UsersIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline'

import User from '@/shared/components/user/user'

import { paths } from '@/constants'

import styles from './menu.module.scss'

const MAIN_MENU_ITEMS = [
  {
    badge: null,
    icon: <BuildingOffice2Icon className={styles.icon} />,
    label: 'Объекты',
    link: paths.home
  },
  {
    badge: null,
    icon: <UsersIcon className={styles.icon} />,
    label: 'Заказчики',
    link: paths.customers
  },
  {
    badge: null,
    icon: <WrenchScrewdriverIcon className={styles.icon} />,
    label: 'Исполнители',
    link: paths.contractors
  },
  {
    badge: 2,
    icon: <ChatBubbleBottomCenterIcon className={styles.icon} />,
    label: 'Чат',
    link: paths.chat
  }
] as const

const BOTTOM_MENU_ITEMS = [
  { badge: 1, icon: <BellIcon className={styles.icon} />, label: 'Уведомления' }
] as const

const Menu = () => {
  const pathname = usePathname()

  return (
    <aside className={styles.root}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <div className={styles.logo}>АНЗОР</div>
          <div className={styles.subtitle}>авторский надзор</div>
        </div>

        <nav aria-label="Навигация">
          <ul className={styles.menuList}>
            {MAIN_MENU_ITEMS.map(item => (
              <li key={item.label}>
                <Link
                  className={`${styles.menuButton} ${pathname === item.link ? styles.menuButtonActive : ''}`}
                  href={item.link}
                >
                  <span className={styles.iconWrap}>{item.icon}</span>
                  <span className={styles.label}>{item.label}</span>
                  {item.badge ? <span className={styles.badge}>{item.badge}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={styles.bottom}>
        <nav aria-label="Дополнительная навигация">
          <ul className={styles.menuList}>
            {BOTTOM_MENU_ITEMS.map(item => (
              <li key={item.label}>
                <button className={styles.menuButton} type="button">
                  <span className={styles.iconWrap}>{item.icon}</span>
                  <span className={styles.label}>{item.label}</span>
                  {item.badge ? <span className={styles.badge}>{item.badge}</span> : null}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <User />
      </div>
    </aside>
  )
}

export default Menu
