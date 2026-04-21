import { NextResponse } from 'next/server'

import type { IContractor, ICustomer } from '@/shared/interfaces'

import { getCurrentUser } from '@/lib/getCurrentUser'
import { createClient } from '@/lib/supabaseServer'

type RouteContext = { params: Promise<{ id: string }> }

/** Данные подрядчика и заказчика для формы редактирования (не входят в тело `project`). */
export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const projectId = Number(id)

  if (!Number.isInteger(projectId) || projectId <= 0) {
    return NextResponse.json({ data: null, error: 'Invalid project id' }, { status: 400 })
  }

  const user = await getCurrentUser()

  if (!user?.id) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('contractor_id, customer_id')
    .eq('id', projectId)
    .eq('owner_id', user.id)
    .maybeSingle()

  if (projectError) {
    return NextResponse.json({ data: null, error: projectError.message }, { status: 500 })
  }

  if (!project) {
    return NextResponse.json({ data: null, error: 'Project not found' }, { status: 404 })
  }

  let contractor: IContractor | null = null
  let customer: ICustomer | null = null

  if (project.contractor_id != null) {
    const { data } = await supabase
      .from('contractors')
      .select('id, name, inn, email, phone')
      .eq('id', project.contractor_id)
      .eq('owner_id', user.id)
      .maybeSingle()

    contractor = (data as IContractor) ?? null
  }

  if (project.customer_id != null) {
    const { data } = await supabase
      .from('customers')
      .select('id, name, email')
      .eq('id', project.customer_id)
      .eq('owner_id', user.id)
      .maybeSingle()

    customer = (data as ICustomer) ?? null
  }

  return NextResponse.json({ data: { contractor, customer } })
}
