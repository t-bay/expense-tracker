import type { Expense, Category } from '../types';
import { useDeleteExpense } from '../hooks/useApi';

interface Props {
  expenses: Expense[];
  categories: Category[];
}

export function ExpenseList({ expenses, categories }: Props) {
  const deleteExpense = useDeleteExpense();

  const getCategoryName = (id: string) => {
    const cat = categories.find(c => c.id === id);
    return cat ? `${cat.icon ?? ''} ${cat.name}` : 'Unknown';
  };

  if (expenses.length === 0) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textAlign: 'center',
        color: '#666'
      }}>
        No expenses this month. Add your first one above.
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    }}>
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #f3f4f6' }}>
        <h3 style={{ margin: 0, fontSize: '1rem' }}>This Month</h3>
      </div>
      {expenses.map((expense, i) => (
        <div
          key={expense.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0.875rem 1.5rem',
            borderBottom: i < expenses.length - 1 ? '1px solid #f3f4f6' : 'none',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
              {getCategoryName(expense.category_id)}
            </span>
            {expense.description && (
              <span style={{ fontSize: '0.8rem', color: '#666' }}>{expense.description}</span>
            )}
            <span style={{ fontSize: '0.75rem', color: '#999' }}>{expense.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>
              {expense.currency} {expense.amount.toFixed(2)}
            </span>
            <button
              onClick={() => deleteExpense.mutate(expense.id)}
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
      ))}
    </div>
  );
}