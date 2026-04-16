-- Сид для локальной разработки: выполняется после миграций (`supabase db reset`).
-- Тестовый вход: dev@example.com / devpassword
-- Стабильный owner_id для привязки мок-проектов:

create extension if not exists pgcrypto;

do $$
declare
  seed_user_id uuid := 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  v_pw text := crypt('devpassword', gen_salt('bf'));
begin
  insert into auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) values (
    seed_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'dev@example.com',
    v_pw,
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now()
  )
  on conflict (id) do nothing;

  insert into auth.identities (
    id,
    user_id,
    identity_data,
    provider,
    provider_id,
    last_sign_in_at,
    created_at,
    updated_at
  )
  select
    gen_random_uuid(),
    seed_user_id,
    format('{"sub":"%s","email":"dev@example.com"}', seed_user_id)::jsonb,
    'email',
    seed_user_id::text,
    now(),
    now(),
    now()
  where not exists (
    select 1
    from auth.identities i
    where i.user_id = seed_user_id
      and i.provider = 'email'
  );
end $$;

-- Моки из src/shared/store/projects.ts (owner_id = сид-пользователь выше)
insert into public.projects (
  id,
  active,
  address,
  contractor,
  customer,
  type,
  name,
  owner_id
) values
  (
    5,
    true,
    'г. Москва, ул. Тверская, д. 12, кв. 45',
    'ООО «СтройМастер»',
    'Иванова Мария',
    'building',
    'Квартира на Тверской',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid
  ),
  (
    4,
    true,
    'Московская обл., Одинцовский р-н, пос. Горки-2',
    null,
    'Мельникова Светлана',
    'home',
    'Загородный дом Рублёвка',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid
  ),
  (
    3,
    true,
    'г. Краснодар, ул. Беличенок, д. 88, кв. 657',
    null,
    'Красовский Игорь',
    'building',
    'Квартира ЖК Самолет',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid
  ),
  (
    2,
    false,
    'г. Краснодар, ст. Елизаветнинская, д. 7',
    'ИП Мельников А.А.',
    'Смирнов Павел',
    'home',
    'Дом в Елизаветке',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid
  ),
  (
    1,
    false,
    'г. Екатеринбург, ул. Московская, д. 8, кв. 21',
    'ООО «МонолитСервис»',
    'Саркисян Армен',
    'building',
    'Квартира на Московской',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid
  ),
  (
    0,
    false,
    'Краснодарский край, п. Лазаревское, ул. Морская, д. 2',
    'ИП Козлов Д.Н.',
    'Волкова Анна',
    'home',
    'Дом у моря',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid
  )
on conflict (id) do nothing;
