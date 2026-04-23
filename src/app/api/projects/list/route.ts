import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/lib/getCurrentUser'
import { createClient } from '@/lib/supabaseServer'

function rowPartyId(value: unknown): null | number {
  if (value == null) {
    return null
  }
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value
  }
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value)
    return Number.isNaN(n) ? null : n
  }
  return null
}

export async function GET() {
  const supabase = await createClient()

  const user = await getCurrentUser()

  if (!user?.id) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  if (data == null) {
    return NextResponse.json({ data: null })
  }

  if (data.length === 0) {
    return NextResponse.json({ data: [] })
  }

  const projectIds = data.map(row => row.id)

  const contractorIds = [
    ...new Set(
      data
        .map(row => rowPartyId(row.contractor_id))
        .filter((id): id is number => id != null)
    )
  ]
  const customerIds = [
    ...new Set(
      data
        .map(row => rowPartyId(row.customer_id))
        .filter((id): id is number => id != null)
    )
  ]

  const [
    { data: taskRows, error: tasksError },
    { data: galleryRows, error: galleryError },
    { data: contractorRows, error: contractorsError },
    { data: customerRows, error: customersError }
  ] = await Promise.all([
    supabase
      .from('tasks')
      .select('project_id')
      .eq('owner_id', user.id)
      .in('project_id', projectIds),
    supabase
      .from('gallery')
      .select('project_id')
      .eq('owner_id', user.id)
      .in('project_id', projectIds),
    contractorIds.length > 0
      ? supabase
          .from('contractors')
          .select('id, name, inn, email, phone')
          .eq('owner_id', user.id)
          .in('id', contractorIds)
      : Promise.resolve({ data: [], error: null }),
    customerIds.length > 0
      ? supabase
          .from('customers')
          .select('id, name, email')
          .eq('owner_id', user.id)
          .in('id', customerIds)
      : Promise.resolve({ data: [], error: null })
  ])

  if (tasksError || galleryError || contractorsError || customersError) {
    return NextResponse.json(
      {
        data: null,
        error:
          tasksError?.message ??
          galleryError?.message ??
          contractorsError?.message ??
          customersError?.message ??
          'Count failed'
      },
      { status: 500 }
    )
  }

  const tasksByProject = new Map<number, number>()
  for (const row of taskRows ?? []) {
    const pid = row.project_id
    if (pid == null || Number.isNaN(Number(pid))) {
      continue
    }
    const id = Number(pid)
    tasksByProject.set(id, (tasksByProject.get(id) ?? 0) + 1)
  }

  const photosByProject = new Map<number, number>()
  for (const row of galleryRows ?? []) {
    const pid = row.project_id
    if (pid == null || Number.isNaN(Number(pid))) {
      continue
    }
    const id = Number(pid)
    photosByProject.set(id, (photosByProject.get(id) ?? 0) + 1)
  }

  const contractorsById = new Map<number, (typeof contractorRows)[number]>()
  for (const row of contractorRows ?? []) {
    if (row?.id == null || Number.isNaN(Number(row.id))) {
      continue
    }
    contractorsById.set(Number(row.id), row)
  }

  const customersById = new Map<number, (typeof customerRows)[number]>()
  for (const row of customerRows ?? []) {
    if (row?.id == null || Number.isNaN(Number(row.id))) {
      continue
    }
    customersById.set(Number(row.id), row)
  }

  const enriched = data.map(row => {
    const contractorId = rowPartyId(row.contractor_id)
    const customerId = rowPartyId(row.customer_id)
    return {
      ...row,
      photos_count: photosByProject.get(row.id) ?? 0,
      tasks_count: tasksByProject.get(row.id) ?? 0,
      contractor:
        contractorId != null ? (contractorsById.get(contractorId) ?? null) : null,
      customer: customerId != null ? (customersById.get(customerId) ?? null) : null
    }
  })

  return NextResponse.json({ data: enriched })
}
