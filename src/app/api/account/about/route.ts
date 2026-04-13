import { NextRequest, NextResponse } from 'next/server'

import { getCurrentUser } from '@/lib/getCurrentUser'
import { createClient } from '@/lib/supabaseServer'

function toJsonArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

function toOptionalText(value: unknown): null | string {
  if (value === undefined || value === null) return null
  const s = typeof value === 'string' ? value : String(value)
  return s === '' ? null : s
}

export async function GET() {
  const supabase = await createClient()

  const user = await getCurrentUser()

  if (!user?.id) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ data: null })
  }

  const profile = {
    styles: data.styles,
    avatar: data.avatar,
    city: data.city,
    city_code: data.city_code,
    description: data.description,
    experience: data.experience,
    first_name: data.first_name,
    inspected: data.inspected,
    last_name: data.last_name,
    middle_name: data.middle_name,
    segments: data.segments,
    spaces: data.spaces,
    status: data.status,
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
    styles: toJsonArray(body.styles),
    avatar: body.avatar ?? null,
    city: toOptionalText(body.city),
    city_code: toOptionalText(body.city_code),
    description: toOptionalText(body.description),
    experience: toOptionalText(body.experience),
    first_name: toOptionalText(body.first_name),
    inspected: body.inspected ?? false,
    last_name: toOptionalText(body.last_name),
    middle_name: toOptionalText(body.middle_name),
    owner_id: user.id,
    segments: toJsonArray(body.segments),
    spaces: toJsonArray(body.spaces),
    status: toOptionalText(body.status),
    types: toJsonArray(body.types)
  }

  const { error } = await supabase.from('profiles').upsert(row, { onConflict: 'owner_id' })

  if (error) {
    return NextResponse.json({ error: error.message, status: false }, { status: 500 })
  }

  return NextResponse.json({ status: true })
}
