import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    firstname: '',
    lastname: '',
    contact: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [focusedField, setFocusedField] = useState<null | keyof typeof formData>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { register, loading, sendEmailConfirmation } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const {
      email,
      firstname,
      lastname,
      contact,
      username,
      password,
      confirmPassword,
    } = formData;

    if (!email.trim() || !firstname.trim() || !lastname.trim() || !contact.trim() || !username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (firstname.length > 12 || lastname.length > 12) {
      setError('First name and last name must not exceed 12 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const { confirmPassword: _, ...registerData } = formData;
    const success = await register(registerData);

    if (success) {
      await sendEmailConfirmation(email);
      navigate('/');
    } else {
      setError('Registration failed. Please try again.');
    }
  };

  const floatingLabelVariants = {
    active: { y: -28, scale: 0.8, transition: { duration: 0.2 } },
    inactive: { y: 0, scale: 1, transition: { duration: 0.2 } },
  };

  const renderInput = (
    name: keyof typeof formData,
    label: string,
    type: string = 'text'
  ) => (
    <div className="relative">
      <motion.label
        htmlFor={name}
        className="absolute left-0 text-[#4A3F36] text-base italic font-light pointer-events-none origin-left top-8"
        animate={focusedField === name || formData[name] ? 'active' : 'inactive'}
        variants={floatingLabelVariants}
      >
        {label}
      </motion.label>
      <input
        id={name}
        name={name}
        type={type}
        required
        value={formData[name]}
        onChange={(e) => {
          const value = e.target.value;
          if (name === 'contact') {
            if (/^\d{0,10}$/.test(value)) {
              handleChange(e);
            }
          } else {
            handleChange(e);
          }
        }}

        onFocus={() => setFocusedField(name)}
        onBlur={() => setFocusedField(null)}
        maxLength={name === 'firstname' || name === 'lastname' ? 12 : undefined}
        inputMode={name === 'contact' ? 'numeric' : undefined}
        className="w-full bg-transparent border-b border-[#4A3F36] text-[#4A3F36] placeholder-transparent focus:outline-none pt-8 pb-2"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md">
        <h2 className="text-3xl sm:text-4xl font-serif text-[#4A3F36] text-center mb-8 sm:mb-10">Create Account</h2>

        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-800 px-3 sm:px-4 py-2 mb-8 rounded text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-2 sm:gap-3">
            <div className="w-1/2">{renderInput('firstname', 'First Name')}</div>
            <div className="w-1/2">{renderInput('lastname', 'Last Name')}</div>
          </div>

          {renderInput('email', 'Email', 'email')}
          {renderInput('contact', 'Contact (+91)', 'tel')}
          {renderInput('username', 'Username')}

          <div className="relative">
            <motion.label
              htmlFor="password"
              className="absolute left-0 text-[#4A3F36] text-sm sm:text-base italic font-light pointer-events-none origin-left top-8" // Adjusted top-8
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
              className="w-full bg-transparent border-b border-[#4A3F36] text-[#4A3F36] placeholder-transparent focus:outline-none pt-8 pb-2 text-sm sm:text-base" // Increased pt to 8, pb to 2
              placeholder="Password"
            />
            <div
              className="absolute right-0 top-9 sm:top-10 cursor-pointer text-[#4A3F36] p-1" // Adjusted top to align with new input padding
              onClick={() => setShowPassword(prev => !prev)}
            >
              {showPassword ? <EyeOff size={16} className="sm:w-[18px] sm:h-[18px]" /> : <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />}
            </div>
          </div>

          {renderInput('confirmPassword', 'Confirm Password', 'password')}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#DEC9A3] text-[#4A3F36] text-xs sm:text-sm font-semibold py-2.5 sm:py-3 rounded-md flex justify-between items-center px-4 sm:px-5 tracking-wider hover:bg-[#d1b990] transition"
            >
              <span>{loading ? 'Creating...' : 'CREATE ACCOUNT'}</span>
              <span className="text-base sm:text-lg">→</span>
            </button>
          </div>

          <div className="text-center mt-3 sm:mt-4 text-xs sm:text-sm uppercase tracking-widest text-[#4A3F36] font-medium">
            <Link to="/login">Back to Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
