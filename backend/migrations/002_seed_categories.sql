-- ============================================================
-- Migration 002: Seed default categories
-- Project:       Expense Tracker
-- ============================================================

insert into categories (name, icon, is_default, user_id) values
  ('Food',          '🍽️',  true, null),
  ('Transport',     '🚗',  true, null),
  ('Utilities',     '💡',  true, null),
  ('Childcare',     '👶',  true, null),
  ('Entertainment', '🎬',  true, null),
  ('Shopping',      '🛍️',  true, null),
  ('Savings',       '🏦',  true, null),
  ('Subscriptions', '🔁',  true, null),
  ('Mortgage',      '🏠',  true, null),
  ('Insurance',     '🛡️',  true, null),
  ('Investments',   '📈',  true, null),
  ('Giving',        '🤲',  true, null),
  ('Other',         '📦',  true, null);
