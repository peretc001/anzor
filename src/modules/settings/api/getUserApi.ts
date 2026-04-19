import { redirect } from 'next/navigation'

import type { IUser } from '@/shared/interfaces'

import { getCurrentUser } from '@/lib/getCurrentUser'

export const getUserApi = async (): Promise<IUser | null> => {
  const user = await getCurrentUser()

  if (!user?.id) {
    return redirect('/login')
  }

  const meta = user.user_metadata ?? {}
  const str = (k: string) => (typeof meta[k] === 'string' ? (meta[k] as string) : undefined)

  return {
    id: user.id,
    avatar: str('avatar'),
    email: user.email,
    name: str('name') ?? str('full_name'),
    password: undefined,
    type: str('type'),
    user_metadata: { ...meta }
  }
}
