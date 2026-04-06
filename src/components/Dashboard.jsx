import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import SummaryCards from './SummaryCards';
import ChartsSection from './ChartsSection';
import TransactionTable from './TransactionTable';
import Insights from './Insights';
import LoadingScreen from './LoadingScreen';
import { useAppContext } from '../context/AppContext';
import { AnimatePresence, motion } from 'framer-motion';

const Dashboard = () => {
  const { isLoading } = useAppContext();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen flex transition-colors duration-300">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className={`flex-1 min-h-screen bg-slate-100 dark:bg-slate-950 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'} p-4 md:p-8`}>
        <div className="max-w-7xl mx-auto space-y-8">
          <Header />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <SummaryCards />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ChartsSection />
              <TransactionTable />
            </div>
            <div className="lg:col-span-1">
              <Insights />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
