import React from 'react';
import Balance from './Balance';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import TransactionHistory from './TransactionHistory';
import StockTrading from './StockTrading';

const DashboardSection: React.FC = () => {
  return (
    <section id="dashboard" className="bg-blue-gray-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Your Investment Hub</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-blue-gray-900 sm:text-4xl">Manage Your Financial World</p>
          <p className="mt-6 text-lg leading-8 text-blue-gray-600">
            A comprehensive overview of your investments, transactions, and trading tools.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <Balance />
            </div>
            <div className="lg:col-span-2 flex flex-col gap-8">
                <Deposit />
                <Withdraw />
            </div>
        </div>
        
        <div className="mt-16">
            <StockTrading />
        </div>

        <div className="mt-16">
            <TransactionHistory />
        </div>

      </div>
    </section>
  );
};

export default DashboardSection;
