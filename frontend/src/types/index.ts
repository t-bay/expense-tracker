export type CurrencyCode = 'NGN' | 'CAD' | 'USD' | 'GBP' | 'AED';

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  is_default: boolean;
  user_id: string | null;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  category_id: string;
  recurring_id: string | null;
  amount: number;
  currency: CurrencyCode;
  description: string | null;
  date: string;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  currency: CurrencyCode;
  month: number;
  year: number;
  created_at: string;
  updated_at: string;
}

export interface Recurring {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  currency: CurrencyCode;
  description: string | null;
  frequency: 'monthly';
  start_date: string;
  end_date: string | null;
  next_due: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Summary {
  month: number;
  year: number;
  total_spent: number;
  total_budgeted: number;
  remaining: number;
  spent_by_category: Record<string, number>;
  expense_count: number;
}