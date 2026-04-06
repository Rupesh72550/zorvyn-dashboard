import React from 'react';
import { useAppContext } from '../context/AppContext';
import { User, Download, Sun, Moon, Plus, ChevronDown } from 'lucide-react';
import { exportToCSV, exportToJSON } from '../utils/exportData';
import { useState, useRef, useEffect } from 'react';

const Header = () => {
  const { role, setRole, transactions, filteredTransactions, theme, toggleTheme } = useAppContext();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  const handleExport = (type) => {
    if (type === 'json') exportToJSON(filteredTransactions);
    else exportToCSV(filteredTransactions);
    setIsProfileOpen(false);
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-black dark:text-white">Zorvyn Dashboard</h2>
        <p className="text-gray-700 dark:text-gray-300 mt-1 font-medium">Track your growth and simplify your financial management.</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Role Switcher */}
        <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-slate-900 border border-gray-300 dark:border-slate-800 rounded-xl shadow-sm">
          <button 
            onClick={() => setRole('Viewer')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
              role === 'Viewer' 
              ? 'bg-white dark:bg-slate-800 text-black dark:text-white shadow-sm' 
              : 'text-gray-700 hover:bg-white/50 dark:hover:bg-slate-800'
            }`}
          >
            Viewer
          </button>
          <button 
            onClick={() => setRole('Admin')}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
              role === 'Admin' 
              ? 'bg-white dark:bg-slate-800 text-black dark:text-white shadow-sm' 
              : 'text-gray-700 hover:bg-white/50 dark:hover:bg-slate-800'
            }`}
          >
            Admin
          </button>
        </div>

        <button 
          onClick={toggleTheme}
          className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-sm"
            title="Download Data"
          >
            <Download size={20} />
          </button>
          
          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Export Data</p>
              </div>
              <button 
                onClick={() => handleExport('csv')}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Download size={16} className="text-primary-600" /> Download CSV
              </button>
              <button 
                onClick={() => handleExport('json')}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <Download size={16} className="text-primary-600" />
                </div> Download JSON
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
