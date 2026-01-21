import { motion, type Variants } from 'framer-motion';
import { FiTrendingUp, FiLock, FiBarChart2 } from 'react-icons/fi';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const featureVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      stiffness: 100,
      damping: 20,
    },
  },
};

const Features = () => {
  return (
    <motion.section
      className="py-24 bg-gradient-to-b from-gray-900 to-black"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container mx-auto px-6">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16 text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Why Choose Argentum
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <motion.div
            className="bg-gray-800/50 backdrop-blur-md p-10 rounded-3xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 shadow-xl hover:shadow-purple-500/20"
            variants={featureVariants}
          >
            <FiTrendingUp className="text-6xl text-purple-400 mb-6 mx-auto" />
            <h3 className="text-2xl font-bold mb-4 text-white text-center">
              Real-time Analytics
            </h3>
            <p className="text-gray-300 text-center">
              Stay ahead of the market with up-to-the-second data and powerful insights.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            className="bg-gray-800/50 backdrop-blur-md p-10 rounded-3xl border border-gray-700 hover:border-pink-500/50 transition-all duration-300 shadow-xl hover:shadow-pink-500/20"
            variants={featureVariants}
          >
            <FiLock className="text-6xl text-pink-500 mb-6 mx-auto" />
            <h3 className="text-2xl font-bold mb-4 text-white text-center">
              Bank-Grade Security
            </h3>
            <p className="text-gray-300 text-center">
              Your investments and data are protected with world-class security protocols.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            className="bg-gray-800/50 backdrop-blur-md p-10 rounded-3xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 shadow-xl hover:shadow-purple-500/20"
            variants={featureVariants}
          >
            <FiBarChart2 className="text-6xl text-purple-400 mb-6 mx-auto" />
            <h3 className="text-2xl font-bold mb-4 text-white text-center">
              Customizable Dashboards
            </h3>
            <p className="text-gray-300 text-center">
              Tailor your workspace to focus on the metrics and markets that matter most to you.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Features;