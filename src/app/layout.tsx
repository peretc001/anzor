import React, { Suspense } from 'react'
import type { Viewport } from 'next'
import { Open_Sans } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale } from 'next-intl/server'

import UserStoreSync from '@/shared/components/user/userStoreSync'

import { Amplitude } from '@/lib/amplitude'
import { getCurrentUser } from '@/lib/getCurrentUser'
import { mapSessionUserForMenu } from '@/lib/mapSessionUserForMenu'
import UseQueryProviders from '@/lib/useQueryProviders'

import Menu from '@/layout/menu/menu'
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
  const menuUser = mapSessionUserForMenu(await getCurrentUser())

  return (
    <html lang={locale}>
      <body className={openSans.className}>
        <NextIntlClientProvider>
          <UseQueryProviders>
            <UserStoreSync initialMenuUser={menuUser} />
            <div className="layout-container">
              {menuUser.id ? (
                <div className="menu">
                  <Menu />
                </div>
              ) : null}

              <div className="page">{children}</div>
            </div>

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
