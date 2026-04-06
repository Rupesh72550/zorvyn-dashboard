import { useAppContext } from '../context/AppContext';
import { useMemo } from 'react';

export const useFinance = () => {
  const { transactions, stats } = useAppContext();

  const insights = useMemo(() => {
    if (transactions.length === 0) return null;

    return {
      highestCategory: stats.highestCategory,
      totalTransactions: stats.totalCount,
      averageExpense: stats.averageExpense,
      monthlyComparison: stats.monthlyComparison,
    };
  }, [transactions, stats]);

  return { insights, stats };
};
