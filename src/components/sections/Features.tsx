import { motion, type Variants } from 'framer-motion';
import { FiTrendingUp, FiLock, FiBarChart2, FiShare2 } from 'react-icons/fi';

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
  hidden: { y: 50, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      stiffness: 100,
      damping: 20,
    },
  },
};

const features = [
  {
    title: "Real-Time Analytics",
    icon: <FiTrendingUp className="text-6xl text-primary mb-6 mx-auto" />,
    description: "Stay ahead of the market with up-to-the-second data and powerful insights.",
    shadowColor: "shadow-primary/50",
  },
  {
    title: "Secure Transactions",
    icon: <FiLock className="text-6xl text-accent mb-6 mx-auto" />,
    description: "Your investments and data are protected with world-class security protocols.",
    shadowColor: "shadow-accent/50",
  },
  {
    title: "Portfolio Tracking",
    icon: <FiBarChart2 className="text-6xl text-primary mb-6 mx-auto" />,
    description: "Tailor your workspace to focus on the metrics and markets that matter most to you.",
    shadowColor: "shadow-primary/50",
  },
  {
    title: "Automated Profit Distribution",
    icon: <FiShare2 className="text-6xl text-accent mb-6 mx-auto" />,
    description: "Receive your profits automatically without any hassle.",
    shadowColor: "shadow-accent/50",
  }
]

const Features = () => {
  return (
    <motion.section
      className="py-24 bg-background text-text"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container mx-auto px-6">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Key Features
        </motion.h2>

        <div className="grid md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-secondary/50 backdrop-blur-lg p-10 rounded-3xl border border-border transition-all duration-300"
              variants={featureVariants}
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 0 25px ${feature.shadowColor}`,
                borderColor: "rgba(255, 255, 255, 0.5)"
              }}
            >
              {feature.icon}
              <h3 className="text-2xl font-bold mb-4 text-text text-center">
                {feature.title}
              </h3>
              <p className="text-text-secondary text-center">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Features;