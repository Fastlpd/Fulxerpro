import { motion, type Variants } from 'framer-motion';

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
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-gray-900 via-blue-gray-900 to-black text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.3)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 bg-[radial-gradient(circle_at_80%_90%,rgba(192,192,192,0.2)_0%,transparent_60%)] h-1/2 w-1/2" />
      </div>

      {/* The 3D scene could be placed here as an absolute positioned element */}
      {/* <div className="absolute inset-0 z-0">
        <Canvas>
          <Scene />
        </Canvas>
      </div> */}

      <motion.div 
        className="container mx-auto px-6 relative z-10 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight"
        >
          Unlock Wealth Growth with 
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-silver-light to-primary mt-2">
            Secure, Innovative Investments
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-blue-gray-300 mb-12 max-w-3xl mx-auto"
        >
          Join thousands earning seamlessly with Fulxerpro. We provide the tools and expertise to help you navigate the future of finance with confidence.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <motion.button 
            className="bg-primary px-8 py-3 rounded-full text-lg font-semibold hover:bg-primary-hover transition-all duration-300 shadow-lg shadow-blue-500/30"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Account
          </motion.button>
          <motion.button 
            className="bg-transparent border-2 border-blue-gray-400 px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-gray-800 hover:border-blue-gray-300 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Learn More
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;