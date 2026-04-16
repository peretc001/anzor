import { NextRequest, NextResponse } from 'next/server'

import { getCurrentUser } from '@/lib/getCurrentUser'
import { createClient } from '@/lib/supabaseServer'

export async function GET() {
  const supabase = await createClient()

  const user = await getCurrentUser()

  if (!user?.id) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase.from('projects').select('*').eq('owner_id', user.id)

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ data: null })
  }

  return NextResponse.json({ data })
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

  const row = {}
  //   styles: toJsonArray(body.styles),
  //   avatar: body.avatar ?? null,
  //   city: toOptionalText(body.city),
  //   city_code: toOptionalText(body.city_code),
  //   description: toOptionalText(body.description),
  //   experience: toOptionalText(body.experience),
  //   first_name: toOptionalText(body.first_name),
  //   inspected: body.inspected ?? false,
  //   last_name: toOptionalText(body.last_name),
  //   middle_name: toOptionalText(body.middle_name),
  //   owner_id: user.id,
  //   segments: toJsonArray(body.segments),
  //   spaces: toJsonArray(body.spaces),
  //   status: toOptionalText(body.status),
  //   types: toJsonArray(body.types)
  // }

  const { error } = await supabase.from('projects').upsert(row, { onConflict: 'owner_id' })

  if (error) {
    return NextResponse.json({ error: error.message, status: false }, { status: 500 })
  }

  return NextResponse.json({ status: true })
}
