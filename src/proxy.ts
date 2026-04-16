import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/lib/supabaseServer'

export async function proxy(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isPublic =
    pathname === '/login' || pathname.startsWith('/api/') || pathname.startsWith('/_next/')

  if (!user?.id && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = ''
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: [
    /*
     * Исключаем статику и картинки — иначе лишние вызовы auth на каждый ассет.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'
  ]
}
