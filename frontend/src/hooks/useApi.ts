import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api';
import type { Expense, Category, Budget, Summary, Recurring } from '../types';

const currentMonth = new Date().getMonth() + 1;
const currentYear = new Date().getFullYear();

// ── Categories ────────────────────────────────────────────
export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await apiClient.get('/categories');
      return res.data;
    }
  });
}

// ── Expenses ──────────────────────────────────────────────
export function useExpenses(month = currentMonth, year = currentYear) {
  return useQuery<Expense[]>({
    queryKey: ['expenses', month, year],
    queryFn: async () => {
      const res = await apiClient.get('/expenses', { params: { month, year } });
      return res.data;
    }
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      category_id: string;
      amount: number;
      currency: string;
      description?: string;
      date: string;
    }) => {
      const res = await apiClient.post('/expenses', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    }
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/expenses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    }
  });
}

// ── Budgets ───────────────────────────────────────────────
export function useBudgets(month = currentMonth, year = currentYear) {
  return useQuery<Budget[]>({
    queryKey: ['budgets', month, year],
    queryFn: async () => {
      const res = await apiClient.get('/budgets', { params: { month, year } });
      return res.data;
    }
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      category_id: string;
      amount: number;
      currency: string;
      month: number;
      year: number;
    }) => {
      const res = await apiClient.post('/budgets', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
    }
  });
}

// ── Summary ───────────────────────────────────────────────
export function useSummary(month = currentMonth, year = currentYear) {
  return useQuery<Summary>({
    queryKey: ['summary', month, year],
    queryFn: async () => {
      const res = await apiClient.get('/summary', { params: { month, year } });
      return res.data;
    }
  });
}

// ── Recurring ─────────────────────────────────────────────
export function useRecurring() {
  return useQuery<Recurring[]>({
    queryKey: ['recurring'],
    queryFn: async () => {
      const res = await apiClient.get('/recurring');
      return res.data;
    }
  });
}

export function useCreateRecurring() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      category_id: string;
      amount: number;
      currency: string;
      description?: string;
      start_date: string;
    }) => {
      const res = await apiClient.post('/recurring', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring'] });
    }
  });
}

export function useDeleteRecurring() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/recurring/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring'] });
    }
  });
}