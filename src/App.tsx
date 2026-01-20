import { Suspense } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis'; // Assuming this import is now resolved
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Scene from './components/canvas/Scene';

// Import all the main sections
import Hero from './components/sections/Hero';
import Features from './components/sections/Features'; // Existing
import InvestmentPlans from './components/sections/InvestmentPlans';
import Reviews from './components/sections/Reviews';
import MarketData from './components/sections/MarketData';
import InvestToOwn from './components/sections/InvestToOwn'; // Existing
import CarInvestment from './components/sections/CarInvestment';
import HousingInvestment from './components/sections/HousingInvestment';
import DashboardSection from './components/dashboard/DashboardSection'; // New component

const App = () => {
  return (
    <ReactLenis root>
      <div className="min-h-screen bg-blue-gray-900 text-white font-sans selection:bg-primary/70"> {/* Updated background and selection color */}
        {/* 3D Scene Background */}
        <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-50">
          <Scene />
        </div>

        <Header />
        <main>
          {/* Using Suspense for potential lazy loading, though direct imports are used here for simplicity initially */}
          <Suspense fallback={<div className="h-screen flex justify-center items-center text-blue-gray-300">Loading Fulxerpro...</div>}>
            <Hero />
            <Features /> {/* Keep existing features for now */}
            <InvestmentPlans />
            <Reviews />
            <MarketData />
            {/* The prompt mentioned InvestToOwn, CarInvestment, HousingInvestment.
                If InvestToOwn is a wrapper for car/housing, it should contain them.
                For now, rendering them separately. */}
            <InvestToOwn /> 
            <CarInvestment />
            <HousingInvestment />
            <DashboardSection /> {/* Integrates Balance, Deposit, Withdraw, StockTrading, TransactionHistory */}
          </Suspense>
        </main>
        <Footer />
      </div>
    </ReactLenis>
  );
};

export default App;
