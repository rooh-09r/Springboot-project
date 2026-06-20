import { Link, useNavigate } from 'react-router-dom';
import { Moon, Sun, LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 glass border-b border-dark-200 dark:border-dark-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white font-display font-bold text-sm">Q</span>
          </div>
          <span className="font-display font-bold text-dark-900 dark:text-white text-lg hidden sm:block">
            QuizMaster
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {user && (
            <>
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              >
                <LayoutDashboard size={15} />
                Dashboard
              </Link>
              {!isAdmin && (
                <Link
                  to="/quizzes"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                >
                  Browse Quizzes
                </Link>
              )}
            </>
          )}
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 rounded-xl text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to={isAdmin ? '/admin/profile' : '/profile'}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {user.email?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-dark-700 dark:text-dark-300 hidden sm:block max-w-32 truncate">
                  {user.email}
                </span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-dark-500 dark:text-dark-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Logout"
              >
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-secondary !py-2 !text-sm">Login</Link>
              <Link to="/register" className="btn-primary !py-2 !text-sm">Get Started</Link>
            </div>
          )}

          <button
            className="md:hidden p-2 rounded-xl text-dark-500"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && user && (
        <div className="md:hidden border-t border-dark-100 dark:border-dark-700 bg-white dark:bg-dark-800 px-4 py-3 space-y-1">
          <Link
            to={isAdmin ? '/admin' : '/dashboard'}
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700"
            onClick={() => setMobileOpen(false)}
          >
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          {!isAdmin && (
            <Link
              to="/quizzes"
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700"
              onClick={() => setMobileOpen(false)}
            >
              Browse Quizzes
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
