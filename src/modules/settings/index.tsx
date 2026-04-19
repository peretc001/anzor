import React from 'react'

import { getUserApi } from '@/modules/settings/api/getUserApi'
import Main from '@/modules/settings/components/main/main'

const User = async () => {
  const user = await getUserApi()

  return <Main user={user} />
}

export default User
