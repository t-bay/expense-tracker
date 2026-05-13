import type { Summary } from '../types';

interface Props {
  summary: Summary;
  currency: string;
}

export function SummaryBar({ summary, currency }: Props) {
  const pct = summary.total_budgeted > 0
    ? Math.min((summary.total_spent / summary.total_budgeted) * 100, 100)
    : 0;

  const barColor = pct >= 100 ? '#dc2626' : pct >= 80 ? '#f59e0b' : '#16a34a';

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '1.5rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>Spent</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111' }}>
            {currency} {summary.total_spent.toFixed(2)}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>Budgeted</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111' }}>
            {currency} {summary.total_budgeted.toFixed(2)}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>Remaining</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: summary.remaining >= 0 ? '#16a34a' : '#dc2626' }}>
            {currency} {summary.remaining.toFixed(2)}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.25rem' }}>Expenses</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: '#111' }}>
            {summary.expense_count}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#f3f4f6', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          backgroundColor: barColor,
          borderRadius: '999px',
          transition: 'width 0.3s ease'
        }} />
      </div>
      <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '0.25rem', textAlign: 'right' }}>
        {pct.toFixed(0)}% of budget used
      </div>
    </div>
  );
}