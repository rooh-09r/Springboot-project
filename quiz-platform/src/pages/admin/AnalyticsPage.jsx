import { motion } from 'framer-motion';
import { BarChart2, BookOpen, Activity, TrendingUp } from 'lucide-react';
import { quizService } from '../../services/quizService';
import { useFetch } from '../../hooks/useFetch';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

const COLORS = ['#6371f5', '#f97316', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
  const { data: quizzes } = useFetch(() => quizService.getAll(), []);
  const quizList = Array.isArray(quizzes) ? quizzes : [];

  const activeVsInactive = [
    { name: 'Active', value: quizList.filter(q => q.active !== false).length },
    { name: 'Inactive', value: quizList.filter(q => q.active === false).length },
  ].filter(d => d.value > 0);

  const questionDistribution = quizList
    .filter(q => q.questionCount)
    .map(q => ({ name: q.title?.slice(0, 20) + (q.title?.length > 20 ? '…' : ''), questions: q.questionCount || 0 }))
    .slice(0, 8);

  // Simulated weekly attempts trend
  const weeklyTrend = Array.from({ length: 8 }, (_, i) => ({
    week: `W${i + 1}`,
    attempts: Math.floor(Math.random() * 80) + 20,
    passed: Math.floor(Math.random() * 50) + 10,
  }));

  const stats = [
    { label: 'Total Quizzes', value: quizList.length, icon: BookOpen, color: 'text-primary-500' },
    { label: 'Active Quizzes', value: quizList.filter(q => q.active !== false).length, icon: Activity, color: 'text-green-500' },
    { label: 'Total Questions', value: quizList.reduce((s, q) => s + (q.questionCount || 0), 0), icon: BarChart2, color: 'text-accent-500' },
    { label: 'Avg Questions/Quiz', value: quizList.length ? Math.round(quizList.reduce((s, q) => s + (q.questionCount || 0), 0) / quizList.length) : 0, icon: TrendingUp, color: 'text-blue-500' },
  ];

  return (
    <div>
      <Breadcrumb items={[{ label: 'Analytics' }]} />
      <h1 className="page-header mb-8">Analytics Dashboard</h1>

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

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Weekly trend */}
        <div className="card p-6">
          <h2 className="section-title mb-4">Weekly Attempts Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e6f3" className="dark:opacity-10" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="attempts" stroke="#6371f5" strokeWidth={2} dot={false} name="Total Attempts" />
              <Line type="monotone" dataKey="passed" stroke="#22c55e" strokeWidth={2} dot={false} name="Passed" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Active vs Inactive pie */}
        <div className="card p-6">
          <h2 className="section-title mb-4">Quiz Status Distribution</h2>
          {activeVsInactive.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={activeVsInactive}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {activeVsInactive.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[220px] text-dark-400 text-sm">No quiz data yet</div>
          )}
        </div>
      </div>

      {/* Question distribution */}
      {questionDistribution.length > 0 && (
        <div className="card p-6">
          <h2 className="section-title mb-4">Questions per Quiz</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={questionDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e6f3" className="dark:opacity-10" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
              <Tooltip />
              <Bar dataKey="questions" fill="#6371f5" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
