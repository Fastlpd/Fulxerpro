import React, { Suspense } from 'react';
import { ReactLenis } from '@studio-freight/react-lenis';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Scene from './components/canvas/Scene';

// Lazy load all the sections for better performance
const Hero = React.lazy(() => import('./components/sections/HeroGems'));
const Features = React.lazy(() => import('./components/sections/FeaturesGems'));
const MarketData = React.lazy(() => import('./components/sections/MarketDataGems'));
const InvestToOwn = React.lazy(() => import('./components/sections/InvestToOwnGems'));
const Housing = React.lazy(() => import('./components/sections/Housing'));
const Cars = React.lazy(() => import('./components/sections/Cars'));
const Testimonials = React.lazy(() => import('./components/sections/Testimonials'));
const PaymentForms = React.lazy(() => import('./components/sections/PaymentForms'));

const App = () => {
  return (
    <ReactLenis root>
      <div className="min-h-screen bg-primary text-text-main font-sans selection:bg-brand-blue/70">
        {/* 3D Scene Background */}
        <div className="fixed top-0 left-0 w-full h-full -z-10 opacity-50">
          <Scene />
        </div>

        <Header />
        <main>
          <Suspense fallback={<div className="h-screen flex justify-center items-center">Loading...</div>}>
            <Hero />
            <Features />
            <MarketData />
            <InvestToOwn />
            <Housing />
            <Cars />
            <Testimonials />
            <PaymentForms />
          </Suspense>
        </main>
        <Footer />
      </div>
    </ReactLenis>
  );
};

export default App;
