import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Deposit: React.FC = () => {
    const [amount, setAmount] = useState('');

    const quickAmounts = [100, 500, 1000, 5000];

    return (
        <motion.div 
            className="bg-white rounded-2xl shadow-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            <h3 className="text-2xl font-bold text-blue-gray-900 mb-2">Deposit Funds</h3>
            <p className="text-blue-gray-500 mb-6">Choose an amount to add to your buying power.</p>

            <div className="mb-6">
                <label htmlFor="amount" className="block text-sm font-bold text-blue-gray-700 mb-2">Amount</label>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-lg">$</span>
                    </div>
                    <input 
                        type="number" 
                        id="amount" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-3 text-2xl font-bold rounded-lg bg-blue-gray-100 border-2 border-transparent focus:border-primary focus:ring-0 transition"
                        placeholder="0.00"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {quickAmounts.map(qAmount => (
                    <motion.button
                        key={qAmount}
                        onClick={() => setAmount(qAmount.toString())}
                        className="py-3 px-2 bg-blue-gray-100 rounded-lg font-semibold text-primary hover:bg-blue-gray-200 transition"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        ${qAmount}
                    </motion.button>
                ))}
            </div>

            <motion.button 
                className="w-full py-4 bg-primary rounded-lg text-white font-bold text-lg hover:bg-primary-hover transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                Deposit ${amount || '0.00'}
            </motion.button>
        </motion.div>
    );
};

export default Deposit;
