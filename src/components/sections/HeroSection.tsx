import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Starfield from "../canvas/Starfield";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 14 },
  },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 text-white px-6">
      
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black opacity-90" />

      {/* Animated Starfield */}
      <Starfield />

      <motion.div
        className="relative z-10 max-w-5xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
        >
          Intelligent Investing Starts With{" "}
          <span className="text-indigo-400">FulxerPro</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12"
        >
          Your gateway to smarter investments in Crypto, Stocks, Real Estate,
          and Automobiles. Track markets in real-time and grow with confidence.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-6 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-lg font-semibold shadow-lg transition"
          >
            Start Investing
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 border border-gray-500 hover:bg-white/10 rounded-xl text-lg font-semibold transition"
          >
            View Markets
          </motion.button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
        >
          {[
            {
              title: "Real-Time Analytics",
              text: "Track live crypto, stock, and asset movements instantly.",
            },
            {
              title: "Secure Transactions",
              text: "Bank-grade encryption protects your funds and data.",
            },
            {
              title: "Smart Portfolio Tools",
              text: "Automated tracking, profit insights, and growth planning.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-lg border border-white/10 p-6 rounded-2xl shadow-xl hover:scale-105 transition"
            >
              <h3 className="text-xl font-semibold mb-2 text-indigo-400">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-sm">{feature.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
