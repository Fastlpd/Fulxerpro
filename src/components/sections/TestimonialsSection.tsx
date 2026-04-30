import React from 'react';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Sarah M.',
    title: 'Fintech Investor',
    review: 'FulxerPro has transformed my investment strategy. The AI-powered insights are incredibly accurate and have helped me make profitable decisions.',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5,
  },
  {
    name: 'John D.',
    title: 'Real Estate Developer',
    review: 'Managing my real estate portfolio has never been easier. The platform is intuitive, and the diversified options are exactly what I needed.',
    avatar: 'https://randomuser.me/api/portraits/men/34.jpg',
    rating: 5,
  },
  {
    name: 'Emily R.',
    title: 'Crypto Enthusiast',
    review: 'Finally, a platform that understands crypto! Real-time analytics and bank-grade security give me peace of mind to invest confidently.',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    rating: 5,
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-6">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Investors Say</h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Hear from our satisfied clients who are achieving their financial goals with FulxerPro.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className="bg-slate-800 rounded-xl p-8 shadow-lg border border-slate-700 hover:border-indigo-500 transform transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 0px 40px rgba(79, 70, 229, 0.35)" }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center mb-6">
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name} 
                className="w-16 h-16 rounded-full mr-4 object-cover border-2 border-indigo-500"
              />
              <div className="text-left">
                <h4 className="text-lg font-semibold text-white">{testimonial.name}</h4>
                <p className="text-gray-400 text-sm">{testimonial.title}</p>
              </div>
            </div>
            
            <div className="flex gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400" size={16} />
              ))}
            </div>
            
            <p className="text-gray-300 leading-relaxed italic">"{testimonial.review}"</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;