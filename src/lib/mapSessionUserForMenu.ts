import type { IUser } from '@/shared/interfaces'

export type MenuUserPayload = {
  avatar: string
  email: string
  id: string
  name: string
  type: string
}

const empty: MenuUserPayload = {
  id: '',
  email: '',
  name: '',
  type: '',
  avatar: ''
}

/** Данные для блока пользователя в меню (сырой `avatar` как в `user_metadata`). */
export function mapSessionUserForMenu(user: IUser | null): MenuUserPayload {
  if (!user?.id) {
    return { ...empty }
  }

  const meta = user.user_metadata ?? {}
  const str = (k: string) => (typeof meta[k] === 'string' ? (meta[k] as string) : '')

  return {
    id: user.id,
    email: user.email ?? '',
    name: str('name') || str('full_name') || (typeof user.name === 'string' ? user.name : ''),
    type: str('type') || (typeof user.type === 'string' ? user.type : ''),
    avatar: str('avatar') || (typeof user.avatar === 'string' ? user.avatar : '')
  }
}
