import type { SupabaseClient } from '@supabase/supabase-js'

function str(v: unknown): string | null {
  if (v == null) {
    return null
  }
  if (typeof v !== 'string') {
    return null
  }
  const t = v.trim()
  return t === '' ? null : t
}

export function readNumericId(v: unknown): number | null {
  const n = num(v)
  return n === undefined ? null : n
}

function num(v: unknown): number | undefined {
  if (typeof v === 'number' && !Number.isNaN(v)) {
    return v
  }
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number(v)
    return Number.isNaN(n) ? undefined : n
  }
  return undefined
}

/**
 * Создаёт или обновляет подрядчика; пустые данные → null (отвязка от проекта).
 */
export async function upsertContractorForProject(
  supabase: SupabaseClient,
  ownerId: string,
  payload: unknown,
  existingId: number | null | undefined
): Promise<number | null> {
  if (payload === null) {
    return null
  }

  if (payload == null || typeof payload !== 'object') {
    return existingId ?? null
  }

  const p = payload as Record<string, unknown>
  const id = num(p.id)
  const name = typeof p.name === 'string' ? p.name.trim() : ''
  const inn = str(p.inn)
  const email = str(p.email)
  const phone = str(p.phone)

  if (name === '' && id == null) {
    return null
  }

  if (id != null) {
    if (name === '') {
      return null
    }
    const { data: owned } = await supabase
      .from('contractors')
      .select('id')
      .eq('id', id)
      .eq('owner_id', ownerId)
      .maybeSingle()

    if (!owned) {
      return existingId ?? null
    }

    const { error } = await supabase
      .from('contractors')
      .update({
        email,
        inn,
        name,
        phone
      })
      .eq('id', id)
      .eq('owner_id', ownerId)

    if (error) {
      return existingId ?? null
    }
    return id
  }

  const { data, error } = await supabase
    .from('contractors')
    .insert({
      email,
      inn,
      name,
      owner_id: ownerId,
      phone
    })
    .select('id')
    .single()

  if (error || !data) {
    return null
  }

  return data.id as number
}

/**
 * Создаёт или обновляет заказчика; пустые данные → null.
 */
export async function upsertCustomerForProject(
  supabase: SupabaseClient,
  ownerId: string,
  payload: unknown,
  existingId: number | null | undefined
): Promise<number | null> {
  if (payload === null) {
    return null
  }

  if (payload == null || typeof payload !== 'object') {
    return existingId ?? null
  }

  const p = payload as Record<string, unknown>
  const id = num(p.id)
  const name = typeof p.name === 'string' ? p.name.trim() : ''
  const email = str(p.email)

  if (name === '' && id == null) {
    return null
  }

  if (id != null) {
    if (name === '') {
      return null
    }
    const { data: owned } = await supabase
      .from('customers')
      .select('id')
      .eq('id', id)
      .eq('owner_id', ownerId)
      .maybeSingle()

    if (!owned) {
      return existingId ?? null
    }

    const { error } = await supabase
      .from('customers')
      .update({
        email,
        name
      })
      .eq('id', id)
      .eq('owner_id', ownerId)

    if (error) {
      return existingId ?? null
    }
    return id
  }

  const { data, error } = await supabase
    .from('customers')
    .insert({
      email,
      name,
      owner_id: ownerId
    })
    .select('id')
    .single()

  if (error || !data) {
    return null
  }

  return data.id as number
}
