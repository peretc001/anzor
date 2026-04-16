import type { SupabaseClient } from '@supabase/supabase-js'

export async function ensureUserOwnsProject(
  supabase: SupabaseClient,
  ownerId: string,
  projectId: number
): Promise<boolean> {
  const { data, error } = await supabase
    .from('projects')
    .select('id')
    .eq('id', projectId)
    .eq('owner_id', ownerId)
    .maybeSingle()

  return !error && Boolean(data)
}
