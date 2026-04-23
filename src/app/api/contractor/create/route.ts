import { NextRequest, NextResponse } from 'next/server'

import { IContractor } from '@/shared/interfaces'

import { getCurrentUser } from '@/lib/getCurrentUser'
import { createClient } from '@/lib/supabaseServer'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const user = await getCurrentUser()

  if (!user?.id) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const projectId = Number(body?.projectId)
  const values = body?.values

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return NextResponse.json({ error: 'Invalid project id', status: false }, { status: 400 })
  }

  let row = {
    email: values?.email ?? '',
    inn: values?.inn ?? '',
    name: values?.name ?? '',
    owner_id: user.id,
    phone: values?.phone ?? ''
  } as IContractor

  if (projectId) row = { ...row, id: projectId } as IContractor

  const { data, error } = await supabase
    .from('contractors')
    .upsert(row, { onConflict: 'id' })
    .select('id')
    .single()

  if (!data?.id || error) {
    return NextResponse.json({ error: error?.message, status: false }, { status: 500 })
  }

  const { error: errorUpdate } = await supabase
    .from('projects')
    .update({ contractor_id: data.id })
    .eq('id', projectId)
    .eq('owner_id', user.id)

  if (errorUpdate) {
    return NextResponse.json({ error: errorUpdate.message, status: false }, { status: 500 })
  }

  return NextResponse.json({ status: true })
}
