import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Plus, Search, Edit2, Trash2, ToggleLeft, ToggleRight,
  HelpCircle, BarChart2, Trophy, Eye
} from 'lucide-react';
import { quizService } from '../../services/quizService';
import { adminService } from '../../services/adminService';
import { useFetch } from '../../hooks/useFetch';
import { useAsync } from '../../hooks/useAsync';
import { SkeletonTable } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Pagination } from '../../components/common/Pagination';
import { getErrorMessage } from '../../utils/formatters';

const PER_PAGE = 8;

export default function ManageQuizzesPage() {
  const { data, loading, refetch } = useFetch(() => quizService.getAll(), []);
  const { execute } = useAsync();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const quizzes = Array.isArray(data) ? data : [];
  const filtered = quizzes.filter(q =>
    q.title?.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteQuiz(deleteTarget.id);
      toast.success('Quiz deleted');
      refetch();
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
    setDeleting(false);
  };

  const handleToggle = async (quiz) => {
    try {
      await execute(() => adminService.toggleStatus(quiz.id));
      toast.success(`Quiz ${quiz.active !== false ? 'deactivated' : 'activated'}`);
      refetch();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: 'Manage Quizzes' }]} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-header mb-1">Manage Quizzes</h1>
          <p className="text-dark-500 dark:text-dark-400">{quizzes.length} total quizzes</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={15} />
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-9 !py-2 max-w-48"
            />
          </div>
          <Link to="/admin/quizzes/create" className="btn-primary">
            <Plus size={16} /> New Quiz
          </Link>
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={6} />
      ) : paginated.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No quizzes found"
          description={search ? 'Try a different search.' : 'Create your first quiz to get started.'}
          action={!search && <Link to="/admin/quizzes/create" className="btn-primary"><Plus size={16} /> Create Quiz</Link>}
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-100 dark:border-dark-700 bg-dark-50/50 dark:bg-dark-900/30">
                  {['Quiz', 'Questions', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-dark-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-50 dark:divide-dark-700/50">
                {paginated.map((q, i) => (
                  <motion.tr
                    key={q.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="hover:bg-dark-50/50 dark:hover:bg-dark-700/20 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-dark-900 dark:text-white text-sm">{q.title}</p>
                      {q.description && (
                        <p className="text-xs text-dark-400 mt-0.5 line-clamp-1 max-w-xs">{q.description}</p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-dark-600 dark:text-dark-400">{q.questionCount || 0}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`badge ${q.active !== false
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-dark-100 dark:bg-dark-700 text-dark-500 dark:text-dark-400'}`}>
                        {q.active !== false ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggle(q)}
                          title={q.active !== false ? 'Deactivate' : 'Activate'}
                          className="p-1.5 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          {q.active !== false ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
                        </button>
                        <Link
                          to={`/admin/quizzes/${q.id}/questions`}
                          className="p-1.5 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 text-dark-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          title="Questions"
                        >
                          <HelpCircle size={17} />
                        </Link>
                        <Link
                          to={`/admin/quizzes/${q.id}/leaderboard`}
                          className="p-1.5 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 text-dark-400 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
                          title="Leaderboard"
                        >
                          <Trophy size={17} />
                        </Link>
                        <Link
                          to={`/admin/quizzes/${q.id}/attempts`}
                          className="p-1.5 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 text-dark-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                          title="Attempts"
                        >
                          <BarChart2 size={17} />
                        </Link>
                        <Link
                          to={`/admin/quizzes/${q.id}/edit`}
                          className="p-1.5 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 text-dark-400 hover:text-dark-700 dark:hover:text-dark-200 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={17} />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(q)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-dark-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
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

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Quiz"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
      />
    </div>
  );
}
