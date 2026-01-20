import CryptoMarket from "./market/CryptoMarket";
import StockMarket from "./market/StockMarket";

const MarketData = () => {
  return (
    <section id="market" className="py-24 bg-blue-gray-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-blue-gray-900 sm:text-4xl">Live Market Overview</h2>
            <p className="mt-4 max-w-2xl text-xl text-blue-gray-500 mx-auto">
                Stay updated with real-time data from the cryptocurrency and stock markets.
            </p>
        </div>

        <div className="max-w-4xl mx-auto">
            <CryptoMarket />
            <StockMarket />
        </div>
      </div>
    </section>
  );
};

export default MarketData;
