import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [1, 0.8, 1]
        }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="w-16 h-16 rounded-2xl bg-primary-600 flex items-center justify-center mb-6 shadow-xl shadow-primary-500/20"
      >
        <span className="text-2xl font-bold text-slate-100">Z</span>
      </motion.div>
      
      <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div 
          animate={{ x: [-192, 192] }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-48 h-full bg-primary-600 rounded-full"
        />
      </div>
      
      <p className="mt-4 text-black dark:text-gray-300 font-bold animate-pulse">
        Initializing Secure Dashboard...
      </p>
    </div>
  );
};

export default LoadingScreen;
