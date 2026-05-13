import { useState } from 'react';
import type { Budget, Category } from '../types';
import { useCreateBudget } from '../hooks/useApi';

interface Props {
  budgets: Budget[];
  categories: Category[];
  spentByCategory: Record<string, number>;
  month: number;
  year: number;
}

const CURRENCIES = ['CAD', 'USD', 'GBP', 'NGN', 'AED'];

export function BudgetOverview({ budgets, categories, spentByCategory, month, year }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('CAD');
  const [error, setError] = useState<string | null>(null);

  const createBudget = useCreateBudget();

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat ? `${cat.icon ?? ''} ${cat.name}` : 'Unknown';
  };

  const budgetedCategoryIds = budgets.map(b => b.category_id);
  const availableCategories = categories.filter(c => !budgetedCategoryIds.includes(c.id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!categoryId || !amount) {
      setError('Category and amount are required.');
      return;
    }

    try {
      await createBudget.mutateAsync({
        category_id: categoryId,
        amount: parseFloat(amount),
        currency,
        month,
        year
      });
      setAmount('');
      setCategoryId('');
      setShowForm(false);
    } catch {
      setError('Failed to create budget. It may already exist for this category.');
    }
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginTop: '1.5rem',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '1rem 1.5rem',
        borderBottom: '1px solid #f3f4f6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>Budgets</h3>
        {!showForm && availableCategories.length > 0 && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '0.4rem 0.75rem',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            + Set Budget
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.4rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem' }}
                >
                  <option value="">Select</option>
                  {availableCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  style={{ width: '100%', padding: '0.4rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  style={{ width: '100%', padding: '0.4rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem' }}
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            {error && <div style={{ color: '#dc2626', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{error}</div>}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="submit"
                disabled={createBudget.isPending}
                style={{
                  padding: '0.4rem 1rem',
                  backgroundColor: createBudget.isPending ? '#999' : '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: createBudget.isPending ? 'not-allowed' : 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                {createBudget.isPending ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setError(null); }}
                style={{
                  padding: '0.4rem 1rem',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {budgets.length === 0 ? (
        <div style={{ padding: '1.5rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
          No budgets set for this month. Set one to track your spending.
        </div>
      ) : (
        budgets.map((budget, i) => {
          const spent = spentByCategory[budget.category_id] || 0;
          const pct = budget.amount > 0 ? Math.min((spent / budget.amount) * 100, 100) : 0;
          const barColor = pct >= 100 ? '#dc2626' : pct >= 80 ? '#f59e0b' : '#16a34a';

          return (
            <div
              key={budget.id}
              style={{
                padding: '0.875rem 1.5rem',
                borderBottom: i < budgets.length - 1 ? '1px solid #f3f4f6' : 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                  {getCategoryName(budget.category_id)}
                </span>
                <span style={{ fontSize: '0.85rem', color: '#666' }}>
                  {budget.currency} {spent.toFixed(2)} / {budget.amount.toFixed(2)}
                </span>
              </div>
              <div style={{ backgroundColor: '#f3f4f6', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  backgroundColor: barColor,
                  borderRadius: '999px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}