import { create, type StoreApi, type UseBoundStore } from 'zustand'
import { devtools } from 'zustand/middleware'

import type { MenuUserPayload } from '@/lib/mapSessionUserForMenu'

type UserMenuState = MenuUserPayload

type UserMenuActions = {
  patchMenuUser: (patch: Partial<UserMenuState>) => void
  setMenuUser: (payload: MenuUserPayload) => void
}

export type IUserStore = UserMenuState & UserMenuActions

const empty: UserMenuState = {
  id: '',
  email: '',
  name: '',
  type: '',
  avatar: ''
}

export const useUserStore: UseBoundStore<StoreApi<IUserStore>> = create(
  devtools(
    (set): IUserStore => ({
      ...empty,
      patchMenuUser: patch => set(state => ({ ...state, ...patch })),
      setMenuUser: payload => set(state => ({ ...state, ...payload }))
    }),
    { name: 'user' }
  )
)
