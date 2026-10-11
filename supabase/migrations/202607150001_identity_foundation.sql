begin;

create extension if not exists citext with schema extensions;

create type public.app_locale as enum ('uk', 'en');
create type public.app_theme as enum ('dark', 'light', 'system');
create type public.app_role as enum ('user', 'super_admin');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username extensions.citext,
  display_name text,
  bio text,
  avatar_path text,
  locale public.app_locale not null default 'en',
  country_code text check (country_code is null or country_code ~ '^[A-Z]{2}$'),
  is_public boolean not null default true,
  age_attested_at timestamptz,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint profiles_username_format check (
    username is null or username::text ~ '^[A-Za-z0-9_]{3,24}$'
  ),
  constraint profiles_display_name_length check (
    display_name is null or char_length(display_name) between 1 and 50
  ),
  constraint profiles_bio_length check (bio is null or char_length(bio) <= 500)
);

create unique index profiles_username_unique
  on public.profiles (lower(username::text)) where username is not null and deleted_at is null;
create index profiles_public_username_idx
  on public.profiles (username) where is_public and deleted_at is null;

create table public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  theme public.app_theme not null default 'dark',
  timezone text not null default 'UTC',
  comparison_ai_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'user',
  granted_at timestamptz not null default now(),
  granted_by uuid references auth.users(id) on delete set null,
  primary key (user_id, role)
);

create table public.consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  purpose text not null check (purpose in ('terms', 'privacy', 'analytics', 'ai_improvement', 'email_notifications')),
  policy_version text not null,
  is_granted boolean not null,
  recorded_at timestamptz not null default now(),
  revoked_at timestamptz
);

create index consents_user_purpose_recorded_idx
  on public.consents (user_id, purpose, recorded_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger user_settings_set_updated_at before update on public.user_settings
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_locale public.app_locale;
begin
  requested_locale := case
    when new.raw_user_meta_data ->> 'locale' = 'uk' then 'uk'::public.app_locale
    else 'en'::public.app_locale
  end;

  insert into public.profiles (id, display_name, locale)
  values (new.id, nullif(left(new.raw_user_meta_data ->> 'display_name', 50), ''), requested_locale);
  insert into public.user_settings (user_id) values (new.id);
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.user_roles enable row level security;
alter table public.consents enable row level security;

create policy "public profiles are readable"
on public.profiles for select
using (is_public and deleted_at is null or (select auth.uid()) = id);

create policy "users update their own profile"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "users read their own settings"
on public.user_settings for select to authenticated
using ((select auth.uid()) = user_id);
create policy "users update their own settings"
on public.user_settings for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "users read their own roles"
on public.user_roles for select to authenticated
using ((select auth.uid()) = user_id);

create policy "users read their own consent history"
on public.consents for select to authenticated
using ((select auth.uid()) = user_id);
create policy "users record their own consent"
on public.consents for insert to authenticated
with check ((select auth.uid()) = user_id);

revoke all on public.user_roles from anon, authenticated;
grant select on public.user_roles to authenticated;
grant select on public.profiles to anon, authenticated;
grant update (username, display_name, bio, avatar_path, locale, country_code, is_public, age_attested_at, onboarding_completed_at)
  on public.profiles to authenticated;
grant select, update (theme, timezone, comparison_ai_enabled) on public.user_settings to authenticated;
grant select, insert on public.consents to authenticated;

commit;
