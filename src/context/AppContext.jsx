import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { initialTransactions } from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem('finance_role') || 'Admin';
  });

  const [filters, setFilters] = useState({
    search: '',
    type: 'All',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('finance_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [isLoading, setIsLoading] = useState(true);

  // Persist data
  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('finance_role', role);
  }, [role]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Theme synchronization
  useEffect(() => {
    localStorage.setItem('finance_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const addTransaction = (transaction) => {
    setTransactions((prev) => [{ ...transaction, id: Date.now().toString() + Math.random().toString(36).substr(2, 9) }, ...prev]);
  };

  const updateTransaction = (updated) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch = t.category.toLowerCase().includes(filters.search.toLowerCase()) || 
                             t.description?.toLowerCase().includes(filters.search.toLowerCase());
        const matchesType = filters.type === 'All' || t.type === filters.type;
        return matchesSearch && matchesType;
      })
      .sort((a, b) => {
        const factor = filters.sortOrder === 'asc' ? 1 : -1;
        if (filters.sortBy === 'date') {
          return (new Date(a.date) - new Date(b.date)) * factor;
        }
        if (filters.sortBy === 'amount') {
          return (a.amount - b.amount) * factor;
        }
        return 0;
      });
  }, [transactions, filters]);

  const stats = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'Income')
      .reduce((acc, t) => acc + t.amount, 0);
    const expensesList = transactions.filter((t) => t.type === 'Expense');
    const expenses = expensesList.reduce((acc, t) => acc + t.amount, 0);
    
    // Insights Logic
    let highestCategory = 'N/A';
    if (expensesList.length > 0) {
      const categoryMap = expensesList.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
      highestCategory = Object.entries(categoryMap).reduce((a, b) => (b[1] > a[1] ? b : a))[0];
    }

    return {
      totalBalance: income - expenses,
      totalIncome: income,
      totalExpenses: expenses,
      averageExpense: expensesList.length > 0 ? expenses / expensesList.length : 0,
      totalCount: transactions.length,
      highestCategory,
      monthlyComparison: 15 // Placeholder as per original hook
    };
  }, [transactions]);

  const value = {
    transactions,
    filteredTransactions,
    role,
    setRole,
    filters,
    setFilters,
    isLoading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    stats,
    theme,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
