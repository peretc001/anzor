import { NextResponse } from 'next/server'

import type { ProjectCardModel } from '@/shared/store/projects'

import { getCurrentUser } from '@/lib/getCurrentUser'
import { createClient } from '@/lib/supabaseServer'

export async function GET() {
  const supabase = await createClient()

  const user = await getCurrentUser()

  if (!user?.id) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('projects')
    .select('id, active, address, contractor, customer, type, name')
    .eq('owner_id', user.id)
    .order('id', { ascending: false })

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  const projects: ProjectCardModel[] = (data ?? []).map(row => ({
    id: Number(row.id),
    active: row.active,
    address: row.address ?? undefined,
    contractor: row.contractor ?? undefined,
    customer: row.customer ?? undefined,
    icon: row.type === 'building' ? 'building' : 'home',
    name: row.name,
    type: row.type as ProjectCardModel['type'],
    warningsCount: 0
  }))

  return NextResponse.json({ data: projects })
}
