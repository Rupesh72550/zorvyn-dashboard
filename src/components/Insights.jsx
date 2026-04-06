import React from 'react';
import { useFinance } from '../hooks/useFinance';
import { useAppContext } from '../context/AppContext';
import { Zap, TrendingUp, Users, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const Insights = () => {
  const { transactions, stats } = useAppContext();

  if (!stats || transactions.length === 0) {
    return (
      <div className="glass-card p-6 h-full flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-500 mb-4">
          <Zap size={24} />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white">No Insights Yet</h3>
        <p className="text-sm text-black dark:text-white mt-2">Add more transactions to see AI-powered observations.</p>
      </div>
    );
  }

  const items = [
    {
      title: 'Top Category',
      value: stats.highestCategory,
      message: `You spent the most on ${stats.highestCategory} this month.`,
      icon: Target,
      color: 'blue'
    },
    {
      title: 'Monthly Shift',
      value: `+${stats.monthlyComparison}%`,
      message: `Your expenses increased by ${stats.monthlyComparison}% compared to last month.`,
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Trans. Count',
      value: stats.totalCount,
      message: `You have recorded a total of ${stats.totalCount} activities this period.`,
      icon: Users,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-4 h-full">
      <h3 className="text-xl font-bold flex items-center gap-2 px-2 text-black dark:text-white">
        <span className="w-1.5 h-6 bg-primary-600 rounded-full" />
        AI Observations
      </h3>
      
      <div className="space-y-4">
        {items.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card p-5"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center text-primary-700 dark:text-primary-400`}>
                <item.icon size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">{item.title}</p>
                <p className="text-lg font-bold text-black dark:text-white">{item.value}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-gray-700 dark:text-gray-400 leading-relaxed font-semibold">
              {item.message}
            </p>
          </motion.div>
        ))}
        
        <div className="p-4 bg-primary-100 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl text-primary-900 dark:text-primary-100 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary-700 dark:text-primary-400">Pro Tip</p>
          <p className="mt-2 text-sm font-bold">
            Setting up a weekly budget for {stats.highestCategory} could help you save up to $200 next month!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Insights;
