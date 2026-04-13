import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabaseServer'

export async function proxy(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  const isProfileRoute = request.nextUrl.pathname.startsWith('/profile')

  if (isProfileRoute && !user?.id) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile', '/profile/:path*']
}
