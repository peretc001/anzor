-- Таблица проектов (соответствует Project в src/shared/store/projects.ts)
create table public.projects (
  id bigint primary key,
  active boolean not null default false,
  address text,
  contractor text,
  customer text,
  type text not null,
  name text not null,
  owner_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint projects_type_check check (type in ('building', 'home'))
);

comment on table public.projects is 'Проекты пользователя';
comment on column public.projects.owner_id is 'Владелец записи (auth.users.id)';

create index projects_owner_id_idx on public.projects (owner_id);
