-- Blog likes and comments. Paste all of this into Supabase: your project > SQL Editor > New query > Run.
-- Running it again is safe; it only creates what's missing.

create table if not exists public.comments (
  id bigint generated always as identity primary key,
  slug text not null,                                   -- which post, e.g. how-i-got-into-tech
  parent_id bigint references public.comments (id) on delete cascade,  -- set on my replies
  name text not null check (char_length(name) between 1 and 60),
  body text not null check (char_length(body) between 1 and 2000),
  is_author boolean not null default false,             -- true on my replies
  hidden boolean not null default false,                -- hidden from the post, kept in admin
  seen boolean not null default false,                  -- false until I've looked at it in admin
  ip_hash text,                                          -- a scrambled visitor fingerprint, for the spam limit
  created_at timestamptz not null default now()
);
create index if not exists comments_slug_created_idx on public.comments (slug, created_at);

create table if not exists public.likes (
  slug text not null,
  visitor_id uuid not null,                              -- a random id kept in the reader's browser
  created_at timestamptz not null default now(),
  primary key (slug, visitor_id)
);

-- Lock both tables: with no policies, nobody can read or write them from a browser.
-- Only the website's server, using the secret key, gets through.
alter table public.comments enable row level security;
alter table public.likes enable row level security;
