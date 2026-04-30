import React from 'react';
import { FaFacebook, FaTwitter, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-gray-400 py-12 md:py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-12">
        {/* Company Info */}
        <div className="col-span-1">
          <span className="text-2xl font-bold text-gradient block mb-4">FulxerPro</span>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            Intelligent investing for a smarter financial future.
            Invest in Crypto, Stocks, Real Estate, and Automobiles with confidence.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"><FaFacebook size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"><FaTwitter size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"><FaLinkedin size={24} /></a>
            <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300"><FaYoutube size={24} /></a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul>
            <li className="mb-2"><a href="#hero" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Home</a></li>
            <li className="mb-2"><a href="#features" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Features</a></li>
            <li className="mb-2"><a href="#market" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Markets</a></li>
            <li className="mb-2"><a href="#plans" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Plans</a></li>
            <li className="mb-2"><a href="#testimonials" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Testimonials</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
          <ul>
            <li className="mb-2"><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Privacy Policy</a></li>
            <li className="mb-2"><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Terms of Service</a></li>
            <li className="mb-2"><a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors duration-300">Disclaimer</a></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="col-span-1">
          <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
          <p className="text-gray-400 text-sm mb-2">Email: support@fulxerpro.com</p>
          <p className="text-gray-400 text-sm mb-2">Phone: +1 (555) 123-4567</p>
          <p className="text-gray-400 text-sm">Address: 123 Fintech Lane, Innovation City, FN 01234</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} FulxerPro. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;