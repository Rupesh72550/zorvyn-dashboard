import React, { useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

const ChartsSection = () => {
  const { transactions, stats, theme } = useAppContext();

  const lineData = useMemo(() => {
    if (transactions.length === 0) return [];
    
    // Group transactions by date and calculate running balance
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    let runningBalance = 0;
    
    return sorted.map(t => {
      if (t.type === 'Income') runningBalance += t.amount;
      else runningBalance -= t.amount;
      return {
        date: t.date,
        balance: runningBalance
      };
    });
  }, [transactions]);

  const pieData = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'Expense');
    const categoryTotals = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  const COLORS = ['#0ea5e9', '#6366f1', '#a855f7', '#ec4899', '#f43f5e', '#f59e0b', '#10b981'];

  const isEmpty = transactions.length === 0;

  // Dynamic Interpretations
  const balanceTrendText = useMemo(() => {
    if (isEmpty) return "";
    const currentBalance = stats.totalBalance;
    if (currentBalance > 0) return `Your balance is currently positive at $${currentBalance.toFixed(2)}. Track your growth!`;
    return `Your expenses are currently outpacing your income. Consider reviewing your top categories.`;
  }, [isEmpty, stats.totalBalance]);

  const spendingInsightText = useMemo(() => {
    if (pieData.length === 0) return "";
    const top = stats.highestCategory;
    return `Majority of your spending is concentrated in ${top}. Reviewing this could save you more!`;
  }, [pieData.length, stats.highestCategory]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div 
        whileHover={{ y: -2 }}
        className="glass-card p-6 min-h-[350px] flex flex-col"
      >
        <div className="mb-6">
          <h3 className="text-lg font-bold text-black dark:text-white">Balance Trend</h3>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Your financial progress over time.</p>
        </div>

        {isEmpty ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 italic">
            No data available to show trend.
          </div>
        ) : (
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                    color: theme === 'dark' ? '#f8fafc' : '#0f172a'
                  }} 
                  itemStyle={{ color: theme === 'dark' ? '#f8fafc' : '#0f172a' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#0ea5e9" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <p className="mt-4 text-xs font-bold text-gray-600 dark:text-gray-300 italic">
          {balanceTrendText}
        </p>
      </motion.div>

      <motion.div 
        whileHover={{ y: -2 }}
        className="glass-card p-6 min-h-[350px] flex flex-col"
      >
        <div className="mb-6">
          <h3 className="text-lg font-bold text-black dark:text-white">Spending Breakdown</h3>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Expense distribution by category.</p>
        </div>

        {pieData.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 italic">
            No expenses recorded yet.
          </div>
        ) : (
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    backgroundColor: theme === 'dark' ? '#0f172a' : '#ffffff',
                    color: theme === 'dark' ? '#f8fafc' : '#0f172a'
                  }} 
                  itemStyle={{ color: theme === 'dark' ? '#f8fafc' : '#0f172a' }}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
        <p className="mt-4 text-xs font-bold text-gray-600 dark:text-gray-300 italic">
          {spendingInsightText}
        </p>
      </motion.div>
    </div>
  );
};

export default ChartsSection;
