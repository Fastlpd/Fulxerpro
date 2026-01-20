import React from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const reviews = [
  {
    name: 'Sarah L.',
    avatar: 'https://i.pravatar.cc/150?u=sarahl',
    rating: 5,
    quote: "The crypto trading tools are top-notch. I've been able to execute both long and short-term strategies with ease. The platform is intuitive and powerful.",
    highlight: 'Crypto Trading',
  },
  {
    name: 'John D.',
    avatar: 'https://i.pravatar.cc/150?u=johnd',
    rating: 5,
    quote: "Using Fulxerpro as a payment holder for car deals has been a game-changer for my business. It's secure, transparent, and my clients love it.",
    highlight: 'Car Deal Escrow',
  },
  {
    name: 'Emily R.',
    avatar: 'https://i.pravatar.cc/150?u=emilyr',
    rating: 5,
    quote: "I've diversified my portfolio with their housing estate investments. The properties are well-vetted, and the potential for returns is fantastic.",
    highlight: 'Housing Estates',
  },
  {
    name: 'Michael B.',
    avatar: 'https://i.pravatar.cc/150?u=michaelb',
    rating: 5,
    quote: "The stock exchange interface is so smooth. I can buy and sell with confidence, and the real-time data helps me make informed decisions.",
    highlight: 'Stock Exchange',
  },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring' } },
  };

const Reviews: React.FC = () => {
  return (
    <section id="reviews" className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-blue-gray-900 sm:text-4xl">Trusted by Investors Worldwide</h2>
          <p className="mt-6 text-lg leading-8 text-blue-gray-600">
            Our platform's versatility and reliability, as told by the people who matter most.
          </p>
        </div>

        <motion.div 
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
        >
          {reviews.map((review) => (
            <motion.div 
                key={review.name} 
                className="flex flex-col rounded-2xl bg-blue-gray-50 p-8 shadow-sm"
                variants={itemVariants}
            >
              <div className="flex items-center gap-x-4">
                <img src={review.avatar} alt={review.name} className="h-12 w-12 rounded-full bg-blue-gray-200" />
                <div>
                  <div className="font-semibold text-blue-gray-900">{review.name}</div>
                  <div className="text-sm text-primary font-semibold">{review.highlight}</div>
                </div>
              </div>
              <blockquote className="mt-6 text-blue-gray-600 flex-grow">
                <p>“{review.quote}”</p>
              </blockquote>
              <div className="mt-6 flex items-center">
                {[...Array(review.rating)].map((_, i) => (
                  <FaStar key={i} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;
