import React from 'react';
import { motion } from 'framer-motion';
import { HiCheckCircle } from 'react-icons/hi';

const plans = [
  {
    name: 'Novus Starter',
    description: 'Ideal for those new to investing.',
    minInvestment: '$500',
    returns: 'Up to 10% APY',
    features: ['Basic Portfolio', 'Email Support', 'Monthly Reports'],
    cta: 'Start Investing',
    theme: 'silver',
  },
  {
    name: 'Argentum Pro',
    description: 'For the serious investor looking for more.',
    minInvestment: '$5,000',
    returns: 'Up to 15% APY',
    features: ['Advanced Portfolio', 'Priority Support', 'Real-time Market Analysis', 'Lower Fees'],
    cta: 'Go Pro',
    theme: 'primary',
    highlight: true,
  },
  {
    name: 'Aurum Elite',
    description: 'Ultimate features for maximum returns.',
    minInvestment: '$25,000',
    returns: 'Up to 20% APY',
    features: ['Custom Portfolio', 'Dedicated Advisor', 'Exclusive Access to IPOs', 'No Management Fees'],
    cta: 'Become Elite',
    theme: 'blue-gray',
  },
];

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: i * 0.2,
      type: 'spring',
      stiffness: 100,
    },
  }),
};

const InvestmentPlans: React.FC = () => {
  return (
    <section id="investments" className="py-24 bg-blue-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Investment Plans</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-blue-gray-900 sm:text-4xl">
            Choose Your Path to Growth
          </p>
          <p className="mt-4 max-w-2xl text-xl text-blue-gray-500 mx-auto">
            Tailored investment plans designed to meet your financial goals, big or small.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`rounded-2xl p-8 flex flex-col shadow-lg relative ${plan.highlight ? 'bg-blue-gray-900 text-white' : 'bg-white'}`}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              custom={i}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-8 -mt-4 bg-primary text-white text-sm font-semibold px-4 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              
              <h3 className={`text-2xl font-bold ${plan.highlight ? 'text-white' : 'text-blue-gray-900'}`}>{plan.name}</h3>
              <p className={`mt-2 ${plan.highlight ? 'text-blue-gray-300' : 'text-blue-gray-500'}`}>{plan.description}</p>
              
              <div className="mt-6">
                <span className={`text-5xl font-extrabold ${plan.highlight ? 'text-white' : 'text-blue-gray-900'}`}>{plan.minInvestment}</span>
                <span className="text-base font-medium text-blue-gray-500"> /min investment</span>
              </div>
              <p className={`mt-2 font-semibold ${plan.highlight ? 'text-primary' : 'text-primary'}`}>{plan.returns}</p>

              <ul className="mt-8 space-y-4 flex-grow">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <div className="flex-shrink-0">
                      <HiCheckCircle className={`h-6 w-6 ${plan.highlight ? 'text-primary' : 'text-green-500'}`} aria-hidden="true" />
                    </div>
                    <p className="ml-3 text-base">{feature}</p>
                  </li>
                ))}
              </ul>

              <motion.button
                className={`mt-10 w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300
                  ${plan.highlight ? 'bg-primary text-white hover:bg-primary-hover' : 'bg-blue-gray-100 text-primary hover:bg-blue-gray-200'}
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InvestmentPlans;
