import React from 'react';
import { motion, type Variants } from 'framer-motion';

const properties = [
  {
    name: 'Modern Villa, California',
    architecture: 'Sleek, minimalist design with an open-concept floor plan and floor-to-ceiling windows.',
    price: '$2,500,000',
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop',
  },
  {
    name: 'Urban Loft, New York',
    architecture: 'Industrial-chic with exposed brick, high ceilings, and large factory windows.',
    price: '$1,200,000',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1974&auto=format&fit=crop',
  },
  {
    name: 'Suburban Family Home, Texas',
    architecture: 'Classic American craftsman style with a welcoming porch and spacious backyard.',
    price: '$750,000',
    imageUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop',
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

const HousingInvestment: React.FC = () => {
  return (
    <section id="housing-investments" className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-black py-24 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,197,94,0.15),_transparent_25%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.12),_transparent_30%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-200 mb-4">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Real Estate Investments
          </div>
          <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl mb-4">
            Build Your Foundation in Property
          </h2>
          <p className="max-w-3xl text-xl text-gray-400 mx-auto">
            Invest in a diverse portfolio of vetted residential and commercial properties with high growth potential. Secure your future in prime locations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((prop, i) => (
            <motion.div
              key={prop.name}
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
                  src={prop.imageUrl}
                  alt={prop.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 right-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-lg py-2 px-4 rounded-full shadow-lg">
                  {prop.price}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-2">{prop.name}</h3>
                  <p className="text-gray-300 text-sm">{prop.architecture}</p>
                </div>
              </div>
              <div className="p-6">
                <motion.button
                  className="w-full py-4 px-6 rounded-2xl font-semibold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20 transition-all hover:shadow-xl hover:scale-105"
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

export default HousingInvestment;
