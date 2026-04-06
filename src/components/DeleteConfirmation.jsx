import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const DeleteConfirmation = ({ id, onClose }) => {
  const { deleteTransaction } = useAppContext();

  const handleDelete = () => {
    deleteTransaction(id);
    onClose();
  };

  return (
    <AnimatePresence>
      {id && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative z-50 w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-6"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-full flex items-center justify-center mb-4">
                <AlertCircle size={32} />
              </div>
              
              <h3 className="text-xl font-bold text-black dark:text-white">Delete Transaction?</h3>
              <p className="text-gray-700 dark:text-gray-300 mt-2 font-bold leading-relaxed">
                This action cannot be undone. Are you sure you want to permanently remove this record?
              </p>
              
              <div className="grid grid-cols-2 gap-3 w-full mt-8">
                <button 
                  onClick={onClose}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleDelete}
                  className="btn btn-danger bg-red-600 text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            >
              <X size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmation;
