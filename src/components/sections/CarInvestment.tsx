import React from 'react';
import { motion, type Variants } from 'framer-motion';

const cars = [
  {
    name: 'Bentley Continental GT',
    description: 'A stunning example of British luxury and performance. A timeless investment.',
    price: '$250,000',
    imageUrl: 'https://images.unsplash.com/photo-1570356528259-a4473e7d383a?q=80&w=2070&auto=format&fit=crop',
  },
  {
    name: 'Ferrari F8 Tributo',
    description: 'The pinnacle of Italian engineering. Own a piece of motorsport history.',
    price: '$350,000',
    imageUrl: 'https://images.unsplash.com/photo-1612764049760-06ac41d20f6d?q=80&w=1974&auto=format&fit=crop',
  },
  {
    name: 'Mercedes-Benz S-Class',
    description: 'The benchmark for luxury sedans. A sound investment in comfort and technology.',
    price: '$180,000',
    imageUrl: 'https://images.unsplash.com/photo-1599533355422-a398b15878d0?q=80&w=2070&auto=format&fit=crop',
  },
];

const cardVariants: Variants = {
  hidden: { scale: 0.9, opacity: 0, y: 50 },
  visible: (custom: number) => ({
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.2,
      type: 'spring',
      stiffness: 150,
      damping: 20,
    },
  }),
};

const CarInvestment: React.FC = () => {
  return (
    <section id="car-investments" className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-black py-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.15),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.12),_transparent_30%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200 mb-4">
            <span className="h-2 w-2 rounded-full bg-indigo-400" />
            Automotive Investments
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl mb-4">
            Drive Your Capital Forward
          </h2>
          <p className="max-w-3xl text-xl text-gray-400 mx-auto">
            Explore fractional ownership opportunities in a curated collection of luxury and high-performance vehicles. Invest in automotive excellence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car, i) => (
            <motion.div
              key={car.name}
              className="group relative bg-slate-900/90 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl backdrop-blur-xl"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
              whileHover={{ y: -10 }}
            >
              <div className="relative overflow-hidden">
                <img
                  className="h-72 w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src={car.imageUrl}
                  alt={car.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg py-2 px-4 rounded-full shadow-lg">
                  {car.price}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-2">{car.name}</h3>
                  <p className="text-gray-300 text-sm">{car.description}</p>
                </div>
              </div>
              <div className="p-6">
                <motion.button
                  className="w-full py-4 px-6 rounded-2xl font-semibold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20 transition-all hover:shadow-xl hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Invest Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CarInvestment;

