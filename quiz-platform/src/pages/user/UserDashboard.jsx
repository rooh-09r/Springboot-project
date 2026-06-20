import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Trophy, CheckCircle2, TrendingUp, ArrowRight, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { resultService } from '../../services/resultService';
import { quizService } from '../../services/quizService';
import { useFetch } from '../../hooks/useFetch';
import { PageLoader, SkeletonCard } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { formatDateTime, scoreBg } from '../../utils/formatters';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function UserDashboard() {
  const { user } = useAuth();
  const { data: history, loading: histLoading } = useFetch(() => resultService.getMyHistory(), []);
  const { data: quizzes, loading: quizLoading } = useFetch(() => quizService.getAll(), []);

  const attempts = Array.isArray(history) ? history : [];
  const quizList = Array.isArray(quizzes) ? quizzes : [];

  const avgScore = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + (a.score || 0), 0) / attempts.length)
    : 0;

  const chartData = attempts
    .slice(-10)
    .map((a, i) => ({ attempt: i + 1, score: a.score || 0 }));

  const stats = [
    { label: 'Quizzes Taken', value: attempts.length, icon: CheckCircle2, color: 'text-green-500' },
    { label: 'Avg Score', value: `${avgScore}%`, icon: TrendingUp, color: 'text-primary-500' },
    { label: 'Best Score', value: attempts.length ? `${Math.max(...attempts.map(a => a.score || 0))}%` : '—', icon: Trophy, color: 'text-accent-500' },
    { label: 'Available', value: quizList.filter(q => q.active !== false).length, icon: BookOpen, color: 'text-blue-500' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="page-header mb-1">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}! 👋
        </h1>
        <p className="text-dark-500 dark:text-dark-400">Here&apos;s your learning overview.</p>
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
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-dark-500 dark:text-dark-400">{s.label}</p>
              <s.icon size={18} className={s.color} />
            </div>
            <p className="font-display font-bold text-2xl text-dark-900 dark:text-white">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Score chart */}
        <div className="card p-6">
          <h2 className="section-title mb-4">Recent Scores</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e6f3" className="dark:opacity-10" />
                <XAxis dataKey="attempt" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#6371f5"
                  strokeWidth={2}
                  dot={{ fill: '#6371f5', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              icon={TrendingUp}
              title="No data yet"
              description="Complete some quizzes to see your progress here."
            />
          )}
        </div>

        {/* Recent attempts */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title">Recent Attempts</h2>
            <Link to="/history" className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              View all
            </Link>
          </div>
          {histLoading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => <div key={i} className="skeleton h-14 rounded-xl" />)}
            </div>
          ) : attempts.length === 0 ? (
            <EmptyState icon={Clock} title="No attempts yet" description="Start a quiz to track your progress." />
          ) : (
            <div className="space-y-2">
              {attempts.slice(0, 5).map((a) => (
                <Link
                  key={a.attemptId || a.id}
                  to={`/results/${a.attemptId || a.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-dark-800 dark:text-dark-200">
                      {a.quizTitle || 'Quiz'}
                    </p>
                    <p className="text-xs text-dark-400 mt-0.5">{formatDateTime(a.submittedAt || a.createdAt)}</p>
                  </div>
                  <span className={`badge ${scoreBg(a.score || 0)}`}>{a.score || 0}%</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/quizzes" className="btn-primary">
          Browse Quizzes <ArrowRight size={16} />
        </Link>
        <Link to="/history" className="btn-secondary">
          View All Attempts
        </Link>
      </div>
    </div>
  );
}
