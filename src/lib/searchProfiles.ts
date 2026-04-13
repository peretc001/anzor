import { IOption } from '@/shared/interfaces'

import { DESIGN_EXPERIENCE, DESIGN_STATUS, DESIGN_STYLES, PROFILE_LIST_LIMIT } from '@/constants'

import type { SupabaseClient } from '@supabase/supabase-js'

export type ProfileListFilters = {
  styles: string[]
  city: string
  currentPage: number /** Номер страницы, с 1. */
  experience: string[]
  limit: number /** Размер страницы (сколько карточек в `list`). */
  name: string
  /** Только профили с хотя бы одной записью в таблице `portfolio`. */
  portfolioOnly: boolean
  segments: string[]
  status: string[]
  types: string[]
  /** URL `inspected=1`: только профили без авторского надзора (`inspected === false`). */
  uninspectedOnly: boolean
}

const GALLERY_LIMIT = 100
const PORTFOLIO_LIMIT = 100

function normalizeFilterArray(v: unknown): string[] {
  let arr: unknown = v
  if (!Array.isArray(arr)) {
    if (typeof arr === 'string') {
      try {
        arr = JSON.parse(arr) as unknown
      } catch {
        arr = []
      }
    } else {
      arr = []
    }
  }
  if (!Array.isArray(arr)) return []
  return arr.map(x => String(x).trim()).filter(Boolean)
}

function coerceJsonStringArray(raw: unknown): string[] {
  if (raw == null) return []
  if (Array.isArray(raw)) return raw.map(x => String(x))
  if (typeof raw === 'string') {
    try {
      const d = JSON.parse(raw) as unknown
      return Array.isArray(d) ? d.map(x => String(x)) : []
    } catch {
      return []
    }
  }
  return []
}

function parsePrices(raw: unknown): Record<string, unknown> | null {
  if (raw == null) return null
  let obj: unknown = raw
  if (typeof raw === 'string') {
    try {
      obj = JSON.parse(raw) as unknown
    } catch {
      return null
    }
  }
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return null
  const o = obj as Record<string, unknown>
  return Object.keys(o).length === 0 ? null : o
}

function experienceLabel(value: string): string {
  const v = value.trim()
  return DESIGN_EXPERIENCE.find(e => e.value === v)?.label ?? v
}

function statusLabel(value: string): string {
  const v = value.trim()
  return DESIGN_STATUS.find(s => s.value === v)?.label ?? v
}

function stylesLabel(styles: string[]): IOption[] {
  return DESIGN_STYLES.filter(e => styles.includes(e.value)) ?? []
}

function jsonOverlap(profileVals: string[], filterVals: string[]): boolean {
  return filterVals.some(f => profileVals.includes(f))
}

function matchesJsonOrGroup(
  row: { styles: string[]; segments: string[]; types: string[] },
  filters: Pick<ProfileListFilters, 'segments' | 'styles' | 'types'>
): boolean {
  const parts: boolean[] = []
  if (filters.types.length) parts.push(jsonOverlap(row.types, filters.types))
  if (filters.styles.length) parts.push(jsonOverlap(row.styles, filters.styles))
  if (filters.segments.length) parts.push(jsonOverlap(row.segments, filters.segments))
  if (parts.length === 0) return true
  return parts.every(Boolean)
}

function buildDisplayName(row: Record<string, unknown>): string {
  const first = typeof row.first_name === 'string' ? row.first_name.trim() : ''
  const last = typeof row.last_name === 'string' ? row.last_name.trim() : ''
  const middle = typeof row.middle_name === 'string' ? row.middle_name.trim() : ''
  if (typeof row.name === 'string' && row.name.trim() !== '') return row.name.trim()
  return [last, first].filter(Boolean).join(' ')
}

function nameMatchesFilter(row: Record<string, unknown>, nameFilter: string): boolean {
  if (!nameFilter) return true
  return buildDisplayName(row).toLowerCase().includes(nameFilter.toLowerCase())
}

function formatProfileRow(
  r: Record<string, unknown>,
  parsed: { styles: string[]; segments: string[]; types: string[] }
): Record<string, unknown> {
  const experienceRaw =
    r.experience !== undefined && r.experience !== null ? String(r.experience) : ''
  const statusRaw = r.status !== undefined && r.status !== null ? String(r.status) : ''

  return {
    ...r,
    styles: parsed.styles,
    stylesLabel: stylesLabel(parsed.styles),
    contacts: null,
    experience: experienceRaw,
    experienceLabel: experienceLabel(experienceRaw),
    name: buildDisplayName(r),
    prices: parsePrices(r.prices),
    segments: parsed.segments,
    status: statusRaw,
    statusLabel: statusLabel(statusRaw),
    types: parsed.types
  }
}

export async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const text = await request.text()
    if (!text) return {}
    const parsed = JSON.parse(text) as unknown
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>
    }
  } catch {
    // невалидный JSON — пустые фильтры
  }
  return {}
}

function parsePositiveInt(v: unknown, fallback: number): number {
  if (typeof v === 'number' && Number.isFinite(v) && v > 0) return Math.floor(v)
  if (typeof v === 'string' && v.trim() !== '') {
    const n = Number.parseInt(v, 10)
    if (Number.isFinite(n) && n > 0) return n
  }
  return fallback
}

function parsePage(v: unknown): number {
  const n = parsePositiveInt(v, 1)
  return n >= 1 ? n : 1
}

function parsePortfolioOnlyFlag(raw: unknown): boolean {
  if (raw === true || raw === 1) return true
  if (typeof raw === 'string') {
    const s = raw.trim()
    if (s === '1' || s === 'true') return true
    return s
      .split(',')
      .map(x => x.trim())
      .includes('1')
  }
  if (Array.isArray(raw)) return raw.some(x => String(x).trim() === '1')
  return false
}

export function buildFilters(payload: Record<string, unknown>): ProfileListFilters {
  const limitRaw = parsePositiveInt(payload.limit, PROFILE_LIST_LIMIT)
  return {
    styles: normalizeFilterArray(payload.styles),
    city: typeof payload.city === 'string' ? payload.city.trim() : '',
    currentPage: parsePage(payload.currentPage ?? payload.page),
    experience: normalizeFilterArray(payload.experience),
    limit: Math.min(limitRaw, PROFILE_LIST_LIMIT),
    name: typeof payload.name === 'string' ? payload.name.trim() : '',
    portfolioOnly: parsePortfolioOnlyFlag(payload.portfolio),
    segments: normalizeFilterArray(payload.segments),
    status: normalizeFilterArray(payload.status),
    types: normalizeFilterArray(payload.types),
    uninspectedOnly: parsePortfolioOnlyFlag(payload.inspected)
  }
}

async function loadGalleryByOwnerIds(
  supabase: SupabaseClient,
  ownerIds: string[]
): Promise<Record<string, Record<string, unknown>[]>> {
  if (ownerIds.length === 0) return {}

  const { data: galleryRows, error } = await supabase
    .from('gallery')
    .select('*')
    .in('owner_id', ownerIds)
    .order('created_at', { ascending: false })

  if (error || !galleryRows) return {}

  const byOwner: Record<string, Record<string, unknown>[]> = {}
  for (const g of galleryRows as Record<string, unknown>[]) {
    const oid = String(g.owner_id ?? '')
    if (!oid) continue
    ;(byOwner[oid] ??= []).push(g)
  }

  const out: Record<string, Record<string, unknown>[]> = {}
  for (const oid of ownerIds) {
    const sorted = (byOwner[oid] ?? []).sort((a, b) => {
      const ta = new Date(String(a.created_at ?? 0)).getTime()
      const tb = new Date(String(b.created_at ?? 0)).getTime()
      return tb - ta
    })
    out[oid] = sorted.slice(0, GALLERY_LIMIT)
  }
  return out
}

async function loadPortfolioByOwnerIds(
  supabase: SupabaseClient,
  ownerIds: string[]
): Promise<Record<string, Record<string, unknown>[]>> {
  if (ownerIds.length === 0) return {}

  const { data: portfolioRows, error } = await supabase
    .from('portfolio')
    .select('*')
    .in('owner_id', ownerIds)
    .order('created_at', { ascending: false })

  if (error || !portfolioRows) return {}

  const byOwner: Record<string, Record<string, unknown>[]> = {}
  for (const p of portfolioRows as Record<string, unknown>[]) {
    const oid = String(p.owner_id ?? '')
    if (!oid) continue
    ;(byOwner[oid] ??= []).push(p)
  }

  const out: Record<string, Record<string, unknown>[]> = {}
  for (const oid of ownerIds) {
    const sorted = (byOwner[oid] ?? []).sort((a, b) => {
      const ta = new Date(String(a.created_at ?? 0)).getTime()
      const tb = new Date(String(b.created_at ?? 0)).getTime()
      return tb - ta
    })
    out[oid] = sorted.slice(0, PORTFOLIO_LIMIT)
  }
  return out
}

/**
 * Список профилей для каталога: скалярные фильтры в SQL, JSON/имя — в памяти, затем галерея.
 */
export type ProfilesCatalogPage = {
  currentPage: number
  list: Record<string, unknown>[]
  total: number
}

export async function listProfilesForCatalog(
  supabase: SupabaseClient,
  filters: ProfileListFilters
): Promise<{ data: ProfilesCatalogPage; error?: string }> {
  let query = supabase.from('profiles').select('*').eq('approved', true)

  if (filters.uninspectedOnly) {
    query = query.eq('inspected', false)
  }

  if (filters.experience.length) {
    query = query.in('experience', filters.experience)
  }
  if (filters.status.length) {
    query = query.in('status', filters.status)
  }
  if (filters.city !== '') {
    query = query.ilike('city', `%${filters.city}%`)
  }

  const { data: rawRows, error } = await query
  if (error) {
    return {
      data: { currentPage: filters.currentPage, list: [], total: 0 },
      error: error.message
    }
  }

  const mapped: Record<string, unknown>[] = []
  for (const row of rawRows ?? []) {
    const r = row as Record<string, unknown>
    const types = coerceJsonStringArray(r.types)
    const styles = coerceJsonStringArray(r.styles)
    const segments = coerceJsonStringArray(r.segments)
    if (!matchesJsonOrGroup({ styles, segments, types }, filters)) continue
    if (!nameMatchesFilter(r, filters.name)) continue
    mapped.push(formatProfileRow(r, { styles, segments, types }))
  }

  let eligible = mapped
  if (filters.portfolioOnly && mapped.length > 0) {
    const ownerIds = [...new Set(mapped.map(m => String(m.owner_id ?? '')).filter(Boolean))]
    const { data: portfolioRows, error: portfolioErr } = await supabase
      .from('portfolio')
      .select('owner_id')
      .in('owner_id', ownerIds)

    if (portfolioErr) {
      return {
        data: { currentPage: filters.currentPage, list: [], total: 0 },
        error: portfolioErr.message
      }
    }

    const withPortfolio = new Set(
      (portfolioRows ?? []).map((row: { owner_id: unknown }) => String(row.owner_id ?? ''))
    )
    eligible = mapped.filter(m => withPortfolio.has(String(m.owner_id ?? '')))
  }

  const total = eligible.length
  const { currentPage, limit } = filters
  const start = (currentPage - 1) * limit
  const pageSlice = eligible.slice(start, start + limit)

  const ownerIds = [...new Set(pageSlice.map(m => m.owner_id).filter(Boolean))] as string[]
  const [galleryByOwner, portfolioByOwner] = await Promise.all([
    loadGalleryByOwnerIds(supabase, ownerIds),
    loadPortfolioByOwnerIds(supabase, ownerIds)
  ])

  const list = pageSlice.map(row => {
    const oid = row.owner_id != null ? String(row.owner_id) : ''
    return {
      ...row,
      gallery: oid ? (galleryByOwner[oid] ?? []) : [],
      portfolio: oid ? (portfolioByOwner[oid] ?? []) : []
    }
  })

  return { data: { currentPage, list, total } }
}
