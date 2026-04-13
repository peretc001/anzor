import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  description: 'Страница не найдена',
  title: '404 Страница не найдена'
}

const NotFound = () => (
  <div>
    <h2>404 | Страница не найдена</h2>
    <p>Похоже у нас нет такой страницы</p>
    <Link href="/">На галвную</Link>
  </div>
)

export default NotFound
