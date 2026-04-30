import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  investmentBalance: number;
  role: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/signin');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/signin');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black flex items-center justify-center px-6 py-12">
        <div className="rounded-3xl border border-white/10 bg-slate-900/80 px-8 py-6 text-center shadow-2xl shadow-slate-950/40">
          <p className="text-white text-2xl font-semibold">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.2),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(124,58,237,0.16),_transparent_20%)]" />
      <div className="relative z-10">
        <motion.header
          className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl"
          initial={{ y: -80 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 130 }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">FulxerPro</p>
              <h1 className="text-2xl font-semibold text-white">Investor Control Center</h1>
            </div>
            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition hover:bg-red-700"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaSignOutAlt /> Logout
            </motion.button>
          </div>
        </motion.header>

        <main className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-8">
          <motion.section
            className="grid gap-8 xl:grid-cols-[1.5fr_0.9fr]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <div className="rounded-[2rem] border border-white/10 bg-slate-900/95 p-10 shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col gap-6">
                <div className="inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />
                  Premium access enabled
                </div>
                <div>
                  <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    Welcome back, {user.firstName}.
                  </h2>
                  <p className="mt-4 max-w-3xl text-gray-400 sm:text-lg">
                    This is your FulxerPro command desk for portfolio analytics, strategy updates, and secure capital workflows.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                    <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Net portfolio</p>
                    <p className="mt-4 text-3xl font-semibold text-white">${user.investmentBalance.toFixed(2)}</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                    <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Risk score</p>
                    <p className="mt-4 text-3xl font-semibold text-green-400">72 / 100</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
                    <p className="text-sm uppercase tracking-[0.24em] text-gray-400">Signal uptime</p>
                    <p className="mt-4 text-3xl font-semibold text-indigo-400">99.98%</p>
                  </div>
                </div>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-white/10 bg-slate-900/95 p-8 shadow-2xl backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Investment summary</p>
              <h3 className="mt-3 text-3xl font-semibold text-white">Real-time insights</h3>
              <p className="mt-4 text-gray-400">
                Track holdings, stay on top of allocations, and make faster decisions with a premium dashboard built for enterprise portfolios.
              </p>

              <div className="mt-8 space-y-4">
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm text-gray-400">Weekly earnings</p>
                  <p className="mt-3 text-2xl font-semibold text-white">$24,560</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm text-gray-400">Active strategy</p>
                  <p className="mt-3 text-2xl font-semibold text-white">Alpha Growth</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                  <p className="text-sm text-gray-400">Next review</p>
                  <p className="mt-3 text-2xl font-semibold text-white">Today, 4:30 PM</p>
                </div>
              </div>
            </aside>
          </motion.section>

          <motion.section
            className="mt-12 rounded-[2rem] border border-white/10 bg-slate-900/95 p-8 shadow-2xl backdrop-blur-xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-white">Your Investments</h3>
                <p className="mt-2 text-gray-400">A curated breakdown of asset classes in your portfolio.</p>
              </div>
              <button className="inline-flex items-center rounded-full bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500">
                View full report
              </button>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {[
                {
                  name: 'Cryptocurrency',
                  amount: user.investmentBalance * 0.3,
                  change: '+18%',
                },
                {
                  name: 'Stocks',
                  amount: user.investmentBalance * 0.35,
                  change: '+8.5%',
                },
                {
                  name: 'Real Estate',
                  amount: user.investmentBalance * 0.2,
                  change: '+5%',
                },
                {
                  name: 'Automobiles',
                  amount: user.investmentBalance * 0.15,
                  change: '+12%',
                },
              ].map((investment, index) => (
                <motion.div
                  key={index}
                  className="rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-6"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.08 * index }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{investment.name}</h4>
                      <p className="mt-2 text-sm text-gray-400">Allocation</p>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">
                      {investment.change}
                    </span>
                  </div>
                  <p className="mt-6 text-sm text-gray-400">Estimated position value</p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    ${investment.amount.toFixed(2)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="mt-12 grid gap-4 md:grid-cols-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14 }}
          >
            {['Deposit', 'Withdraw', 'Transfer', 'Settings'].map((action, index) => (
              <motion.button
                key={index}
                className="rounded-[1.75rem] border border-white/10 bg-slate-900/95 px-6 py-5 text-left text-white shadow-lg shadow-slate-950/20 transition hover:border-indigo-500 hover:bg-slate-900"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="text-sm uppercase tracking-[0.18em] text-gray-400">{action}</p>
                <p className="mt-3 text-xl font-semibold">{action}</p>
              </motion.button>
            ))}
          </motion.section>
        </main>
      </div>
    </div>
  );
}


