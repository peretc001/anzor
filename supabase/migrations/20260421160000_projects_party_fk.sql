-- Связь проекта с подрядчиком и заказчиком; убираем устаревшие текстовые поля с проекта (если были).
do $drop_legacy$
begin
  if to_regclass('public.projects') is null then
    return;
  end if;

  alter table public.projects drop column if exists contractor;
  alter table public.projects drop column if exists customer;
  alter table public.projects drop column if exists contractor_inn;
  alter table public.projects drop column if exists contractor_phone;
  alter table public.projects drop column if exists contractor_email;
  alter table public.projects drop column if exists contractor_website;
end $drop_legacy$;

-- FK: projects.contractor_id → contractors.id
do $fk_contractor$
begin
  if to_regclass('public.projects') is null or to_regclass('public.contractors') is null then
    return;
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'projects'
      and column_name = 'contractor_id'
  ) then
    return;
  end if;

  alter table public.projects drop constraint if exists projects_contractor_id_fkey;

  alter table public.projects
    add constraint projects_contractor_id_fkey
    foreign key (contractor_id) references public.contractors (id) on delete set null;
end $fk_contractor$;

-- FK: projects.customer_id → customers.id
do $fk_customer$
begin
  if to_regclass('public.projects') is null or to_regclass('public.customers') is null then
    return;
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'projects'
      and column_name = 'customer_id'
  ) then
    return;
  end if;

  alter table public.projects drop constraint if exists projects_customer_id_fkey;

  alter table public.projects
    add constraint projects_customer_id_fkey
    foreign key (customer_id) references public.customers (id) on delete set null;
end $fk_customer$;
