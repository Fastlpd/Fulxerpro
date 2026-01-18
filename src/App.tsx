import Header from './components/layout/Header';
import Hero from './components/sections/Hero';
import Features from './components/sections/Features';
import MarketData from './components/sections/MarketData';
import InvestToOwn from './components/sections/InvestToOwn';
import Footer from './components/layout/Footer';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      <Header />
      <Hero />
      <Features />
      <MarketData />
      <InvestToOwn />
      <Footer />
    </div>
  );
};

export default App;