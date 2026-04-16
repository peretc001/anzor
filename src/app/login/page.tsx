import React from 'react'
import { Metadata } from 'next'

import Login from '@/modules/login/login'

export const metadata: Metadata = {
  title: 'Авторизация'
}

const Page = async () => <Login />

export default Page
