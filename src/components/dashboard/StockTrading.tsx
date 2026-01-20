import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { FaSearch } from 'react-icons/fa';

// Dummy data for the chart
const stockChartData = [
    { name: '9:30', price: 170.12 },
    { name: '10:00', price: 171.50 },
    { name: '11:00', price: 170.80 },
    { name: '12:00', price: 172.30 },
    { name: '1:00', price: 172.00 },
    { name: '2:00', price: 173.10 },
    { name: '3:00', price: 172.85 },
    { name: '4:00', price: 173.50 },
];

const StockTrading: React.FC = () => {
    const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
    const [quantity, setQuantity] = useState('');

    const stock = {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 173.50,
        change: 1.25,
        changePercent: 0.72,
    };

    const estimatedCost = (parseFloat(quantity) || 0) * stock.price;

    return (
        <motion.div 
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-blue-gray-900">Stock Exchange</h2>
                    <p className="text-blue-gray-500">Search for a stock and start trading.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <FaSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-blue-gray-400" />
                    <input type="text" placeholder="Search symbol (e.g., AAPL)" className="w-full pl-12 pr-4 py-2 rounded-lg bg-blue-gray-100 border-2 border-transparent focus:border-primary focus:ring-0 transition"/>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Panel: Stock Info & Chart */}
                <div className="lg:col-span-2 bg-blue-gray-50 rounded-xl p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-3xl font-bold text-blue-gray-900">{stock.symbol}</h3>
                            <p className="text-blue-gray-600">{stock.name}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-blue-gray-900">${stock.price.toFixed(2)}</p>
                            <p className={`font-semibold ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent}%)
                            </p>
                        </div>
                    </div>
                    <div className="h-64 md:h-80 -ml-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stockChartData}>
                                <defs>
                                    <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
                                <YAxis stroke="#94A3B8" fontSize={12} domain={['dataMin - 1', 'dataMax + 1']} />
                                <Tooltip contentStyle={{ backgroundColor: '#1E293B', border: 'none', borderRadius: '0.5rem' }} labelStyle={{ color: '#F1F5F9' }}/>
                                <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} fill="url(#chart-gradient)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Right Panel: Trading Form */}
                <div className="bg-blue-gray-50 rounded-xl p-6">
                    <div className="flex border-b border-blue-gray-200 mb-4">
                        <button onClick={() => setTradeType('buy')} className={`w-1/2 py-3 font-semibold text-center rounded-t-lg ${tradeType === 'buy' ? 'bg-primary text-white' : 'text-blue-gray-500 hover:bg-blue-gray-100'}`}>
                            Buy
                        </button>
                        <button onClick={() => setTradeType('sell')} className={`w-1/2 py-3 font-semibold text-center rounded-t-lg ${tradeType === 'sell' ? 'bg-red-500 text-white' : 'text-blue-gray-500 hover:bg-blue-gray-100'}`}>
                            Sell
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-medium text-blue-gray-700 mb-1">Quantity</label>
                            <input type="number" id="quantity" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="0" className="w-full px-4 py-2 rounded-lg bg-white border-2 border-blue-gray-200 focus:border-primary focus:ring-0 transition" />
                        </div>
                        
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-blue-gray-500">Market Price</span>
                            <span className="font-semibold text-blue-gray-800">${stock.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm border-t border-blue-gray-200 pt-2">
                            <span className="font-bold text-blue-gray-600">Estimated Cost</span>
                            <span className="font-bold text-blue-gray-900">${estimatedCost.toFixed(2)}</span>
                        </div>
                    </div>

                    <motion.button 
                        className={`w-full mt-6 py-3 rounded-lg text-white font-bold text-lg transition-all ${tradeType === 'buy' ? 'bg-primary hover:bg-primary-hover' : 'bg-red-500 hover:bg-red-600'}`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {tradeType === 'buy' ? 'Buy AAPL' : 'Sell AAPL'}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default StockTrading;
