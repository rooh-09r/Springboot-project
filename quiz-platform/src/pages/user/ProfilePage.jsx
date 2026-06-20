import { motion } from 'framer-motion';
import { User, Mail, Shield, Clock, Trophy, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { resultService } from '../../services/resultService';
import { useFetch } from '../../hooks/useFetch';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { formatDateTime, scoreBg } from '../../utils/formatters';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: history } = useFetch(() => resultService.getMyHistory(), []);
  const attempts = Array.isArray(history) ? history : [];

  const avgScore = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + (a.score || 0), 0) / attempts.length)
    : 0;
  const bestScore = attempts.length ? Math.max(...attempts.map(a => a.score || 0)) : 0;

  // Score distribution
  const buckets = { '0-20': 0, '21-40': 0, '41-60': 0, '61-80': 0, '81-100': 0 };
  attempts.forEach(a => {
    const s = a.score || 0;
    if (s <= 20) buckets['0-20']++;
    else if (s <= 40) buckets['21-40']++;
    else if (s <= 60) buckets['41-60']++;
    else if (s <= 80) buckets['61-80']++;
    else buckets['81-100']++;
  });
  const chartData = Object.entries(buckets).map(([range, count]) => ({ range, count }));

  return (
    <div>
      <Breadcrumb items={[{ label: 'Profile' }]} />
      <h1 className="page-header mb-6">My Profile</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center mb-4 shadow-lg shadow-primary-500/20">
              <span className="text-white font-display font-bold text-3xl">
                {user?.email?.[0]?.toUpperCase()}
              </span>
            </div>
            <h2 className="font-display font-bold text-lg text-dark-900 dark:text-white">
              {user?.email?.split('@')[0]}
            </h2>
            <p className="text-sm text-dark-500 dark:text-dark-400">{user?.email}</p>
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
                <p className="text-sm font-medium text-dark-800 dark:text-dark-200">
                  {user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'User'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats + chart */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Attempts', value: attempts.length, icon: Clock, color: 'text-primary-500' },
              { label: 'Avg Score', value: `${avgScore}%`, icon: TrendingUp, color: 'text-blue-500' },
              { label: 'Best Score', value: `${bestScore}%`, icon: Trophy, color: 'text-accent-500' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card p-5 text-center"
              >
                <s.icon className={`mx-auto mb-2 ${s.color}`} size={20} />
                <p className="font-display font-bold text-2xl text-dark-900 dark:text-white">{s.value}</p>
                <p className="text-xs text-dark-500 mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="card p-6">
            <h2 className="section-title mb-4">Score Distribution</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e6f3" className="dark:opacity-10" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#6371f5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
