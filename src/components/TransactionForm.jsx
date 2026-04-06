import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';

const TransactionForm = ({ isOpen, onClose, transaction, defaultType = 'Expense' }) => {
  const { addTransaction, updateTransaction } = useAppContext();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    category: 'Food',
    type: 'Expense',
    description: '',
  });

  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowSuccess(false);
      setErrors({});
      if (transaction) {
        setFormData(transaction);
      } else {
        setFormData({
          date: new Date().toISOString().split('T')[0],
          amount: '',
          category: 'Food',
          type: defaultType,
          description: '',
        });
      }
    }
  }, [transaction, isOpen, defaultType]);

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.amount || formData.amount <= 0) newErrors.amount = 'Amount must be positive';
    if (!formData.category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    if (transaction) {
      updateTransaction(data);
    } else {
      addTransaction(data);
    }

    setShowSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative z-50 w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-200 dark:border-gray-800 p-5 space-y-4"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
              <h3 className="text-lg font-semibold text-black dark:text-white">
                {transaction ? 'Edit Transaction' : 'Add New Transaction'}
              </h3>
              <button 
                onClick={onClose} 
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
              {showSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex-1 flex flex-col items-center justify-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-4 border-4 border-green-50">
                    <Check size={32} />
                  </div>
                  <h4 className="text-lg font-bold text-black dark:text-white">Successfully Saved!</h4>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mt-1">The record has been updated.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex-1 min-h-0 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 px-1">Date</label>
                        <input 
                          type="date" 
                          required
                          className={`bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all ${errors.date ? 'border-red-500' : ''}`}
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                        {errors.date && <p className="text-[10px] text-red-500 font-bold">{errors.date}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 px-1">Type</label>
                        <div className="flex bg-gray-200 dark:bg-gray-700 p-1 rounded-lg">
                          {['Income', 'Expense'].map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setFormData({ ...formData, type: t })}
                              className={`flex-1 py-2 rounded-md text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                                formData.type === t 
                                ? 'bg-green-600 text-white shadow-md'
                                : 'text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                              }`}
                            >
                              {t === 'Income' ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 px-1">Amount</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          required
                          placeholder="0.00"
                          className={`bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 pl-7 w-full placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all ${errors.amount ? 'border-red-500' : ''}`}
                          value={formData.amount}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        />
                      </div>
                      {errors.amount && <p className="text-[10px] text-red-500 font-bold">{errors.amount}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 px-1">Category</label>
                      <select
                        className="bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 px-1">Description</label>
                      <textarea 
                        placeholder="Add a note..."
                        className="bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 w-full min-h-[100px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    <button 
                      type="submit" 
                      className="bg-green-600 text-white hover:bg-green-700 w-full py-2 rounded-lg font-medium transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      {!transaction && <Plus size={18} />}
                      {transaction ? 'Save Changes' : `Add ${formData.type}`}
                    </button>
                    <button 
                      type="button" 
                      onClick={onClose}
                      className="w-full text-gray-600 dark:text-gray-400 font-medium py-2 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TransactionForm;
