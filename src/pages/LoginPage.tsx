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
      <div className="flex-grow flex items-center mt-20 sm:mt-24 lg:mt-32 justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md">
          <h2 className="text-3xl sm:text-4xl font-serif text-[#4A3F36] text-center mb-8 sm:mb-10">Login</h2>

          <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-300 text-red-800 px-3 sm:px-4 py-2 rounded text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div className="relative">
              <motion.label
                htmlFor="username"
                className="absolute left-0 text-[#4A3F36] text-sm sm:text-base italic font-light pointer-events-none origin-left"
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
                className="w-full bg-transparent border-b border-[#4A3F36] text-[#4A3F36] placeholder-transparent focus:outline-none pt-4 sm:pt-5 pb-1 text-sm sm:text-base"
                placeholder="Email"
              />
            </div>

            {/* Password Field */}
            <div className="relative">
              <motion.label
                htmlFor="password"
                className="absolute left-0 text-[#4A3F36] text-sm sm:text-base italic font-light pointer-events-none origin-left"
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
                className="w-full bg-transparent border-b border-[#4A3F36] text-[#4A3F36] placeholder-transparent focus:outline-none pt-4 sm:pt-5 pb-1 text-sm sm:text-base"
                placeholder="Password"
              />
              <div
                className="absolute right-0 top-4 sm:top-5 cursor-pointer text-[#4A3F36] p-1"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <EyeOff size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />}
              </div>
            </div>

            <div className="text-right text-xs sm:text-sm uppercase tracking-widest text-[#4A3F36] font-medium mt-2">
              <Link to="/forgot-password">Forgot your password?</Link>
            </div>

            <div className="pt-4 sm:pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#DEC9A3] text-[#4A3F36] text-xs sm:text-sm font-semibold py-2.5 sm:py-3 rounded-md flex justify-between items-center px-4 sm:px-5 tracking-wider hover:bg-[#d1b990] transition"
              >
                <span>{loading ? 'Signing in...' : 'SIGN IN'}</span>
                <span className="text-base sm:text-lg">→</span>
              </button>
            </div>

            <div className="text-center mt-3 sm:mt-4 text-xs sm:text-sm uppercase tracking-widest text-[#4A3F36] font-medium">
              <Link to="/register">Create Account</Link>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Section (Subscribe message) */}
      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 text-center mt-16 sm:mt-20 lg:mt-24 bg-[#F2ECE4]">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-serif italic text-[#4F3C2A] mb-4 sm:mb-6">{SITE_CONFIG.shortName}</h2>
          <p className="text-base sm:text-lg font-light text-[#4F3C2A] mb-4 sm:mb-6">
            Get exclusive updates on new collections and special offers.
          </p>
          <p className="text-xs sm:text-sm font-semibold text-[#4F3C2A] max-w-lg mx-auto leading-relaxed px-4">
            {SITE_CONFIG.name} may use your email address to send updates and offers. 
            You can always unsubscribe from marketing messages. Learn more via our Privacy Policy.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2A2621] text-center text-xs text-[#aa732f] bg-[#F2ECE4] py-4 sm:py-6 px-4">
        <Footer />
      </footer>
    </div>
  );
};

export default LoginPage;
