import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { SITE_CONFIG } from '../constants/siteConfig';
import Footer from '../components/common/Footer';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState<'username' | 'password' | null>(null);

  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const success = await login(formData);
      if (success) {
        const { user } = useAuthStore.getState();
        navigate(user?.role === 'Admin' ? '/admin' : '/');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  const floatingLabelVariants = {
    active: { y: -24, scale: 0.8, transition: { duration: 0.2 } },
    inactive: { y: 0, scale: 1, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      {/* Main Content */}
      <div className="flex-grow flex items-center mt-[175px] justify-center px-4">
        <div className="w-full max-w-sm">
          <h2 className="text-4xl font-serif text-[#4A3F36] text-center mb-10">Login</h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-2 rounded">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="relative">
              <motion.label
                htmlFor="username"
                className="absolute left-0 text-[#4A3F36] text-base italic font-light pointer-events-none origin-left"
                animate={focusedField === 'username' || formData.username ? 'active' : 'inactive'}
                variants={floatingLabelVariants}
              >
                Email
              </motion.label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-transparent border-b border-[#4A3F36] text-[#4A3F36] placeholder-transparent focus:outline-none pt-5 pb-1"
                placeholder="Email"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <motion.label
                htmlFor="password"
                className="absolute left-0 text-[#4A3F36] text-base italic font-light pointer-events-none origin-left"
                animate={focusedField === 'password' || formData.password ? 'active' : 'inactive'}
                variants={floatingLabelVariants}
              >
                Password
              </motion.label>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-transparent border-b border-[#4A3F36] text-[#4A3F36] placeholder-transparent focus:outline-none pt-5 pb-1"
                placeholder="Password"
              />
              <div
                className="absolute right-0 top-5 cursor-pointer text-[#4A3F36]"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </div>
            </div>

            <div className="text-right text-xs uppercase tracking-widest text-[#4A3F36] font-medium mt-2">
              <Link to="/forgot-password">Forgot your password?</Link>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#DEC9A3] text-[#4A3F36] text-sm font-semibold py-3 rounded-md flex justify-between items-center px-5 tracking-wider hover:bg-[#d1b990] transition"
              >
                <span>{loading ? 'Signing in...' : 'SIGN IN'}</span>
                <span className="text-lg">→</span>
              </button>
            </div>

            <div className="text-center mt-4 text-xs uppercase tracking-widest text-[#4A3F36] font-medium">
              <Link to="/register">Create Account</Link>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Section (Subscribe message) */}
      <section className="py-20 px-6 text-center mt-[100px] bg-[#f4f1e7]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-serif italic text-[#aa732f] mb-6">{SITE_CONFIG.shortName}</h2>
          <p className="text-lg font-light text-[#aa732f] mb-6">
            Get exclusive updates on new collections and special offers.
          </p>
          <p className="text-xs font-semibold text-[#aa732f] max-w-lg mx-auto leading-relaxed">
            {SITE_CONFIG.name} may use your email address to send updates and offers. 
            You can always unsubscribe from marketing messages. Learn more via our Privacy Policy.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2A2621] text-center text-xs text-[#aa732f] py-6 px-4">
        <Footer />
      </footer>
    </div>
  );
};

export default LoginPage;
