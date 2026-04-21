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

-- Подрядчики и заказчики (связь с проектами через contractor_id / customer_id)
insert into public.contractors (id, name, owner_id) values
  (9001, 'ООО «СтройМастер»', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid),
  (9002, 'ИП Мельников А.А.', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid),
  (9003, 'ООО «МонолитСервис»', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid),
  (9004, 'ИП Козлов Д.Н.', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid)
on conflict (id) do nothing;

insert into public.customers (id, name, owner_id) values
  (9101, 'Иванова Мария', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid),
  (9102, 'Мельникова Светлана', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid),
  (9103, 'Красовский Игорь', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid),
  (9104, 'Смирнов Павел', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid),
  (9105, 'Саркисян Армен', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid),
  (9106, 'Волкова Анна', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid)
on conflict (id) do nothing;

-- Моки из src/shared/store/projects.ts (owner_id = сид-пользователь выше)
insert into public.projects (
  id,
  active,
  address,
  contractor_id,
  customer_id,
  type,
  name,
  owner_id
) values
  (
    5,
    true,
    'г. Москва, ул. Тверская, д. 12, кв. 45',
    9001,
    9101,
    'flat',
    'Квартира на Тверской',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid
  ),
  (
    4,
    true,
    'Московская обл., Одинцовский р-н, пос. Горки-2',
    null,
    9102,
    'house',
    'Загородный дом Рублёвка',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid
  ),
  (
    3,
    true,
    'г. Краснодар, ул. Беличенок, д. 88, кв. 657',
    null,
    9103,
    'flat',
    'Квартира ЖК Самолет',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid
  ),
  (
    2,
    false,
    'г. Краснодар, ст. Елизаветнинская, д. 7',
    9002,
    9104,
    'house',
    'Дом в Елизаветке',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid
  ),
  (
    1,
    false,
    'г. Екатеринбург, ул. Московская, д. 8, кв. 21',
    9003,
    9105,
    'flat',
    'Квартира на Московской',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid
  ),
  (
    0,
    false,
    'Краснодарский край, п. Лазаревское, ул. Морская, д. 2',
    9004,
    9106,
    'house',
    'Дом у моря',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'::uuid
  )
on conflict (id) do nothing;
