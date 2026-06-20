import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getErrorMessage } from '../../utils/formatters';

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-dark-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20">
            <span className="text-white font-display font-bold text-xl">Q</span>
          </div>
          <h2 className="font-display font-bold text-3xl text-dark-900 dark:text-white mb-2">
            Create an account
          </h2>
          <p className="text-dark-500 dark:text-dark-400">
            Already have one?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="label">Full name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" size={16} />
                <input
                  {...register('fullName', { required: 'Full name is required' })}
                  type="text"
                  placeholder="John Doe"
                  className="input-field pl-10"
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs mt-1.5">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="label">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" size={16} />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' },
                  })}
                  type="email"
                  placeholder="you@example.com"
                  className="input-field pl-10"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" size={16} />
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'At least 8 characters' },
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*\d)/,
                      message: 'Must contain uppercase letter and number',
                    },
                  })}
                  type="password"
                  placeholder="••••••••"
                  className="input-field pl-10"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
            </div>

            <div>
              <label className="label">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" size={16} />
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm password',
                    validate: (val) => val === password || 'Passwords do not match',
                  })}
                  type="password"
                  placeholder="••••••••"
                  className="input-field pl-10"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1.5">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label className="label">Register as</label>
              <select
                {...register('role', { required: 'Please select a role' })}
                className="input-field cursor-pointer"
              >
                <option value="USER">User (Take Quizzes)</option>
                <option value="ADMIN">Admin (Manage Quizzes & Questions)</option>
              </select>
              {errors.role && <p className="text-red-500 text-xs mt-1.5">{errors.role.message}</p>}
            </div>

            <button
              type="submit"
              className="btn-primary w-full !py-3 text-base mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account…' : (
                <>Create account <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
