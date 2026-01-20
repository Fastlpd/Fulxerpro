import React from 'react';
import { motion } from 'framer-motion';

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

const CarInvestment: React.FC = () => {
  return (
    <section id="car-investments" className="bg-blue-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Automotive Investments</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-blue-gray-900 sm:text-4xl">
            Drive Your Capital Forward
          </p>
          <p className="mt-4 max-w-2xl text-xl text-blue-gray-500 mx-auto">
            Explore fractional ownership opportunities in a curated collection of luxury and high-performance vehicles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car, i) => (
            <motion.div
              key={car.name}
              className="bg-white rounded-2xl overflow-hidden shadow-lg flex flex-col"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
            >
              <div className="relative">
                <img className="h-64 w-full object-cover" src={car.imageUrl} alt={car.name} />
                <div className="absolute top-0 right-0 bg-primary text-white font-bold text-lg py-2 px-4 m-4 rounded-full">
                  {car.price}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-blue-gray-900">{car.name}</h3>
                <p className="mt-2 text-blue-gray-600 flex-grow">{car.description}</p>
                <motion.button
                  className="mt-6 w-full py-3 px-6 rounded-lg font-semibold text-lg bg-primary text-white hover:bg-primary-hover transition-all duration-300"
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
