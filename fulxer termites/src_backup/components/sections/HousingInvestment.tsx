import React from 'react';
import { motion } from 'framer-motion';

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

const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.2,
        type: 'spring',
        stiffness: 150,
      },
    }),
  };

const HousingInvestment: React.FC = () => {
  return (
    <section id="housing-investments" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Real Estate Investments</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-blue-gray-900 sm:text-4xl">
            Build Your Foundation in Property
          </p>
          <p className="mt-4 max-w-2xl text-xl text-blue-gray-500 mx-auto">
            Invest in a diverse portfolio of vetted residential and commercial properties with high growth potential.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((prop, i) => (
            <motion.div
              key={prop.name}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-blue-gray-100 flex flex-col"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
            >
              <div className="relative">
                <img className="h-64 w-full object-cover" src={prop.imageUrl} alt={prop.name} />
                <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent w-full p-4">
                    <h3 className="text-2xl font-bold text-white">{prop.name}</h3>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-blue-gray-600 flex-grow"><span className='font-semibold text-blue-gray-700'>Architecture:</span> {prop.architecture}</p>
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-3xl font-bold text-primary">{prop.price}</span>
                    <motion.button
                        className="py-2 px-6 rounded-lg font-semibold bg-primary text-white hover:bg-primary-hover transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Invest Now
                    </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HousingInvestment;
