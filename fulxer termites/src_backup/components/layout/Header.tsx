import { useState } from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = ['Investments', 'Market', 'About Us', 'Contact'];

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-blue-gray-900 bg-opacity-80 backdrop-blur-md text-blue-gray-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <motion.div 
          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-silver-light to-primary"
          whileHover={{ scale: 1.05 }}
        >
          FulxerPro
        </motion.div>
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((item) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="hover:text-white transition-colors duration-300"
              whileHover={{ y: -2 }}
            >
              {item}
            </motion.a>
          ))}
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <motion.button 
            className="hover:text-white transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
          >
            Login
          </motion.button>
          <motion.button 
            className="bg-primary px-6 py-2 rounded-full hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-blue-500/20"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-blue-gray-300 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden bg-blue-gray-800 bg-opacity-90"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="block px-3 py-2 rounded-md text-base font-medium text-blue-gray-300 hover:bg-blue-gray-700 hover:text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="border-t border-blue-gray-700 my-2"></div>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-blue-gray-300 hover:bg-blue-gray-700 hover:text-white" onClick={() => setIsMenuOpen(false)}>Login</a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium bg-primary text-white hover:bg-primary-hover" onClick={() => setIsMenuOpen(false)}>Sign Up</a>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
