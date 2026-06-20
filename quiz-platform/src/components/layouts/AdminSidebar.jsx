import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, BookOpen, Plus, BarChart2,
  Trophy, Activity, X, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/admin/quizzes', icon: BookOpen, label: 'Manage Quizzes' },
  { to: '/admin/quizzes/create', icon: Plus, label: 'Create Quiz' },
  { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
];

export const AdminSidebar = ({ mobileOpen, onClose }) => {
  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
      isActive
        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
        : 'text-dark-600 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-700 hover:text-dark-900 dark:hover:text-white'
    }`;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-3 py-2 mb-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-dark-400 dark:text-dark-500 px-3 mb-2">
          Admin Panel
        </p>
        <nav className="space-y-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={navClass}
              onClick={onClose}
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-dark-100 dark:border-dark-700 pt-6 pb-4 min-h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-white dark:bg-dark-800 border-r border-dark-100 dark:border-dark-700 pt-4 pb-4 lg:hidden"
            >
              <div className="flex items-center justify-between px-4 mb-4">
                <span className="font-display font-bold text-dark-900 dark:text-white">Admin Panel</span>
                <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700">
                  <X size={18} />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
