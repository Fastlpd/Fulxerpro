import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaShieldAlt, FaTachometerAlt, FaRobot } from 'react-icons/fa';

const features = [
  {
    icon: FaChartLine,
    title: 'Real-Time Analytics',
    description: 'Access live market data and insightful analytics to make informed decisions.',
  },
  {
    icon: FaShieldAlt,
    title: 'Bank-Grade Security',
    description: 'Your assets are protected with state-of-the-art encryption and security protocols.',
  },
  {
    icon: FaTachometerAlt,
    title: 'Smart Investment Dashboard',
    description: 'A personalized, intuitive dashboard to manage all your investments in one place.',
  },
  {
    icon: FaRobot,
    title: 'Automated Profit Distribution',
    description: 'Set up automated strategies to reinvest profits and optimize your returns.',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 md:py-32 bg-slate-950 relative z-10">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Unleash Your Potential with FulxerPro</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-16">
            Experience cutting-edge features designed to elevate your investment journey and secure your financial future.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-slate-900 rounded-xl p-8 shadow-lg border border-slate-800 transform hover:border-indigo-500 transition-all duration-300 group"
              whileHover={{ scale: 1.05, boxShadow: "0 0px 40px rgba(79, 70, 229, 0.35)" }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-indigo-400 text-5xl mb-6 group-hover:text-purple-400 transition-colors duration-300">
                <feature.icon className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;