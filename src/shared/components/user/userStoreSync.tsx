'use client'

import React, { useLayoutEffect } from 'react'

import type { MenuUserPayload } from '@/lib/mapSessionUserForMenu'

import { useUserStore } from '@/shared/store/user'

type Props = {
  readonly initialMenuUser: MenuUserPayload
}

const UserStoreSync: React.FC<Props> = ({ initialMenuUser }) => {
  const setMenuUser = useUserStore(s => s.setMenuUser)

  useLayoutEffect(() => {
    setMenuUser(initialMenuUser)
  }, [
    initialMenuUser.avatar,
    initialMenuUser.email,
    initialMenuUser.id,
    initialMenuUser.name,
    initialMenuUser.type,
    setMenuUser
  ])

  return null
}

export default UserStoreSync
