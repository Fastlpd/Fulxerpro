import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface StockData {
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
}

const symbols = ['AAPL', 'TSLA', 'MSFT', 'GOOGL'];
// IMPORTANT: Replace with your own free Alpha Vantage API key
const API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY';

const StockMarket: React.FC = () => {
  const [data, setData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDataForSymbol = async (symbol: string): Promise<StockData> => {
      const response = await axios.get('https://www.alphavantage.co/query', {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: symbol,
          apikey: API_KEY,
        },
      });
      
      const quote = response.data['Global Quote'];
      if (!quote || Object.keys(quote).length === 0) {
        throw new Error(`No data for symbol ${symbol}. The API limit might be reached.`);
      }

      return {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']).toFixed(2),
        change: parseFloat(quote['09. change']).toFixed(2),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')).toFixed(2),
      };
    };

    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      const stockData: StockData[] = [];
      try {
        for (const symbol of symbols) {
          // Delay to avoid hitting API rate limits (1 call every ~15 seconds for 4 symbols)
          await new Promise(resolve => setTimeout(resolve, 15000));
          const result = await fetchDataForSymbol(symbol);
          stockData.push(result);
        }
        setData(stockData);
      } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError('An unknown error occurred.');
        }
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
    // Note: Due to API limitations, frequent polling is not feasible with the free key.
  }, []);

  const priceChangeColor = (change: string) => {
    return parseFloat(change) >= 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <motion.div 
        className="bg-white rounded-2xl shadow-lg p-6 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
    >
      <h3 className="text-xl font-bold text-blue-gray-900 mb-4">Live Stock Market</h3>
      {API_KEY === 'YOUR_ALPHA_VANTAGE_API_KEY' && (
        <div className="p-4 mb-4 text-sm text-yellow-800 bg-yellow-100 rounded-lg" role="alert">
          <span className="font-medium">Warning:</span> Please replace 'YOUR_ALPHA_VANTAGE_API_KEY' in the code to fetch live stock data.
        </div>
      )}
      {loading && <div className="text-center p-8">Loading stock data...</div>}
      {error && <div className="text-center p-8 text-red-500">{error}</div>}
      
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-blue-gray-200">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-blue-gray-500 uppercase tracking-wider">Symbol</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-blue-gray-500 uppercase tracking-wider">Price</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-blue-gray-500 uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-blue-gray-100">
              {data.map((stock) => (
                <tr key={stock.symbol} className="hover:bg-blue-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-blue-gray-900">{stock.symbol}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">${stock.price}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${priceChangeColor(stock.change)}`}>
                    {stock.change} ({stock.changePercent}%)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default StockMarket;
