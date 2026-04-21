-- Реквизиты исполнителя (форма редактирования проекта)
alter table public.projects add column if not exists contractor_inn text;

alter table public.projects add column if not exists contractor_phone text;

alter table public.projects add column if not exists contractor_email text;

alter table public.projects add column if not exists contractor_website text;
