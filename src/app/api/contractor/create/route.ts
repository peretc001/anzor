import { NextRequest, NextResponse } from 'next/server'

import { SaveProjectPayload } from '@/shared/interfaces'

import { createClient } from '@/lib/supabaseServer'

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

  let row = {
    active: body?.active ?? true,
    address: body?.address ?? '',
    name: body?.name ?? '',
    owner_id: user.id,
    type: body?.type ?? 'flat'
  } as SaveProjectPayload

  if (body?.id) row = { ...row, id: body.id } as SaveProjectPayload

  const { error } = await supabase.from('projects').upsert(row, { onConflict: 'id' })

  if (error) {
    return NextResponse.json({ error: error.message, status: false }, { status: 500 })
  }

  return NextResponse.json({ status: true })
}
