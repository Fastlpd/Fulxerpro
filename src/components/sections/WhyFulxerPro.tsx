import { motion } from 'framer-motion';
import { FiShield, FiCpu, FiPlusSquare } from 'react-icons/fi';

const reasons = [
  {
    title: "Bank-Grade Security",
    icon: <FiShield className="text-6xl text-primary mx-auto mb-6" />,
    description: "Your data and assets are protected by multi-layered, industry-leading security protocols.",
    shadowColor: "shadow-primary/50",
  },
  {
    title: "AI-Powered Insights",
    icon: <FiCpu className="text-6xl text-accent mx-auto mb-6" />,
    description: "Leverage advanced AI to identify market trends and optimize your investment strategy.",
    shadowColor: "shadow-accent/50",
  },
  {
    title: "Diversified Investment Options",
    icon: <FiPlusSquare className="text-6xl text-primary mx-auto mb-6" />,
    description: "Explore a wide range of asset classes including stocks, crypto, real estate, and more.",
    shadowColor: "shadow-primary/50",
  }
];

const WhyFulxerPro = () => {
  return (
    <motion.section
      className="py-24 bg-background text-text"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
          Why FulxerPro?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              className="bg-secondary/50 backdrop-blur-lg p-10 rounded-3xl border border-border"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 0 25px ${reason.shadowColor}`,
                borderColor: "rgba(255, 255, 255, 0.5)"
              }}
            >
              {reason.icon}
              <h3 className="text-2xl font-bold mb-4">{reason.title}</h3>
              <p className="text-text-secondary">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default WhyFulxerPro;

