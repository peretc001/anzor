-- RLS: пользователь видит и меняет только свои проекты
alter table public.projects enable row level security;

grant select, insert, update, delete on table public.projects to authenticated;
grant all on table public.projects to service_role;

create policy "projects_select_own"
  on public.projects
  for select
  to authenticated
  using (owner_id = auth.uid());

create policy "projects_insert_own"
  on public.projects
  for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "projects_update_own"
  on public.projects
  for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "projects_delete_own"
  on public.projects
  for delete
  to authenticated
  using (owner_id = auth.uid());
