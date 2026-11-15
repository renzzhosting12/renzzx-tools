-- Run in Supabase SQL Editor. VVIP is assigned manually by an admin.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('member','vvip','admin')),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Users can read their own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "No client role updates" on public.profiles
  for update to authenticated using (false);
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, role) values (new.id, 'member');
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();
-- To grant VVIP, run as project owner in SQL editor:
-- update public.profiles set role = 'vvip' where id = 'AUTH_USER_UUID';
