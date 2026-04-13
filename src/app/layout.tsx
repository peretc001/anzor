import { Suspense } from 'react'
import type { Viewport } from 'next'
import { Open_Sans } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'

import { Amplitude } from '@/lib/amplitude'
import UseQueryProviders from '@/lib/useQueryProviders'

import Beta from '@/layout/beta/beta'
import Header from '@/layout/header/header'
import Metrika from '@/layout/metrica'
import AuthModal from '@/layout/modals/authModal'

import '@/styles/antd.design.scss'
import '@/globals.scss'

const openSans = Open_Sans({ subsets: ['latin', 'cyrillic'] })

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  width: 'device-width'
}

const RootLayout = async ({
  children
}: Readonly<{
  children: React.ReactNode
}>) => {
  const locale = await getLocale()

  return (
    <html lang={locale}>
      <body className={openSans.className}>
        <NextIntlClientProvider>
          <UseQueryProviders>
            <div className="layout-container">{children}</div>

            <AuthModal />

            <Amplitude />

            <Suspense>
              <Metrika />
            </Suspense>
          </UseQueryProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export default RootLayout
