-- Contact form messages for the portfolio.
--
-- Run this once in the Supabase dashboard: SQL Editor > New query > paste > Run.
--
-- Security model: this table is NOT reachable from the browser. Row Level
-- Security is on and there are deliberately NO policies, and the anon /
-- authenticated grants are revoked. The only writer is the `contact` Edge
-- Function, which uses the service_role key and bypasses RLS.
--
-- This matters: on an existing Supabase project, a new table in `public`
-- starts with select/insert/update/delete already granted to anon. Enabling
-- RLS alone does NOT take those grants back, so skipping the REVOKE below
-- would leave your messages readable (and deletable) by anyone with the
-- public anon key.

create table if not exists public.contact_messages (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null check (char_length(name)    between 1 and 100),
  email      text        not null check (char_length(email)   between 3 and 254),
  message    text        not null check (char_length(message) between 1 and 4000),
  user_agent text,
  created_at timestamptz not null default now()
);

-- Newest first when browsing in the dashboard.
create index if not exists contact_messages_created_at_idx
  on public.contact_messages (created_at desc);

alter table public.contact_messages enable row level security;

revoke all on table public.contact_messages from anon, authenticated;
grant all on table public.contact_messages to service_role;

-- Sanity check: this should list the policies as empty.
--   select policyname from pg_policies where tablename = 'contact_messages';
--
-- Sanity check: this should list zero rows for anon/authenticated roles.
--   set local role anon;
--   select * from public.contact_messages;
--   reset role;
