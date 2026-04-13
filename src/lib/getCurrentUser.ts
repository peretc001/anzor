import { IUser } from '@/shared/interfaces'

import { createClient } from '@/lib/supabaseServer'

export const getCurrentUser = async () => {
  const supabase = await createClient()
  const { data } = await supabase.auth.getUser()

  return data?.user as IUser | null
}
