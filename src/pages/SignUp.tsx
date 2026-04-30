import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        setSuccessMessage('Account created successfully. Redirecting to dashboard...');

        setTimeout(() => {
          navigate('/dashboard');
        }, 1800);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.18),_transparent_20%),radial-gradient(circle_at_bottom_left,_rgba(34,211,238,0.14),_transparent_28%)]" />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 lg:px-12">
        <motion.div
          className="grid gap-10 xl:grid-cols-[1.2fr_0.8fr]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <section className="rounded-[2rem] border border-white/10 bg-slate-900/90 p-10 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-200">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                Invitation-only account
              </div>

              <div>
                <h1 className="text-4xl font-semibold tracking-tight text-gradient sm:text-5xl">
                  Start your subscription to the premium investor suite.
                </h1>
                <p className="mt-4 max-w-2xl text-gray-400 sm:text-lg">
                  Build an invite-only profile, access private strategies, and connect with next-gen asset intelligence designed for high-value portfolios.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Portfolio Signals', value: 'Ultra-fast' },
                  { label: 'Deal Flow', value: 'Curated' },
                  { label: 'Governance', value: 'Controlled' },
                ].map((item) => (
                  <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <p className="text-3xl font-semibold text-white">{item.value}</p>
                    <p className="mt-2 text-sm text-gray-400">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-6">
                <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Why join</p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400" />
                    <span>Private portfolio orchestration with advanced risk metrics.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400" />
                    <span>Invite-based onboarding for individuals and teams.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400" />
                    <span>Encrypted cloud protection and strict permission controls.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-slate-900/95 p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Create account</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Secure registration</h2>
              <p className="mt-3 text-sm text-gray-400 sm:text-base">
                Complete the form to request access to the FulxerPro premium experience. Approved users are redirected automatically.
              </p>
            </div>

            {successMessage && (
              <motion.div
                className="mb-6 rounded-3xl border border-emerald-500/20 bg-emerald-900/20 p-4 text-sm text-emerald-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {successMessage}
              </motion.div>
            )}

            {errors.submit && (
              <motion.div
                className="mb-6 rounded-3xl border border-red-500/20 bg-red-900/20 p-4 text-sm text-red-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.submit}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    autoComplete="given-name"
                    className={`w-full rounded-3xl border px-5 py-3 text-white shadow-sm outline-none transition-colors focus:border-cyan-400 bg-slate-950/80 ${
                      errors.firstName ? 'border-red-500' : 'border-white/10'
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="mt-2 text-xs text-red-400">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    autoComplete="family-name"
                    className={`w-full rounded-3xl border px-5 py-3 text-white shadow-sm outline-none transition-colors focus:border-cyan-400 bg-slate-950/80 ${
                      errors.lastName ? 'border-red-500' : 'border-white/10'
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="mt-2 text-xs text-red-400">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className={`w-full rounded-3xl border px-5 py-3 text-white shadow-sm outline-none transition-colors focus:border-cyan-400 bg-slate-950/80 ${
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
                  autoComplete="new-password"
                  className={`w-full rounded-3xl border px-5 py-3 text-white shadow-sm outline-none transition-colors focus:border-cyan-400 bg-slate-950/80 ${
                    errors.password ? 'border-red-500' : 'border-white/10'
                  }`}
                  placeholder="••••••••"
                />
                {errors.password && <p className="mt-2 text-xs text-red-400">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className={`w-full rounded-3xl border px-5 py-3 text-white shadow-sm outline-none transition-colors focus:border-cyan-400 bg-slate-950/80 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-white/10'
                  }`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="mt-2 text-xs text-red-400">{errors.confirmPassword}</p>}
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full rounded-3xl bg-gradient-to-r from-cyan-500 to-sky-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? 'Creating account…' : 'Request access'}
              </motion.button>
            </form>

            <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/80 p-5 text-center text-sm text-gray-300">
              <p className="mb-3 text-gray-400">Already registered?</p>
              <Link
                to="/signin"
                className="inline-flex rounded-full bg-white/5 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Sign in instead
              </Link>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}




