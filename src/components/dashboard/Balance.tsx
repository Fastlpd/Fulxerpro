import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

const Balance: React.FC = () => {
    const portfolio = {
        total: 125380.50,
        change: 750.25,
        changePercent: 0.60,
        buyingPower: 25000.00,
    };

    const isPositive = portfolio.change >= 0;

    return (
        <motion.div
            className="bg-gradient-to-br from-blue-gray-800 to-blue-gray-900 text-white rounded-2xl shadow-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="flex justify-between items-center mb-2">
                <span className="text-lg text-blue-gray-300">Total Portfolio Value</span>
                <span className={`flex items-center font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
                    {portfolio.changePercent.toFixed(2)}%
                </span>
            </div>
            
            <h2 className="text-5xl font-bold mb-1">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(portfolio.total)}
            </h2>

            <p className={`font-semibold mb-6 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '+' : '-'}
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Math.abs(portfolio.change))} Today
            </p>

            <div className="border-t border-blue-gray-700 pt-6">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-blue-gray-300">Buying Power</span>
                    <span className="font-semibold text-lg">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(portfolio.buyingPower)}
                    </span>
                </div>
                <div className="flex gap-4">
                    <motion.button 
                        className="w-full py-3 bg-primary rounded-lg font-semibold hover:bg-primary-hover transition-colors"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Deposit
                    </motion.button>
                    <motion.button 
                        className="w-full py-3 bg-blue-gray-700 rounded-lg font-semibold hover:bg-blue-gray-600 transition-colors"
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
