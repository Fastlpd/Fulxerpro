import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import Scene from '../canvas/Scene';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
  },
};

const Hero = () => {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>
      <motion.main
        className="relative z-10 container mx-auto px-6 pt-32 text-center flex flex-col justify-center items-center h-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 leading-tight"
          variants={itemVariants}
        >
          Your Gateway to Smarter Investments
        </motion.h1>
        <motion.p 
          className="mt-6 text-lg md:text-xl text-gray-300 max-w-3xl mx-auto"
          variants={itemVariants}
        >
          FulxerPro provides cutting-edge tools and real-time data to help you navigate the complexities of the financial market with confidence.
        </motion.p>
        <motion.button 
          className="mt-8 bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/30 flex items-center mx-auto"
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started Now <FiArrowRight className="ml-2" />
        </motion.button>
      </motion.main>
    </div>
  );
};

export default Hero;
