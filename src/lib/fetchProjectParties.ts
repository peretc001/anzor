import type { SupabaseClient } from '@supabase/supabase-js'

import type { IContractor, ICustomer, IProject } from '@/shared/interfaces'

import { normalizeProjectRow } from '@/lib/normalizeProjectRow'
import { readNumericId } from '@/lib/projectPartyUpsert'

type IdRow = {
  contractor_id?: number | null
  customer_id?: number | null
}

/** Догружает подрядчиков и заказчиков по id (без FK / embed в PostgREST). */
export async function fetchContractorAndCustomerMaps(
  supabase: SupabaseClient,
  rows: IdRow[]
): Promise<{
  contractorsById: Map<number, IContractor>
  customersById: Map<number, ICustomer>
}> {
  const contractorIds = [
    ...new Set(
      rows
        .map(r => readNumericId(r.contractor_id))
        .filter((v): v is number => v != null)
    )
  ]
  const customerIds = [
    ...new Set(
      rows.map(r => readNumericId(r.customer_id)).filter((v): v is number => v != null)
    )
  ]

  const contractorsById = new Map<number, IContractor>()
  const customersById = new Map<number, ICustomer>()

  if (contractorIds.length > 0) {
    const { data, error } = await supabase
      .from('contractors')
      .select('id, name, inn, email, phone')
      .in('id', contractorIds)

    if (!error && data) {
      for (const c of data) {
        contractorsById.set(Number(c.id), c as IContractor)
      }
    }
  }

  if (customerIds.length > 0) {
    const { data, error } = await supabase
      .from('customers')
      .select('id, name, email')
      .in('id', customerIds)

    if (!error && data) {
      for (const c of data) {
        customersById.set(Number(c.id), c as ICustomer)
      }
    }
  }

  return { contractorsById, customersById }
}

export function projectRowWithParties(
  row: Record<string, unknown>,
  contractorsById: Map<number, IContractor>,
  customersById: Map<number, ICustomer>
): IProject {
  const cid = readNumericId(row.contractor_id)
  const kid = readNumericId(row.customer_id)

  return normalizeProjectRow({
    ...row,
    contractor: cid != null ? contractorsById.get(cid) ?? null : null,
    customer: kid != null ? customersById.get(kid) ?? null : null
  })
}
