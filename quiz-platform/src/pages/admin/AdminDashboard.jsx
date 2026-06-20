import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Users, BarChart2, Trophy, Plus, ArrowRight, Activity } from 'lucide-react';
import { quizService } from '../../services/quizService';
import { useFetch } from '../../hooks/useFetch';
import { EmptyState } from '../../components/common/EmptyState';
import { SkeletonCard } from '../../components/common/LoadingSpinner';
import { formatDateTime } from '../../utils/formatters';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const { data: quizzes, loading } = useFetch(() => quizService.getAll(), []);
  const quizList = Array.isArray(quizzes) ? quizzes : [];
  const activeCount = quizList.filter(q => q.active !== false).length;

  const stats = [
    { label: 'Total Quizzes', value: quizList.length, icon: BookOpen, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { label: 'Active Quizzes', value: activeCount, icon: Activity, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Inactive', value: quizList.length - activeCount, icon: BarChart2, color: 'text-dark-400', bg: 'bg-dark-50 dark:bg-dark-800' },
    { label: 'Total Questions', value: quizList.reduce((s, q) => s + (q.questionCount || 0), 0), icon: Trophy, color: 'text-accent-500', bg: 'bg-accent-50 dark:bg-accent-900/20' },
  ];

  // Placeholder activity data
  const activityData = Array.from({ length: 7 }, (_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    attempts: Math.floor(Math.random() * 50) + 10,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-header mb-1">Admin Dashboard</h1>
          <p className="text-dark-500 dark:text-dark-400">Manage your platform.</p>
        </div>
        <Link to="/admin/quizzes/create" className="btn-primary">
          <Plus size={16} /> New Quiz
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card p-5"
          >
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon size={18} className={s.color} />
            </div>
            <p className="font-display font-bold text-2xl text-dark-900 dark:text-white">{s.value}</p>
            <p className="text-sm text-dark-500 dark:text-dark-400 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activity chart */}
        <div className="card p-6">
          <h2 className="section-title mb-4">Weekly Activity</h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={activityData}>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6371f5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6371f5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e6f3" className="dark:opacity-10" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="attempts" stroke="#6371f5" fill="url(#gradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent quizzes */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Recent Quizzes</h2>
            <Link to="/admin/quizzes" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              View all <ArrowRight size={13} />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
          ) : quizList.length === 0 ? (
            <EmptyState icon={BookOpen} title="No quizzes yet" description="Create your first quiz." />
          ) : (
            <div className="space-y-2">
              {quizList.slice(0, 5).map((q) => (
                <Link
                  key={q.id}
                  to={`/admin/quizzes/${q.id}/questions`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-dark-800 dark:text-dark-200">{q.title}</p>
                    <p className="text-xs text-dark-400 mt-0.5">{q.questionCount || 0} questions</p>
                  </div>
                  <span className={`badge ${q.active !== false ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-dark-100 dark:bg-dark-700 text-dark-500'}`}>
                    {q.active !== false ? 'Active' : 'Inactive'}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        {[
          { to: '/admin/quizzes/create', icon: Plus, label: 'Create Quiz', desc: 'Add a new quiz', color: 'text-primary-500' },
          { to: '/admin/quizzes', icon: BookOpen, label: 'Manage Quizzes', desc: 'Edit or delete quizzes', color: 'text-blue-500' },
          { to: '/admin/analytics', icon: BarChart2, label: 'Analytics', desc: 'View platform stats', color: 'text-accent-500' },
        ].map((a) => (
          <Link key={a.to} to={a.to} className="card p-5 hover:shadow-md transition-shadow group">
            <a.icon size={20} className={`${a.color} mb-3 group-hover:scale-110 transition-transform`} />
            <p className="font-medium text-dark-900 dark:text-white">{a.label}</p>
            <p className="text-sm text-dark-500 dark:text-dark-400 mt-0.5">{a.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
