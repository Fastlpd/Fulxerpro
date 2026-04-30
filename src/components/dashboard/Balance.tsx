import React from "react";
import { motion } from "framer-motion";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const Balance: React.FC = () => {
  const portfolio = {
    total: 125380.5,
    change: 750.25,
    changePercent: 0.6,
    buyingPower: 25000.0,
  };

  const isPositive = portfolio.change >= 0;

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 shadow-lg text-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm md:text-lg text-gray-300 font-medium">
          Total Portfolio Value
        </span>

        <span
          className={`flex items-center text-sm md:text-lg font-semibold ${
            isPositive ? "text-green-400" : "text-red-400"
          }`}
        >
          {isPositive ? (
            <FaArrowUp className="mr-1 text-xs md:text-sm" />
          ) : (
            <FaArrowDown className="mr-1 text-xs md:text-sm" />
          )}
          {portfolio.changePercent.toFixed(2)}%
        </span>
      </div>

      <h2 className="text-4xl md:text-5xl font-bold mb-1 tracking-tight">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(portfolio.total)}
      </h2>

      <p
        className={`font-semibold mb-6 ${
          isPositive ? "text-green-400" : "text-red-400"
        }`}
      >
        {isPositive ? "+" : "-"}
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(Math.abs(portfolio.change))}{" "}
        Today
      </p>

      <div className="border-t border-gray-700 pt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-300">Buying Power</span>
          <span className="font-semibold text-lg">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(portfolio.buyingPower)}
          </span>
        </div>

        <div className="flex gap-4">
          <motion.button
            className="w-full py-3 bg-indigo-600 rounded-lg font-semibold hover:bg-indigo-500 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Deposit
          </motion.button>

          <motion.button
            className="w-full py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Withdraw
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default Balance;
