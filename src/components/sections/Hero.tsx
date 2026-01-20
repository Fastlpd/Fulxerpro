import { motion, type Variants } from 'framer-motion';

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      stiffness: 120,
      damping: 20,
    },
  },
};

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-950 to-purple-950 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(139,92,246,0.3)_0%,transparent_50%)]" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        <motion.h1
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight"
        >
          Argentum
        </motion.h1>

        <motion.p
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
          className="text-xl md:text-3xl font-light mb-10 max-w-3xl mx-auto"
        >
          Elevated Wealth Management from Los Angeles
        </motion.p>

        <motion.p
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
        >
          Secure, modern banking and investment services designed for the future — built with trust, powered by innovation.
        </motion.p>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <button className="px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
            Get Started
          </button>
          <button className="px-10 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white font-semibold rounded-full shadow-lg transform hover:scale-105 transition-all duration-300">
            Learn More
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;