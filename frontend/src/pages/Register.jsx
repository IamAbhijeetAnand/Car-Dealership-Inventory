import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ToastContext } from '../context/ToastContext';
import { Car, Lock, Mail, User, ArrowRight } from 'lucide-react';

export const Register = () => {
  const { register: registerAuth } = useAuth();
  const { addToast } = useContext(ToastContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerAuth(data);
      addToast('Account created successfully! Welcome to DrivePulse.', 'success');
      navigate('/inventory');
    } catch (err) {
      addToast(err.response?.data?.message || 'Registration failed.', 'error');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
            <Car className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-extrabold text-white">Create Customer Account</h2>
          <p className="text-sm text-slate-400">Join DrivePulse to browse inventory, book test drives & purchase vehicles</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                {...register('name', { required: 'Full name is required', minLength: { value: 2, message: 'At least 2 chars' } })}
                placeholder="Jane Doe"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:border-cyan-500"
              />
            </div>
            {errors.name && <span className="text-xs text-rose-400 mt-1 block">{errors.name.message}</span>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                placeholder="jane@example.com"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:border-cyan-500"
              />
            </div>
            {errors.email && <span className="text-xs text-rose-400 mt-1 block">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password (Min 8 Chars)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-5 h-5 text-slate-400" />
              <input
                type="password"
                {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:border-cyan-500"
              />
            </div>
            {errors.password && <span className="text-xs text-rose-400 mt-1 block">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/20 hover:opacity-95 flex items-center justify-center gap-2 transition-all mt-2"
          >
            {isSubmitting ? 'Creating Account...' : 'Register Customer Account'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-800">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
