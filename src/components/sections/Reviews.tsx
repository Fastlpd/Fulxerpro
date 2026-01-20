import React from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

interface ReviewProps {
    name: string;
    avatar: string;
    rating: number;
    quote: string;
    highlight: string;
}

const reviews: ReviewProps[] = [
  {
    name: 'Sarah L.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2070&auto=format&fit=crop',
    rating: 5,
    quote: "The crypto trading tools are top-notch. I've been able to execute both long and short-term strategies with ease. The platform is intuitive and powerful.",
    highlight: 'Crypto Trading',
  },
  {
    name: 'John D.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-e695c6ede616?q=80&w=1974&auto=format&fit=crop',
    rating: 5,
    quote: "Using Fulxerpro as a payment holder for car deals has been a game-changer for my business. It's secure, transparent, and my clients love it.",
    highlight: 'Car Deal Escrow',
  },
  {
    name: 'Emily R.',
    avatar: 'https://images.unsplash.com/photo-1508214751196-cdfd4628d084?q=80&w=2070&auto=format&fit=crop',
    rating: 5,
    quote: "I've diversified my portfolio with their housing estate investments. The properties are well-vetted, and the potential for returns is fantastic.",
    highlight: 'Housing Estates',
  },
  {
    name: 'Michael B.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop',
    rating: 5,
    quote: "The stock exchange interface is so smooth. I can buy and sell with confidence, and the real-time data helps me make informed decisions.",
    highlight: 'Stock Exchange',
  },
];

const ReviewCard: React.FC<ReviewProps> = React.memo(({ name, avatar, rating, quote, highlight }) => {
    return (
        <motion.div 
            className="flex flex-col rounded-2xl bg-white p-8 shadow-xl border border-blue-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        >
            <div className="flex items-center gap-x-4 mb-4">
                <img src={avatar} alt={name} className="h-14 w-14 rounded-full object-cover ring-2 ring-primary" />
                <div>
                    <div className="font-bold text-lg text-blue-gray-900">{name}</div>
                    <div className="text-sm text-primary font-semibold">{highlight}</div>
                </div>
            </div>
            <blockquote className="mt-4 text-blue-gray-700 flex-grow leading-relaxed">
                <p>“{quote}”</p>
            </blockquote>
            <div className="mt-6 flex items-center">
                {[...Array(rating)].map((_, i) => (
                    <FaStar key={i} className="h-5 w-5 text-yellow-400" />
                ))}
            </div>
        </motion.div>
    );
});

const Reviews: React.FC = () => {
  return (
    <section id="reviews" className="bg-blue-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">What Our Investors Say</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-blue-gray-900 sm:text-4xl">Trusted by Investors Worldwide</p>
          <p className="mt-6 text-lg leading-8 text-blue-gray-600">
            Hear from our community of investors and learn how Fulxerpro has helped them achieve their financial goals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
