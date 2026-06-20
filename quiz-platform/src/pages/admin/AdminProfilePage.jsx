import { motion } from 'framer-motion';
import { Shield, Mail } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Breadcrumb } from '../../components/common/Breadcrumb';

export default function AdminProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <Breadcrumb items={[{ label: 'Profile' }]} />
      <h1 className="page-header mb-6">Admin Profile</h1>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-md">
        <div className="card p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center mb-4 shadow-lg">
              <span className="text-white font-display font-bold text-3xl">
                {user?.email?.[0]?.toUpperCase()}
              </span>
            </div>
            <h2 className="font-display font-bold text-lg text-dark-900 dark:text-white">
              {user?.email?.split('@')[0]}
            </h2>
            <span className="badge bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 mt-1">
              Administrator
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-50 dark:bg-dark-900">
              <Mail size={16} className="text-dark-400" />
              <div>
                <p className="text-xs text-dark-400">Email</p>
                <p className="text-sm font-medium text-dark-800 dark:text-dark-200">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-50 dark:bg-dark-900">
              <Shield size={16} className="text-dark-400" />
              <div>
                <p className="text-xs text-dark-400">Role</p>
                <p className="text-sm font-medium text-dark-800 dark:text-dark-200">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
