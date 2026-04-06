import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

const SummaryCards = () => {
  const { stats } = useAppContext();

  const cards = [
    {
      label: 'Total Balance',
      value: stats.totalBalance,
      icon: Wallet,
      color: 'blue',
      trend: '+2.5%',
    },
    {
      label: 'Total Income',
      value: stats.totalIncome,
      icon: TrendingUp,
      color: 'green',
      trend: '+12%',
    },
    {
      label: 'Total Expenses',
      value: stats.totalExpenses,
      icon: TrendingDown,
      color: 'red',
      trend: '-4%',
    },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <>
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          whileHover={{ y: -5 }}
          className="glass-card p-6 flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
      <div className={`p-3 rounded-xl ${
        card.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400' :
        card.color === 'green' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' :
        'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
      }`}>
              <card.icon size={24} />
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
              card.color === 'red' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' : 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
            }`}>
              {card.trend}
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-bold text-gray-700 dark:text-white uppercase tracking-wide">{card.label}</p>
            <h3 className="text-2xl font-bold mt-2 text-black dark:text-white">
              {formatCurrency(card.value)}
            </h3>
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default SummaryCards;
