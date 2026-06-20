import { motion } from 'framer-motion';
import { BarChart2, BookOpen, Activity, TrendingUp } from 'lucide-react';
import { quizService } from '../../services/quizService';
import { useFetch } from '../../hooks/useFetch';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const PIE_COLORS = ['#6371f5', '#f97316', '#22c55e', '#a855f7', '#06b6d4'];

export default function AdminAnalyticsPage() {
  const { data: quizzes, loading } = useFetch(() => quizService.getAll(), []);
  const quizList = Array.isArray(quizzes) ? quizzes : [];

  if (loading) return <PageLoader />;

  const activeCount = quizList.filter((q) => q.active !== false).length;
  const inactiveCount = quizList.length - activeCount;

  const statusData = [
    { name: 'Active', value: activeCount },
    { name: 'Inactive', value: inactiveCount },
  ];

  const quizBarData = quizList.slice(0, 10).map((q) => ({
    name: q.title?.slice(0, 18) + (q.title?.length > 18 ? '…' : ''),
    questions: q.questionCount || 0,
  }));

  return (
    <div>
      <Breadcrumb items={[{ label: 'Analytics' }]} />
      <h1 className="page-header mb-6">Analytics</h1>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Quizzes', value: quizList.length, icon: BookOpen, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
          { label: 'Active', value: activeCount, icon: Activity, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Inactive', value: inactiveCount, icon: TrendingUp, color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
          { label: 'Total Questions', value: quizList.reduce((s, q) => s + (q.questionCount || 0), 0), icon: BarChart2, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="card p-5"
          >
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={s.color} size={18} />
            </div>
            <p className="font-display font-bold text-2xl text-dark-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-dark-400 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Status pie */}
        <div className="card p-6">
          <h2 className="section-title mb-4">Quiz Status Distribution</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                innerRadius={50}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {statusData.map((_, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Questions per quiz */}
        <div className="card p-6">
          <h2 className="section-title mb-4">Questions per Quiz</h2>
          {quizBarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={quizBarData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={100} />
                <Tooltip />
                <Bar dataKey="questions" fill="#6371f5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-dark-400 text-sm text-center py-10">No quiz data available.</p>
          )}
        </div>
      </div>

      {/* Quiz list with links */}
      <div className="card p-6">
        <h2 className="section-title mb-4">Quick Access</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quizList.map((q) => (
            <div key={q.id} className="p-3 rounded-xl bg-dark-50 dark:bg-dark-900 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-dark-800 dark:text-dark-200 truncate">{q.title}</p>
                <p className="text-xs text-dark-400">{q.questionCount || 0} questions</p>
              </div>
              <div className="flex gap-1.5 ml-2 shrink-0">
                <Link
                  to={`/admin/quizzes/${q.id}/leaderboard`}
                  className="text-xs px-2 py-1 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:opacity-80 transition-opacity"
                >
                  LB
                </Link>
                <Link
                  to={`/admin/quizzes/${q.id}/attempts`}
                  className="text-xs px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:opacity-80 transition-opacity"
                >
                  Att
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
