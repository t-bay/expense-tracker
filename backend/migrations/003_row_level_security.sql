-- ============================================================
-- Migration 003: Row Level Security policies
-- Project:       Expense Tracker
-- ============================================================

alter table categories  enable row level security;
alter table expenses    enable row level security;
alter table budgets     enable row level security;
alter table recurring   enable row level security;

create policy "categories_select"
  on categories for select to authenticated
  using (is_default = true or user_id = auth.uid());

create policy "categories_insert"
  on categories for insert to authenticated
  with check (user_id = auth.uid() and is_default = false);

create policy "categories_update"
  on categories for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and is_default = false);

create policy "categories_delete"
  on categories for delete to authenticated
  using (user_id = auth.uid());

create policy "expenses_select"
  on expenses for select to authenticated
  using (user_id = auth.uid());

create policy "expenses_insert"
  on expenses for insert to authenticated
  with check (user_id = auth.uid());

create policy "expenses_update"
  on expenses for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "expenses_delete"
  on expenses for delete to authenticated
  using (user_id = auth.uid());

create policy "budgets_select"
  on budgets for select to authenticated
  using (user_id = auth.uid());

create policy "budgets_insert"
  on budgets for insert to authenticated
  with check (user_id = auth.uid());

create policy "budgets_update"
  on budgets for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "budgets_delete"
  on budgets for delete to authenticated
  using (user_id = auth.uid());

create policy "recurring_select"
  on recurring for select to authenticated
  using (user_id = auth.uid());

create policy "recurring_insert"
  on recurring for insert to authenticated
  with check (user_id = auth.uid());

create policy "recurring_update"
  on recurring for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create policy "recurring_delete"
  on recurring for delete to authenticated
  using (user_id = auth.uid());
