import { useState } from 'react';
import type { Recurring, Category } from '../types';
import { useCreateRecurring, useDeleteRecurring } from '../hooks/useApi';

interface Props {
  recurring: Recurring[];
  categories: Category[];
}

const CURRENCIES = ['CAD', 'USD', 'GBP', 'NGN', 'AED'];

export function RecurringList({ recurring, categories }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('CAD');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState<string | null>(null);

  const createRecurring = useCreateRecurring();
  const deleteRecurring = useDeleteRecurring();

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat ? `${cat.icon ?? ''} ${cat.name}` : 'Unknown';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!categoryId || !amount || !startDate) {
      setError('Category, amount, and start date are required.');
      return;
    }

    try {
      await createRecurring.mutateAsync({
        category_id: categoryId,
        amount: parseFloat(amount),
        currency,
        description: description || undefined,
        start_date: startDate
      });
      setAmount('');
      setDescription('');
      setCategoryId('');
      setShowForm(false);
    } catch {
      setError('Failed to create recurring expense.');
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
        <h3 style={{ margin: 0, fontSize: '1rem' }}>Recurring Expenses</h3>
        {!showForm && (
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
            + Add Recurring
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.4rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem' }}
                >
                  <option value="">Select</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.4rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem' }}
                />
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
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Description (optional)</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Monthly mortgage"
                style={{ width: '100%', padding: '0.4rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem' }}
              />
            </div>
            {error && <div style={{ color: '#dc2626', fontSize: '0.8rem', marginBottom: '0.5rem' }}>{error}</div>}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="submit"
                disabled={createRecurring.isPending}
                style={{
                  padding: '0.4rem 1rem',
                  backgroundColor: createRecurring.isPending ? '#999' : '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: createRecurring.isPending ? 'not-allowed' : 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                {createRecurring.isPending ? 'Saving...' : 'Save'}
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

      {recurring.length === 0 ? (
        <div style={{ padding: '1.5rem', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>
          No recurring expenses set up.
        </div>
      ) : (
        recurring.map((rec, i) => (
          <div
            key={rec.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.875rem 1.5rem',
              borderBottom: i < recurring.length - 1 ? '1px solid #f3f4f6' : 'none'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                {getCategoryName(rec.category_id)}
              </span>
              {rec.description && (
                <span style={{ fontSize: '0.8rem', color: '#666' }}>{rec.description}</span>
              )}
              <span style={{ fontSize: '0.75rem', color: '#999' }}>
                Monthly • Next: {rec.next_due} • {rec.is_active ? '🟢 Active' : '🔴 Inactive'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                {rec.currency} {rec.amount.toFixed(2)}
              </span>
              <button
                onClick={() => deleteRecurring.mutate(rec.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#dc2626',
                  fontSize: '0.8rem',
                  padding: '0.25rem'
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}