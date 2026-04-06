import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  Search, 
  ArrowUpDown, 
  Edit2, 
  Trash2, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar,
  Wallet,
  Plus,
  Download
} from 'lucide-react';
import TransactionForm from './TransactionForm';
import DeleteConfirmation from './DeleteConfirmation';
import { motion, AnimatePresence } from 'framer-motion';
import { exportToCSV, exportToJSON } from '../utils/exportData';

const TransactionTable = () => {
  const { filteredTransactions, filters, setFilters, role } = useAppContext();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [defaultType, setDefaultType] = useState('Expense');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const toggleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'desc' ? 'asc' : 'desc'
    }));
  };

  const isEmpty = filteredTransactions.length === 0;

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-black dark:text-white">Recent Transactions</h3>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Manage your financial records.</p>
        </div>
        
        <div className="flex flex-wrap items-center justify-start md:justify-end gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px] md:w-64">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text"
              placeholder="Search category..."
              className="bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all placeholder-gray-400"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />
          </div>
          
          <select 
            className="bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all text-sm"
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="All">All Types</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => exportToCSV(filteredTransactions)}
              className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-gray-600 dark:text-slate-400 transition-all"
              title="Export CSV"
            >
              <Download size={18} />
            </button>
            <button 
              onClick={() => exportToJSON(filteredTransactions)}
              className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg text-gray-600 dark:text-slate-400 transition-all"
              title="Export JSON"
            >
              <span className="text-xs font-bold px-1">JSON</span>
            </button>
          </div>

          {role === 'Admin' && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  setEditingTransaction(null);
                  setDefaultType('Income');
                  setIsFormOpen(true);
                }}
                className="btn bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-500/20 text-xs px-3"
              >
                <Plus size={16} />
                <span className="hidden lg:inline">Add Income</span>
              </button>
              <button 
                onClick={() => {
                  setEditingTransaction(null);
                  setDefaultType('Expense');
                  setIsFormOpen(true);
                }}
                className="btn bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-500/20 text-xs px-3"
              >
                <Plus size={16} />
                <span className="hidden lg:inline">Add Expense</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-auto max-h-[500px]">
        <table className="w-full text-left border-collapse relative">
          <thead className="sticky top-0 z-10">
            <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
              <th className="px-6 py-4 text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">
                <button onClick={() => toggleSort('date')} className="flex items-center gap-1 hover:text-black transition-colors">
                  Date <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider">Description</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider text-right">
                <button onClick={() => toggleSort('amount')} className="flex items-center gap-1 ml-auto hover:text-black transition-colors">
                  Amount <ArrowUpDown size={14} />
                </button>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            <AnimatePresence mode='popLayout'>
              {isEmpty ? (
                <motion.tr 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-slate-900 border-none"
                >
                  <td colSpan="5" className="px-6 py-20 text-center text-gray-800 italic">
                    <div className="flex flex-col items-center">
                      <Search size={48} className="text-gray-400 dark:text-gray-700 mb-4" />
                    <p className="text-lg font-bold text-black dark:text-white">No transactions match your search</p>
                    <p className="text-sm font-bold text-gray-600 dark:text-gray-400">Try adjusting your filters or adding a new record.</p>
                    </div>
                  </td>
                </motion.tr>
              ) : (
                filteredTransactions.map((t) => (
                  <motion.tr 
                    layout
                    key={t.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300">
                          <Calendar size={16} />
                        </div>
                        <span className="text-sm font-bold text-black dark:text-white">{t.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${
                        t.type === 'Income' 
                        ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[200px] truncate">{t.description || '-'}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className={`flex items-center justify-end gap-1 font-bold ${
                        t.type === 'Income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {t.type === 'Income' ? '+' : '-'} {formatCurrency(t.amount)}
                        {t.type === 'Income' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right min-w-[100px]">
                      {role === 'Admin' && (
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setEditingTransaction(t);
                              setIsFormOpen(true);
                            }}
                            className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-gray-600 dark:text-slate-400 hover:text-primary-600 transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => setDeletingId(t.id)}
                            className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 hover:text-red-600 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <TransactionForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        transaction={editingTransaction}
        defaultType={defaultType}
      />
      
      <DeleteConfirmation 
        id={deletingId} 
        onClose={() => setDeletingId(null)} 
      />
    </div>
  );
};

export default TransactionTable;
