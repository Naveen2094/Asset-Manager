import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type EntryType = 'income' | 'expense';

export type ExpenseCategory =
  | 'salary'
  | 'business'
  | 'food'
  | 'transport'
  | 'health'
  | 'education'
  | 'rent'
  | 'entertainment'
  | 'shopping'
  | 'other';

export interface ExpenseEntry {
  id: string;
  type: EntryType;
  amount: number;
  category: ExpenseCategory;
  memberId: string;
  memberName: string;
  note: string;
  date: string;
}

interface MonthlySummary {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
}

interface ExpenseContextValue {
  entries: ExpenseEntry[];
  addEntry: (entry: Omit<ExpenseEntry, 'id'>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getMonthlySummary: (year: number, month: number) => MonthlySummary;
  getCurrentMonthSummary: () => MonthlySummary;
  isLoading: boolean;
}

const ExpenseContext = createContext<ExpenseContextValue | null>(null);

const EXPENSE_KEY = '@nidhi_expenses';

export function ExpenseProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<ExpenseEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const data = await AsyncStorage.getItem(EXPENSE_KEY);
      if (data) setEntries(JSON.parse(data));
    } catch (e) {
      console.error('Failed to load expenses:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveEntries = async (updated: ExpenseEntry[]) => {
    try {
      await AsyncStorage.setItem(EXPENSE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save expenses:', e);
    }
  };

  const addEntry = async (entry: Omit<ExpenseEntry, 'id'>) => {
    const newEntry: ExpenseEntry = {
      ...entry,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    const updated = [newEntry, ...entries];
    setEntries(updated);
    await saveEntries(updated);
  };

  const deleteEntry = async (id: string) => {
    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    await saveEntries(updated);
  };

  const getMonthlySummary = (year: number, month: number): MonthlySummary => {
    const filtered = entries.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
    const totalIncome = filtered
      .filter(e => e.type === 'income')
      .reduce((sum, e) => sum + e.amount, 0);
    const totalExpenses = filtered
      .filter(e => e.type === 'expense')
      .reduce((sum, e) => sum + e.amount, 0);
    return { totalIncome, totalExpenses, savings: totalIncome - totalExpenses };
  };

  const getCurrentMonthSummary = (): MonthlySummary => {
    const now = new Date();
    return getMonthlySummary(now.getFullYear(), now.getMonth());
  };

  const value = useMemo(() => ({
    entries,
    addEntry,
    deleteEntry,
    getMonthlySummary,
    getCurrentMonthSummary,
    isLoading,
  }), [entries, isLoading]);

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (!context) throw new Error('useExpenses must be used within ExpenseProvider');
  return context;
}
