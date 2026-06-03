import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExpenseCategory } from '@/lib/expense-context';

export interface BudgetLimit {
  category: ExpenseCategory;
  limit: number;
}

interface BudgetContextValue {
  budgets: BudgetLimit[];
  setBudget: (category: ExpenseCategory, limit: number) => Promise<void>;
  getBudget: (category: ExpenseCategory) => number;
  isLoading: boolean;
}

const BudgetContext = createContext<BudgetContextValue | null>(null);

const BUDGET_KEY = '@nidhi_budgets';

export const BUDGETABLE_CATEGORIES: {
  key: ExpenseCategory;
  label: string;
  icon: string;
  color: string;
}[] = [
  { key: 'food',          label: 'Food',          icon: 'fast-food',     color: '#F97316' },
  { key: 'transport',     label: 'Transport',     icon: 'car',           color: '#0EA5E9' },
  { key: 'health',        label: 'Health',        icon: 'medkit',        color: '#EF4444' },
  { key: 'education',     label: 'Education',     icon: 'school',        color: '#3B82F6' },
  { key: 'rent',          label: 'Rent',          icon: 'home',          color: '#8B5CF6' },
  { key: 'entertainment', label: 'Fun',           icon: 'musical-notes', color: '#EC4899' },
  { key: 'shopping',      label: 'Shopping',      icon: 'bag',           color: '#F59E0B' },
  { key: 'other',         label: 'Other',         icon: 'ellipsis-horizontal', color: '#6B7280' },
];

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [budgets, setBudgets] = useState<BudgetLimit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = async () => {
    try {
      const data = await AsyncStorage.getItem(BUDGET_KEY);
      if (data) setBudgets(JSON.parse(data));
    } catch (e) {
      console.error('Failed to load budgets:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveBudgets = async (updated: BudgetLimit[]) => {
    try {
      await AsyncStorage.setItem(BUDGET_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save budgets:', e);
    }
  };

  const setBudget = async (category: ExpenseCategory, limit: number) => {
    const existing = budgets.find(b => b.category === category);
    let updated: BudgetLimit[];
    if (existing) {
      updated = budgets.map(b =>
        b.category === category ? { ...b, limit } : b
      );
    } else {
      updated = [...budgets, { category, limit }];
    }
    setBudgets(updated);
    await saveBudgets(updated);
  };

  const getBudget = (category: ExpenseCategory): number => {
    return budgets.find(b => b.category === category)?.limit ?? 0;
  };

  const value = useMemo(() => ({
    budgets,
    setBudget,
    getBudget,
    isLoading,
  }), [budgets, isLoading]);

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (!context) throw new Error('useBudget must be used within BudgetProvider');
  return context;
}
