-- RLS: пользователь видит и меняет только своих подрядчиков (owner_id)
alter table public.contractors enable row level security;

grant select, insert, update, delete on table public.contractors to authenticated;
grant all on table public.contractors to service_role;

create policy "contractors_select_own"
  on public.contractors
  for select
  to authenticated
  using (owner_id = auth.uid());

create policy "contractors_insert_own"
  on public.contractors
  for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "contractors_update_own"
  on public.contractors
  for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "contractors_delete_own"
  on public.contractors
  for delete
  to authenticated
  using (owner_id = auth.uid());
