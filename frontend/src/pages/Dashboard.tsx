import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useExpenses, useCategories, useSummary, useBudgets, useRecurring } from '../hooks/useApi';
import { SummaryBar } from '../components/SummaryBar';
import { AddExpenseForm } from '../components/AddExpenseForm';
import { ExpenseList } from '../components/ExpenseList';
import { BudgetOverview } from '../components/BudgetOverview';
import { RecurringList } from '../components/RecurringList';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [tab, setTab] = useState<'expenses' | 'budgets' | 'recurring'>('expenses');

  const { data: categories = [], isLoading: catsLoading } = useCategories();
  const { data: expenses = [], isLoading: expLoading } = useExpenses(month, year);
  const { data: summary, isLoading: sumLoading } = useSummary(month, year);
  const { data: budgets = [], isLoading: budLoading } = useBudgets(month, year);
  const { data: recurring = [], isLoading: recLoading } = useRecurring();

  const isLoading = catsLoading || expLoading || sumLoading || budLoading || recLoading;

  const tabStyle = (active: boolean) => ({
    padding: '0.5rem 1.25rem',
    backgroundColor: active ? '#2563eb' : 'white',
    color: active ? 'white' : '#666',
    border: active ? '1px solid #2563eb' : '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer' as const,
    fontSize: '0.9rem',
    fontWeight: active ? 600 : 400
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <nav style={{
        backgroundColor: 'white',
        padding: '1rem 2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.25rem' }}>💰 Expense Tracker</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.9rem', color: '#666' }}>{user?.email}</span>
          <button
            onClick={signOut}
            style={{
              padding: '0.4rem 1rem',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Sign out
          </button>
        </div>
      </nav>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>

        {/* Month selector */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', alignItems: 'center' }}>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem' }}
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.9rem' }}
          >
            {[2024, 2025, 2026].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>Loading...</div>
        ) : (
          <>
            {summary && <SummaryBar summary={summary} currency="CAD" />}

            {/* Tab navigation */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <button onClick={() => setTab('expenses')} style={tabStyle(tab === 'expenses')}>Expenses</button>
              <button onClick={() => setTab('budgets')} style={tabStyle(tab === 'budgets')}>Budgets</button>
              <button onClick={() => setTab('recurring')} style={tabStyle(tab === 'recurring')}>Recurring</button>
            </div>

            {tab === 'expenses' && (
              <>
                <AddExpenseForm categories={categories} />
                <ExpenseList expenses={expenses} categories={categories} />
              </>
            )}

            {tab === 'budgets' && (
              <BudgetOverview
                budgets={budgets}
                categories={categories}
                spentByCategory={summary?.spent_by_category ?? {}}
                month={month}
                year={year}
              />
            )}

            {tab === 'recurring' && (
              <RecurringList recurring={recurring} categories={categories} />
            )}
          </>
        )}
      </main>
    </div>
  );
}