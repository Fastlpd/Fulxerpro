import { motion } from 'framer-motion';

// Subtle stagger variants for social links (they fade in one by one)
const socialVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.15, // ← Subtle delay between links (0.15s)
    },
  },
};

// Individual link variants (with gentle hover scale & color shift)
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.1, transition: { duration: 0.2 } }, // ← Subtle scale on hover
};

const Footer = () => {
  return (
    // Main footer with subtle fade-in when in view
    <motion.footer
      initial={{ opacity: 0, y: 20 }} // ← Starts slightly lower for parallax feel
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }} // ← Smoother easing
      viewport={{ once: true, amount: 0.3 }} // ← Triggers when 30% visible
      className="bg-gradient-to-b from-blue-gray-900 to-blue-gray-800 text-blue-gray-300 py-10 border-t border-blue-gray-700"
    >
      <div className="container mx-auto px-6 text-center">
        {/* Main copyright line – elegant silver text */}
        <p className="text-lg font-light tracking-wide">
          © {new Date().getFullYear()} Fulxerpro. All rights reserved.
          <span className="ml-2 text-sm text-blue-gray-500">Your Future, Amplified.</span>
        </p>

        {/* Subtle tagline for premium feel */}
        <p className="mt-2 text-sm text-blue-gray-500 italic">
          Unlock Wealth Growth • Secure • Innovative
        </p>

        {/* Social links with stagger & hover animation */}
        <motion.div
          className="flex justify-center space-x-8 mt-6 text-2xl"
          variants={socialVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.a
            variants={itemVariants}
            whileHover="hover"
            href="https://facebook.com/fulxerpro"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-300"
            aria-label="Facebook"
          >
            Facebook
          </motion.a>

          <motion.a
            variants={itemVariants}
            whileHover="hover"
            href="https://twitter.com/fulxerpro"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-300"
            aria-label="Twitter"
          >
            Twitter
          </motion.a>

          <motion.a
            variants={itemVariants}
            whileHover="hover"
            href="https://linkedin.com/company/fulxerpro"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors duration-300"
            aria-label="LinkedIn"
          >
            LinkedIn
          </motion.a>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;