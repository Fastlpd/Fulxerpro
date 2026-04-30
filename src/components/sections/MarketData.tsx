import { motion } from 'framer-motion';
import { FiTrendingUp, FiHome, FiTruck, FiBarChart } from 'react-icons/fi';

const marketCards = [
  {
    title: "Crypto Prices",
    icon: <FiBarChart className="text-5xl text-primary" />,
    description: "Real-time prices from major crypto exchanges.",
    shadowColor: "shadow-primary/50",
  },
  {
    title: "Stock Highlights",
    icon: <FiTrendingUp className="text-5xl text-accent" />,
    description: "Top gainers and losers in the stock market today.",
    shadowColor: "shadow-accent/50",
  },
  {
    title: "Real Estate Returns",
    icon: <FiHome className="text-5xl text-primary" />,
    description: "Average returns on real estate investments.",
    shadowColor: "shadow-primary/50",
  },
  {
    title: "Auto Investment Plans",
    icon: <FiTruck className="text-5xl text-accent" />,
    description: "Investment plans for auto dealerships.",
    shadowColor: "shadow-accent/50",
  }
];

const MarketData = () => {
  return (
    <section id="market" className="py-24 bg-background text-text">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold">Live Market Section</h2>
            <p className="mt-4 max-w-2xl text-xl text-text-secondary mx-auto">
                Stay updated with real-time data from various investment markets.
            </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {marketCards.map((card, index) => (
            <motion.div
              key={index}
              className={`p-8 rounded-2xl bg-secondary/50 backdrop-blur-lg border border-border transition-all duration-300`}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 0 25px ${card.shadowColor}`,
                borderColor: "rgba(255, 255, 255, 0.5)"
              }}
            >
              <div className="mb-6 flex justify-center">
                {card.icon}
              </div>
              <h3 className="text-2xl font-bold text-center mb-4">{card.title}</h3>
              <p className="text-text-secondary text-center">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketData;
