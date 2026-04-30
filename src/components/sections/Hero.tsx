import { motion, type Variants } from 'framer-motion';
import Starfield from '../canvas/Starfield';
import './Hero.css';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(124,58,237,0.1),_transparent_50%),radial-gradient(circle_at_top_left,_rgba(56,189,248,0.08),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.08),_transparent_40%)]" />
        <Starfield />
      </div>

      <motion.div
        className="container mx-auto px-6 relative z-10 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200 mb-8"
        >
          <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
          Premium Investment Platform
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight"
        >
          Invest Smarter.
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mt-2 animate-gradient-x">
            Grow Faster.
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto"
        >
          Your gateway to intelligent investments in crypto, stocks, real estate, and automobiles. We provide the tools and expertise to help you navigate the future of finance with confidence.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <motion.button
            className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 rounded-2xl text-lg font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:shadow-xl hover:scale-105"
            whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(124, 58, 237, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            Start Investing
          </motion.button>
          <motion.button
            className="bg-transparent border-2 border-white/20 px-8 py-4 rounded-2xl text-lg font-semibold text-white hover:bg-white/10 hover:border-white/40 transition-all transform hover:scale-105 backdrop-blur-sm"
            whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            View Markets
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

