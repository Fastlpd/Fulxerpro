import React from 'react';
import { motion } from 'framer-motion';


const transactions = [
  { id: '1', type: 'Deposit', description: 'Bank Transfer', amount: 1000.00, date: '2026-01-20', status: 'Completed' },
  { id: '2', type: 'Buy', description: 'AAPL Stock', amount: -150.75, date: '2026-01-19', status: 'Completed' },
  { id: '3', type: 'Sell', description: 'TSLA Stock', amount: 300.50, date: '2026-01-18', status: 'Completed' },
  { id: '4', type: 'Withdrawal', description: 'Bank Transfer', amount: -200.00, date: '2026-01-17', status: 'Pending' },
  { id: '5', type: 'Buy', description: 'ETH Crypto', amount: -500.00, date: '2026-01-16', status: 'Completed' },
];

const TransactionHistory: React.FC = () => {
  return (
    <motion.div
      className="bg-blue-gray-800 text-white rounded-2xl shadow-2xl p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-2xl font-bold mb-6 text-blue-gray-100">Transaction History</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-blue-gray-700">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-blue-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-blue-gray-300 uppercase tracking-wider">Type</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-blue-gray-300 uppercase tracking-wider">Description</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-blue-gray-300 uppercase tracking-wider text-right">Amount</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-blue-gray-300 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-gray-700">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-blue-gray-700 transition-colors duration-200">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-gray-200">{transaction.date}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-gray-200">{transaction.type}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-blue-gray-200">{transaction.description}</td>
                <td className={`px-4 py-3 whitespace-nowrap text-sm text-right ${transaction.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(transaction.amount)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default TransactionHistory;
