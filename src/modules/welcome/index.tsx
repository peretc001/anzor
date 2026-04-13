'use client'

import { Button } from 'antd'

import { openSignupModal } from '@/lib/openSignupModal'

import styles from './home.module.css'

const STUDIOS = [
  { id: 'forma', name: 'Forma' },
  { id: 'linea', name: 'Linea' },
  { id: 'atelier', name: 'Atelier M' },
  { id: 'mono', name: 'Mono' },
  { id: 's12', name: 'Studio 12' }
]

const Welcome = () => {
  const handleLogin = () => {
    openSignupModal()
  }

  return (
    <div className={styles.shell}>
      <div className={styles.bgWrap} aria-hidden>
        <img className={styles.bgImg} alt="" src="/home.png" />
        <div className={styles.overlay} />
      </div>

      <main className={styles.main}>
        <h1 className={styles.title}>
          <span>АНЗОР</span>авторский надзор дизайн-проектов
        </h1>
        <p className={styles.subtitle}>Организуйте свой авторский надзор без проблем</p>
        <Button size="large" type="primary" onClick={handleLogin}>
          Войти
        </Button>
      </main>

      <footer className={styles.bottomBar}>
        <ul className={styles.logosRow} aria-label="Партнёрские студии">
          {STUDIOS.map(s => (
            <li key={s.id} className={styles.logoItem}>
              {s.name}
            </li>
          ))}
        </ul>
      </footer>
    </div>
  )
}

export default Welcome
