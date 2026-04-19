-- Каскад на уровне БД: при удалении проекта автоматически удаляются связанные задачи,
-- галерея и документы. Удаление файлов в S3 остаётся на стороне приложения (API).
--
-- Перед применением на существующей базе убедитесь, что нет «осиротевших» строк
-- (project_id, не указывающий на существующий projects.id), иначе ADD CONSTRAINT завершится ошибкой.

-- tasks.project_id -> projects.id
do $tasks$
begin
  if to_regclass('public.tasks') is null then
    return;
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'tasks'
      and column_name = 'project_id'
  ) then
    return;
  end if;

  alter table public.tasks drop constraint if exists tasks_project_id_fkey;

  alter table public.tasks
    add constraint tasks_project_id_fkey
    foreign key (project_id) references public.projects (id) on delete cascade;
end $tasks$;

-- documents.project_id -> projects.id
do $documents$
begin
  if to_regclass('public.documents') is null then
    return;
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'documents'
      and column_name = 'project_id'
  ) then
    return;
  end if;

  alter table public.documents drop constraint if exists documents_project_id_fkey;

  alter table public.documents
    add constraint documents_project_id_fkey
    foreign key (project_id) references public.projects (id) on delete cascade;
end $documents$;

-- gallery: project_id -> projects.id; task_id -> tasks.id (удаление задачи убирает её фото в галерее)
do $gallery$
begin
  if to_regclass('public.gallery') is null then
    return;
  end if;

  alter table public.gallery drop constraint if exists gallery_project_id_fkey;
  alter table public.gallery drop constraint if exists gallery_task_id_fkey;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'gallery'
      and column_name = 'project_id'
  ) then
    alter table public.gallery
      add constraint gallery_project_id_fkey
      foreign key (project_id) references public.projects (id) on delete cascade;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'gallery'
      and column_name = 'task_id'
  )
  and to_regclass('public.tasks') is not null then
    alter table public.gallery
      add constraint gallery_task_id_fkey
      foreign key (task_id) references public.tasks (id) on delete cascade;
  end if;
end $gallery$;
