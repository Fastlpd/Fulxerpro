import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-slate-950 bg-opacity-90 backdrop-blur-md border-b border-slate-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-2xl font-bold text-gradient">FulxerPro</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#hero" className="text-gray-300 hover:text-indigo-400 transition-colors duration-300 font-medium">Home</a>
          <a href="#features" className="text-gray-300 hover:text-indigo-400 transition-colors duration-300 font-medium">Features</a>
          <a href="#market" className="text-gray-300 hover:text-indigo-400 transition-colors duration-300 font-medium">Markets</a>
          <a href="#why-us" className="text-gray-300 hover:text-indigo-400 transition-colors duration-300 font-medium">Why Choose Us</a>
          <a href="#testimonials" className="text-gray-300 hover:text-indigo-400 transition-colors duration-300 font-medium">Testimonials</a>
        </div>
        <div className="hidden md:flex gap-4">
          <motion.button
            className="px-6 py-2 text-indigo-400 border border-indigo-400 rounded-lg font-semibold hover:bg-indigo-400/10 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Log In
          </motion.button>
          <motion.button
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </div>
        {/* Mobile menu button */}
        <div className="md:hidden">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-300 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden bg-slate-900 border-t border-slate-800 px-6 py-4 space-y-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <a href="#hero" className="block text-gray-300 hover:text-indigo-400 transition-colors">Home</a>
          <a href="#features" className="block text-gray-300 hover:text-indigo-400 transition-colors">Features</a>
          <a href="#market" className="block text-gray-300 hover:text-indigo-400 transition-colors">Markets</a>
          <a href="#why-us" className="block text-gray-300 hover:text-indigo-400 transition-colors">Why Choose Us</a>
          <a href="#testimonials" className="block text-gray-300 hover:text-indigo-400 transition-colors">Testimonials</a>
          <div className="flex gap-2 pt-4">
            <button className="flex-1 px-4 py-2 text-indigo-400 border border-indigo-400 rounded-lg text-sm font-semibold">Log In</button>
            <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold">Sign Up</button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;