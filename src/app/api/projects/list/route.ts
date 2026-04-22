import { NextResponse } from 'next/server'

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

  const [{ data: taskRows, error: tasksError }, { data: galleryRows, error: galleryError }] =
    await Promise.all([
      supabase
        .from('tasks')
        .select('project_id')
        .eq('owner_id', user.id)
        .in('project_id', projectIds),
      supabase
        .from('gallery')
        .select('project_id')
        .eq('owner_id', user.id)
        .in('project_id', projectIds)
    ])

  if (tasksError || galleryError) {
    return NextResponse.json(
      { data: null, error: tasksError?.message ?? galleryError?.message ?? 'Count failed' },
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

  const enriched = data.map(row => ({
    ...row,
    photos_count: photosByProject.get(row.id) ?? 0,
    tasks_count: tasksByProject.get(row.id) ?? 0
  }))

  return NextResponse.json({ data: enriched })
}
