import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/lib/getCurrentUser'
import { createClient } from '@/lib/supabaseServer'

type RouteContext = { params: Promise<{ id: string }> }

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params
  const taskId = Number(id)

  if (!Number.isInteger(taskId) || taskId <= 0) {
    return NextResponse.json({ data: null, error: 'Invalid task id' }, { status: 400 })
  }

  const user = await getCurrentUser()

  if (!user?.id) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  const photos = body?.photos

  if (photos != null && !Array.isArray(photos)) {
    return NextResponse.json({ data: null, error: 'Invalid photos payload' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tasks')
    .update({
      photos: Array.isArray(photos) ? photos : null
    })
    .eq('id', taskId)
    .eq('owner_id', user.id)
    .select('*')
    .maybeSingle()

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ data: null, error: 'Task not found' }, { status: 404 })
  }

  return NextResponse.json({ data })
}
