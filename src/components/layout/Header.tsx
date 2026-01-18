import { useState } from 'react';
import { motion } from 'framer-motion';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 bg-gray-900 bg-opacity-80 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <motion.div 
          className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500"
          whileHover={{ scale: 1.05 }}
        >
          FulxerPro
        </motion.div>
        <nav className="hidden md:flex items-center space-x-8">
          {['Features', 'Pricing', 'About'].map((item) => (
            <motion.a
              key={item}
              href="#"
              className="hover:text-purple-400 transition-colors duration-300"
              whileHover={{ y: -2 }}
            >
              {item}
            </motion.a>
          ))}
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <motion.button 
            className="hover:text-purple-400 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
          >
            Login
          </motion.button>
          <motion.button 
            className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-2 rounded-full hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/20"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Sign Up
          </motion.button>
        </div>
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden bg-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {['Features', 'Pricing', 'About', 'Login', 'Sign Up'].map((item) => (
              <a
                key={item}
                href="#"
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
