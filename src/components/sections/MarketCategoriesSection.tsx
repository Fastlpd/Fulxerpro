import React from 'react';
import { motion } from 'framer-motion';
import { FaBitcoin, FaChartLine, FaHome, FaCar } from 'react-icons/fa';

interface MarketCategory {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}

const marketCategories: MarketCategory[] = [
  {
    icon: FaBitcoin,
    title: 'Crypto Market',
    description: 'Explore volatile digital assets like Bitcoin, Ethereum, and emerging altcoins.',
  },
  {
    icon: FaChartLine,
    title: 'Stock Market',
    description: 'Invest in global companies, from tech giants to emerging market leaders.',
  },
  {
    icon: FaHome,
    title: 'Real Estate',
    description: 'Discover opportunities in property investments, both commercial and residential.',
  },
  {
    icon: FaCar,
    title: 'Automobile Investments',
    description: 'Invest in the lucrative automotive industry, from luxury cars to electric vehicles.',
  },
];

const MarketCategoriesSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-6">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Explore Diverse Investment Opportunities</h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          FulxerPro provides access to a wide range of markets, empowering you to diversify your portfolio.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {marketCategories.map((market, index) => (
          <motion.div
            key={index}
            className="bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-700 hover:border-indigo-500 transform transition-all duration-300 group"
            whileHover={{ scale: 1.05, boxShadow: "0 0px 40px rgba(79, 70, 229, 0.35)" }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="text-indigo-400 text-5xl mb-4 group-hover:text-purple-400 transition-colors duration-300">
              <market.icon className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{market.title}</h3>
            <p className="text-gray-400 leading-relaxed text-sm">{market.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default MarketCategoriesSection;