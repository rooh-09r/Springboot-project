import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Search, ArrowRight, Trophy } from 'lucide-react';
import { resultService } from '../../services/resultService';
import { useFetch } from '../../hooks/useFetch';
import { PageLoader, SkeletonTable } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Pagination } from '../../components/common/Pagination';
import { formatDateTime, scoreBg } from '../../utils/formatters';

const PER_PAGE = 10;

export default function AttemptHistoryPage() {
  const { data, loading } = useFetch(() => resultService.getMyHistory(), []);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const history = Array.isArray(data) ? data : [];
  const filtered = history.filter((a) =>
    a.quizTitle?.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div>
      <Breadcrumb items={[{ label: 'Attempt History' }]} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-header mb-1">Attempt History</h1>
          <p className="text-dark-500 dark:text-dark-400">{history.length} total attempts</p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={16} />
          <input
            type="text"
            placeholder="Search by quiz name…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="input-field pl-9"
          />
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={8} />
      ) : paginated.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No attempts found"
          description={search ? 'Try a different search.' : 'Complete your first quiz to see history here.'}
          action={!search && <Link to="/quizzes" className="btn-primary">Browse Quizzes</Link>}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-100 dark:border-dark-700">
                  {['Quiz', 'Score', 'Status', 'Date', ''].map((h) => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-dark-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-50 dark:divide-dark-700">
                {paginated.map((a, i) => (
                  <motion.tr
                    key={a.attemptId || a.id || i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="hover:bg-dark-50/50 dark:hover:bg-dark-700/30 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
                          <Trophy size={14} className="text-primary-600 dark:text-primary-400" />
                        </div>
                        <span className="text-sm font-medium text-dark-800 dark:text-dark-200">
                          {a.quizTitle || 'Quiz'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${scoreBg(a.score || 0)}`}>{a.score || 0}%</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${(a.score || 0) >= (a.passingScore || 60)
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                        {(a.score || 0) >= (a.passingScore || 60) ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-dark-500 dark:text-dark-400">
                      {formatDateTime(a.submittedAt || a.createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <Link
                        to={`/results/${a.attemptId || a.id}`}
                        className="flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:underline"
                      >
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
    </div>
  );
}
