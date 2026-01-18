import { motion } from 'framer-motion';
import { FiTrendingUp, FiLock, FiBarChart2 } from 'react-icons/fi';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const featureVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 80,
      delay: 0.2
    },
  },
};

const Features = () => {
  return (
    <motion.section 
      className="container mx-auto px-6 py-24"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      <div className="grid md:grid-cols-3 gap-12">
        <motion.div className="bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300" variants={featureVariants}>
          <FiTrendingUp className="text-5xl text-purple-400 mb-4"/>
          <h3 className="text-2xl font-bold mb-2">Real-time Analytics</h3>
          <p className="text-gray-400">
            Stay ahead of the market with up-to-the-second data and powerful analytics.
          </p>
        </motion.div>
        <motion.div className="bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-pink-500/20 transition-shadow duration-300" variants={featureVariants}>
          <FiLock className="text-5xl text-pink-500 mb-4"/>
          <h3 className="text-2xl font-bold mb-2">Bank-Grade Security</h3>
          <p className="text-gray-400">
            Your investments and data are protected with industry-leading security protocols.
          </p>
        </motion.div>
        <motion.div className="bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300" variants={featureVariants}>
          <FiBarChart2 className="text-5xl text-purple-400 mb-4"/>
          <h3 className="text-2xl font-bold mb-2">Customizable Dashboards</h3>
          <p className="text-gray-400">
            Tailor your workspace to focus on the metrics and markets that matter most to you.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Features;
