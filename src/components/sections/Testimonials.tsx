import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "FulxerPro has revolutionized my investment strategy. The AI insights are a game-changer!",
    name: "Alex Johnson",
    title: "Seasoned Investor",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
  },
  {
    quote: "The platform is intuitive and secure. I feel confident growing my wealth with FulxerPro.",
    name: "Samantha Lee",
    title: "Tech Entrepreneur",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e290267072"
  },
  {
    quote: "Finally, a platform that offers diverse investment options with automated profit distribution. Highly recommended!",
    name: "Michael Chen",
    title: "Financial Analyst",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d"
  }
];

const Testimonials = () => {
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
          What Our Investors Say
        </h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-secondary/50 backdrop-blur-lg p-8 rounded-2xl border border-border"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 0 25px rgba(121, 40, 202, 0.5)`, // Using accent color for shadow
                borderColor: "rgba(255, 255, 255, 0.5)"
              }}
            >
              <img src={testimonial.avatar} alt={testimonial.name} className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-primary" />
              <p className="text-lg italic mb-6 text-text-secondary">"{testimonial.quote}"</p>
              <h3 className="text-xl font-bold text-text">{testimonial.name}</h3>
              <p className="text-text-secondary">{testimonial.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Testimonials;
