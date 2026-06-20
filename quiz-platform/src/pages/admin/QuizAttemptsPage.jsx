import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Search, ArrowLeft, ArrowRight } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { quizService } from '../../services/quizService';
import { useFetch } from '../../hooks/useFetch';
import { SkeletonTable } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Pagination } from '../../components/common/Pagination';
import { formatDateTime, scoreBg } from '../../utils/formatters';

const PER_PAGE = 10;

export default function QuizAttemptsPage() {
  const { quizId } = useParams();
  const { data: quiz } = useFetch(() => quizService.getById(quizId), [quizId]);
  const { data: attempts, loading } = useFetch(() => adminService.getAttempts(quizId), [quizId]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const list = Array.isArray(attempts) ? attempts : [];
  const filtered = list.filter(a =>
    (a.userName || a.userEmail || '').toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const avgScore = list.length ? Math.round(list.reduce((s, a) => s + (a.score || 0), 0) / list.length) : 0;

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Manage Quizzes', path: '/admin/quizzes' },
        { label: quiz?.title || 'Quiz' },
        { label: 'Attempts' },
      ]} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-header mb-1">Quiz Attempts</h1>
          <p className="text-dark-500 dark:text-dark-400">{quiz?.title} — {list.length} total attempts</p>
        </div>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={15} />
          <input
            type="text"
            placeholder="Search by user…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-9 !py-2"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Attempts', value: list.length },
          { label: 'Average Score', value: `${avgScore}%` },
          { label: 'Pass Rate', value: `${list.length ? Math.round(list.filter(a => (a.score || 0) >= 60).length / list.length * 100) : 0}%` },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <p className="font-display font-bold text-xl text-dark-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-dark-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <SkeletonTable rows={8} />
      ) : paginated.length === 0 ? (
        <EmptyState icon={Activity} title="No attempts found" description={search ? 'Try a different search.' : 'No one has attempted this quiz yet.'} />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-100 dark:border-dark-700 bg-dark-50/50 dark:bg-dark-900/30">
                  {['User', 'Score', 'Status', 'Date', ''].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-dark-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-50 dark:divide-dark-700/50">
                {paginated.map((a, i) => (
                  <motion.tr
                    key={a.attemptId || a.id || i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-dark-50/50 dark:hover:bg-dark-700/20 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shrink-0">
                          <span className="text-white text-xs font-semibold">
                            {(a.userName || a.userEmail || 'U')[0].toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm text-dark-800 dark:text-dark-200">
                          {a.userName || a.userEmail || `User ${a.userId}`}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${scoreBg(a.score || 0)}`}>{a.score || 0}%</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${(a.score || 0) >= 60
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                        {(a.score || 0) >= 60 ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-dark-500 dark:text-dark-400">
                      {formatDateTime(a.submittedAt || a.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <Link to={`/results/${a.attemptId || a.id}`} className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline">
                        View <ArrowRight size={14} />
                      </Link>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 pb-4">
            <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
          </div>
        </div>
      )}

      <div className="mt-6">
        <Link to="/admin/quizzes" className="btn-secondary">
          <ArrowLeft size={16} /> Back to Quizzes
        </Link>
      </div>
    </div>
  );
}
