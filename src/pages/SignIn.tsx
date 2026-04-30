import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function SignIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        const userRole = response.data.user.role;
        if (userRole === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(124,58,237,0.22),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.16),_transparent_30%)]" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 lg:px-12">
        <motion.div
          className="grid gap-10 xl:grid-cols-[1.2fr_0.95fr]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <section className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-10 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-200">
                <span className="h-2 w-2 rounded-full bg-indigo-400" />
                Premium investor access
              </div>

              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Private access to capital-grade intelligence.
                </h1>
                <p className="mt-4 max-w-2xl text-gray-400 sm:text-lg">
                  Unlock a polished investment portal built for allocators, operators, and modern family offices. Secure your entry with verified credentials and private onboarding.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Market Signals', value: 'Real-time' },
                  { label: 'Daily Insights', value: '98% uptime' },
                  { label: 'Security', value: 'AES-256' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-3xl font-semibold text-white">{stat.value}</p>
                    <p className="mt-2 text-sm text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-indigo-300">What you get</p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-400" />
                    <span>Institutional analytics for every portfolio decision.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-400" />
                    <span>Advanced asset tracking with private market overlay.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-indigo-400" />
                    <span>Enterprise privacy controls and next-gen encryption.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/90 p-5 text-sm text-gray-400">
                <p className="font-medium text-white">Gated access</p>
                <p className="mt-2">This portal is optimized for verified accounts and high-net-worth workflows. Request a bespoke onboarding if you need enterprise-level activation.</p>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-slate-900/95 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Investor Login</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Secure sign in</h2>
              <p className="mt-3 text-sm text-gray-400 sm:text-base">
                Enter your credentials to access the FulxerPro dashboard. If you need an invite, request one below.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-sm text-gray-300">
                <p className="font-semibold text-white">Standard access</p>
                <p className="mt-2">Email-based login for verified members.</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-4 text-sm text-gray-300">
                <p className="font-semibold text-white">Invite-only portal</p>
                <p className="mt-2">Need enterprise or team onboarding? Sign up to request private access.</p>
              </div>
            </div>

            {errors.submit && (
              <motion.div
                className="mt-6 rounded-3xl border border-red-500/20 bg-red-900/20 p-4 text-sm text-red-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.submit}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full rounded-3xl border px-5 py-3 text-white shadow-sm outline-none transition-colors focus:border-indigo-400 bg-slate-950/80 ${
                    errors.email ? 'border-red-500' : 'border-white/10'
                  }`}
                  placeholder="hello@fulxerpro.com"
                />
                {errors.email && <p className="mt-2 text-xs text-red-400">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full rounded-3xl border px-5 py-3 text-white shadow-sm outline-none transition-colors focus:border-indigo-400 bg-slate-950/80 ${
                    errors.password ? 'border-red-500' : 'border-white/10'
                  }`}
                  placeholder="••••••••"
                />
                {errors.password && <p className="mt-2 text-xs text-red-400">{errors.password}</p>}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-400">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-white/10 bg-slate-950 focus:ring-indigo-500" />
                  Remember me
                </label>
                <button type="button" className="text-indigo-300 hover:text-indigo-200">
                  Forgot password?
                </button>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full rounded-3xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Signing in…' : 'Sign in securely'}
              </motion.button>
            </form>

            <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/80 p-5 text-center text-sm text-gray-300">
              <p className="mb-3 text-gray-400">New to FulxerPro?</p>
              <Link
                to="/signup"
                className="inline-flex rounded-full bg-white/5 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Request invite & start now
              </Link>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}




