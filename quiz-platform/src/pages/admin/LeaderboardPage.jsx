import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Medal, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { quizService } from '../../services/quizService';
import { useFetch } from '../../hooks/useFetch';
import { PageLoader, SkeletonTable } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { formatDateTime, scoreBg } from '../../utils/formatters';

const medalColors = ['text-yellow-500', 'text-slate-400', 'text-amber-600'];

export default function LeaderboardPage() {
  const { quizId } = useParams();
  const { data: quiz } = useFetch(() => quizService.getById(quizId), [quizId]);
  const { data: leaderboard, loading } = useFetch(() => adminService.getLeaderboard(quizId), [quizId]);

  const entries = Array.isArray(leaderboard) ? leaderboard : [];

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Manage Quizzes', path: '/admin/quizzes' },
        { label: quiz?.title || 'Quiz' },
        { label: 'Leaderboard' },
      ]} />
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-header mb-1">Leaderboard</h1>
          <p className="text-dark-500 dark:text-dark-400">{quiz?.title || 'Quiz'}</p>
        </div>
        <Link to="/admin/quizzes" className="btn-secondary">
          <ArrowLeft size={16} /> Back
        </Link>
      </div>

      {/* Top 3 podium */}
      {entries.length >= 3 && (
        <div className="flex items-end justify-center gap-4 mb-8">
          {[entries[1], entries[0], entries[2]].map((entry, i) => {
            const rank = i === 1 ? 1 : i === 0 ? 2 : 3;
            const heights = ['h-24', 'h-32', 'h-20'];
            return (
              <motion.div
                key={entry?.userId || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex flex-col items-center gap-2 ${i === 1 ? 'order-2' : i === 0 ? 'order-1' : 'order-3'}`}
              >
                <Trophy size={20} className={medalColors[rank - 1]} />
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{entry?.userName?.[0] || rank}</span>
                </div>
                <p className="text-xs font-medium text-dark-700 dark:text-dark-300 text-center w-20 truncate">
                  {entry?.userName || entry?.userEmail || `User ${rank}`}
                </p>
                <div className={`w-20 ${heights[i]} flex items-center justify-center rounded-t-xl ${
                  rank === 1 ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                  rank === 2 ? 'bg-slate-100 dark:bg-slate-800/30' :
                  'bg-amber-100 dark:bg-amber-900/30'
                }`}>
                  <span className={`font-display font-bold text-lg ${medalColors[rank - 1]}`}>#{rank}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {loading ? (
        <SkeletonTable rows={8} />
      ) : entries.length === 0 ? (
        <EmptyState icon={Trophy} title="No entries yet" description="No one has completed this quiz yet." />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-100 dark:border-dark-700 bg-dark-50/50 dark:bg-dark-900/30">
                {['Rank', 'User', 'Score', 'Date'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-dark-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-50 dark:divide-dark-700/50">
              {entries.map((entry, i) => (
                <motion.tr
                  key={entry.userId || entry.attemptId || i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className={`hover:bg-dark-50/50 dark:hover:bg-dark-700/20 transition-colors ${i < 3 ? 'font-medium' : ''}`}
                >
                  <td className="px-5 py-4">
                    <span className={`flex items-center gap-2 ${i < 3 ? medalColors[i] : 'text-dark-500 dark:text-dark-400'}`}>
                      {i < 3 ? <Medal size={16} /> : null}
                      #{i + 1}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shrink-0">
                        <span className="text-white text-xs font-semibold">
                          {(entry.userName || entry.userEmail || 'U')[0].toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-dark-800 dark:text-dark-200">
                        {entry.userName || entry.userEmail || `User ${entry.userId}`}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`badge ${scoreBg(entry.score || 0)}`}>{entry.score || 0}%</span>
                  </td>
                  <td className="px-5 py-4 text-sm text-dark-500 dark:text-dark-400">
                    {formatDateTime(entry.submittedAt || entry.createdAt)}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
