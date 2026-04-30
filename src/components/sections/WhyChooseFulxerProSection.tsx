import React from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaBrain, FaChartPie } from 'react-icons/fa';

const advantages = [
  {
    icon: FaLock,
    title: 'Secure Infrastructure',
    description: 'Your financial data and assets are safeguarded by advanced security protocols and encryption.',
  },
  {
    icon: FaBrain,
    title: 'AI-Powered Insights',
    description: 'Leverage artificial intelligence to gain predictive insights and optimize your investment strategies.',
  },
  {
    icon: FaChartPie,
    title: 'Diversified Investment Options',
    description: 'Access a broad spectrum of assets from crypto to real estate, all from a single platform.',
  },
];

const WhyChooseFulxerProSection: React.FC = () => {
  return (
    <section id="why-us" className="py-20 md:py-32 bg-primary-dark relative z-10">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-text-light mb-4">Why Choose FulxerPro?</h2>
        <p className="text-lg text-text-dark max-w-2xl mx-auto mb-16">
          Unparalleled advantages that set us apart in the world of intelligent investing.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              className="bg-primary-light rounded-xl p-8 shadow-card-glow border border-border-color transform hover:-translate-y-2 transition-all duration-300 group"
              whileHover={{ scale: 1.03, boxShadow: "0 0px 40px rgba(79, 70, 229, 0.35)" }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="text-accent-purple text-5xl mb-6 group-hover:text-accent-blue transition-colors duration-300">
                <advantage.icon className="mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-text-light mb-3">{advantage.title}</h3>
              <p className="text-text-dark leading-relaxed">{advantage.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseFulxerProSection;