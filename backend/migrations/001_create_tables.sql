-- ============================================================
-- Migration 001: Create core tables
-- Project:       Expense Tracker
-- Applied to:    Supabase (PostgreSQL)
-- ============================================================

create extension if not exists "pgcrypto";

create domain currency_code as text
  check (value in ('NGN', 'CAD', 'USD', 'GBP', 'AED'));

create domain frequency_type as text
  check (value in ('monthly'));

create table categories (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  icon         text,
  is_default   boolean not null default false,
  user_id      uuid references auth.users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  constraint categories_unique_name_per_user
    unique nulls not distinct (user_id, name)
);

create table expenses (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  category_id    uuid not null references categories(id) on delete restrict,
  recurring_id   uuid,
  amount         numeric(12,2) not null check (amount > 0),
  currency       currency_code not null,
  description    text,
  date           date not null,
  is_recurring   boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table recurring (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  category_id    uuid not null references categories(id) on delete restrict,
  amount         numeric(12,2) not null check (amount > 0),
  currency       currency_code not null,
  description    text,
  frequency      frequency_type not null default 'monthly',
  start_date     date not null,
  end_date       date,
  next_due       date not null,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint recurring_end_after_start
    check (end_date is null or end_date > start_date)
);

create table budgets (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  category_id    uuid not null references categories(id) on delete restrict,
  amount         numeric(12,2) not null check (amount > 0),
  currency       currency_code not null,
  month          integer not null check (month between 1 and 12),
  year           integer not null check (year >= 2020),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint budgets_unique_per_month
    unique (user_id, category_id, month, year)
);

alter table expenses
  add constraint expenses_recurring_fk
  foreign key (recurring_id) references recurring(id) on delete set null;

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger expenses_updated_at
  before update on expenses
  for each row execute function set_updated_at();

create trigger recurring_updated_at
  before update on recurring
  for each row execute function set_updated_at();

create trigger budgets_updated_at
  before update on budgets
  for each row execute function set_updated_at();

create index idx_expenses_user_id   on expenses(user_id);
create index idx_expenses_date      on expenses(user_id, date desc);
create index idx_expenses_category  on expenses(user_id, category_id);
create index idx_expenses_recurring on expenses(recurring_id) where recurring_id is not null;
create index idx_budgets_user_month on budgets(user_id, year, month);
create index idx_recurring_next_due on recurring(next_due) where is_active = true;
create index idx_recurring_user     on recurring(user_id);
create index idx_categories_default on categories(is_default) where is_default = true;
create index idx_categories_user    on categories(user_id) where user_id is not null;
