-- RLS: пользователь видит и меняет только своих заказчиков (owner_id)
alter table public.customers enable row level security;

grant select, insert, update, delete on table public.customers to authenticated;
grant all on table public.customers to service_role;

create policy "customers_select_own"
  on public.customers
  for select
  to authenticated
  using (owner_id = auth.uid());

create policy "customers_insert_own"
  on public.customers
  for insert
  to authenticated
  with check (owner_id = auth.uid());

create policy "customers_update_own"
  on public.customers
  for update
  to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "customers_delete_own"
  on public.customers
  for delete
  to authenticated
  using (owner_id = auth.uid());
