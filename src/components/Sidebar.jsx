import React from 'react';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ListOrdered, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { role } = useAppContext();
  
  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', active: true },
    { icon: ListOrdered, label: 'Transactions', active: false },
    { icon: CreditCard, label: 'Budgets', active: false },
    { icon: TrendingDown, label: 'Savings', active: false },
    { icon: Settings, label: 'Settings', active: false, adminOnly: true },
  ].filter(item => !item.adminOnly || role === 'Admin');

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isOpen ? 256 : 80 }}
      className="fixed left-0 top-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transition-colors"
    >
      <div className="p-6 flex items-center justify-between">
        {isOpen && (
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold text-primary-600 dark:text-primary-400"
          >
            Zorvyn
          </motion.h1>
        )}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-black dark:text-gray-300"
        >
          {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <nav className="mt-8 px-4 space-y-2">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
              item.active 
              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-400 shadow-sm' 
              : 'text-gray-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
            }`}
          >
            <item.icon size={24} />
            {isOpen && (
              <span className={`font-bold transition-all ${
                item.active 
                ? 'text-primary-800 dark:text-primary-400' 
                : 'text-black dark:text-gray-300 group-hover:text-black dark:group-hover:text-white'
              }`}>
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-6 w-full px-4">
        <button className="w-full flex items-center gap-4 p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">
          <LogOut size={24} />
          {isOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
