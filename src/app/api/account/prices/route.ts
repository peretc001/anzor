import { NextRequest, NextResponse } from 'next/server'

import { getCurrentUser } from '@/lib/getCurrentUser'
import { createClient } from '@/lib/supabaseServer'

export async function GET() {
  const supabase = await createClient()

  const user = await getCurrentUser()

  if (!user?.id) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('prices, types')
    .eq('owner_id', user.id)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ data: null })
  }

  const profile = {
    prices: data.prices,
    types: data.types
  }

  return NextResponse.json({ data: profile })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized', status: false }, { status: 401 })
  }

  const body = await request.json()

  const row = {
    owner_id: user.id,
    prices: body?.prices ?? {}
  }

  const { error } = await supabase.from('profiles').upsert(row, { onConflict: 'owner_id' })

  if (error) {
    return NextResponse.json({ error: error.message, status: false }, { status: 500 })
  }

  return NextResponse.json({ status: true })
}
