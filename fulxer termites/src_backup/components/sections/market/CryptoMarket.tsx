import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AreaChart, Area, Sparkline } from 'recharts';

interface CoinData {
  id: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  sparkline_in_7d: {
    price: number[];
  };
}

const CryptoMarket: React.FC = () => {
  const [data, setData] = useState<CoinData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 5,
          page: 1,
          sparkline: true,
          price_change_percentage: '24h,7d',
        },
      });
      setData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cryptocurrency data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  const priceChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-500' : 'text-red-500';
  };

  if (loading) {
    return <div className="text-center p-8">Loading market data...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl font-bold text-blue-gray-900 mb-4">Live Crypto Market</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-blue-gray-200">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-gray-500 uppercase tracking-wider">Coin</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-blue-gray-500 uppercase tracking-wider">Price</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-blue-gray-500 uppercase tracking-wider">24h Change</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-blue-gray-500 uppercase tracking-wider">7d Trend</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-blue-gray-100">
            {data.map((coin) => (
              <tr key={coin.id} className="hover:bg-blue-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      <img className="h-8 w-8 rounded-full" src={coin.image} alt={coin.name} />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-blue-gray-900">{coin.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">{formatCurrency(coin.current_price)}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${priceChangeColor(coin.price_change_percentage_24h)}`}>
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div style={{ width: '100px', height: '30px' }}>
                    <AreaChart
                        width={100}
                        height={30}
                        data={coin.sparkline_in_7d.price.map(p => ({price: p}))}
                        margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient id="sparkline-color" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} fill="url(#sparkline-color)" />
                    </AreaChart>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default CryptoMarket;
