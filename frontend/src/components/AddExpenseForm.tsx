import { useState } from 'react';
import type { Category } from '../types';
import { useCreateExpense } from '../hooks/useApi';

interface Props {
  categories: Category[];
}

const CURRENCIES = ['CAD', 'USD', 'GBP', 'NGN', 'AED'];

export function AddExpenseForm({ categories }: Props) {
  const [open, setOpen] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('CAD');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);

  const createExpense = useCreateExpense();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!categoryId || !amount || !date) {
      setError('Category, amount, and date are required.');
      return;
    }

    try {
      await createExpense.mutateAsync({
        category_id: categoryId,
        amount: parseFloat(amount),
        currency,
        description: description || undefined,
        date
      });
      setAmount('');
      setDescription('');
      setCategoryId('');
      setOpen(false);
    } catch {
      setError('Failed to add expense. Please try again.');
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          marginBottom: '1.5rem',
          padding: '0.75rem 1.5rem',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: 500
        }}
      >
        + Add Expense
      </button>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '1.5rem'
    }}>
      <h3 style={{ margin: '0 0 1rem', fontSize: '1rem' }}>Add Expense</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem' }}
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="0.01"
              step="0.01"
              placeholder="0.00"
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem' }}
            >
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Description (optional)</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was this for?"
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem' }}
          />
        </div>

        {error && (
          <div style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="submit"
            disabled={createExpense.isPending}
            style={{
              padding: '0.6rem 1.25rem',
              backgroundColor: createExpense.isPending ? '#999' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: createExpense.isPending ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem'
            }}
          >
            {createExpense.isPending ? 'Saving...' : 'Save Expense'}
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); setError(null); }}
            style={{
              padding: '0.6rem 1.25rem',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}