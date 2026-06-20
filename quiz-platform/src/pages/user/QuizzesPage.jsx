import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, BookOpen, Clock, HelpCircle, ArrowRight, Filter } from 'lucide-react';
import { quizService } from '../../services/quizService';
import { useFetch } from '../../hooks/useFetch';
import { useAuth } from '../../context/AuthContext';
import { SkeletonCard, PageLoader } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Breadcrumb } from '../../components/common/Breadcrumb';

const QuizCard = ({ quiz }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
    className="card p-6 flex flex-col"
  >
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center shrink-0">
        <BookOpen className="text-primary-600 dark:text-primary-400" size={18} />
      </div>
      <span className={`badge ${quiz.active !== false ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-dark-100 dark:bg-dark-700 text-dark-500'}`}>
        {quiz.active !== false ? 'Active' : 'Inactive'}
      </span>
    </div>
    <h3 className="font-display font-semibold text-dark-900 dark:text-white mb-2 line-clamp-2">
      {quiz.title}
    </h3>
    <p className="text-sm text-dark-500 dark:text-dark-400 mb-4 flex-1 line-clamp-2">
      {quiz.description || 'Test your knowledge with this quiz.'}
    </p>
    <div className="flex items-center justify-between mt-auto pt-4 border-t border-dark-100 dark:border-dark-700">
      <div className="flex items-center gap-3 text-xs text-dark-400">
        {quiz.questionCount && (
          <span className="flex items-center gap-1">
            <HelpCircle size={12} /> {quiz.questionCount} Qs
          </span>
        )}
        {quiz.timeLimit && (
          <span className="flex items-center gap-1">
            <Clock size={12} /> {quiz.timeLimit}m
          </span>
        )}
      </div>
      <Link
        to={`/quizzes/${quiz.id}`}
        className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
      >
        View <ArrowRight size={14} />
      </Link>
    </div>
  </motion.div>
);

export default function QuizzesPage() {
  const [search, setSearch] = useState('');
  const { isAdmin } = useAuth();
  const { data, loading } = useFetch(() => quizService.getAll(), []);
  const quizzes = Array.isArray(data) ? data : [];

  const filtered = quizzes
    .filter((q) => isAdmin || q.active !== false)
    .filter((q) =>
      q.title?.toLowerCase().includes(search.toLowerCase()) ||
      q.description?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div>
      <Breadcrumb items={[{ label: 'Quizzes' }]} />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="page-header mb-1">Browse Quizzes</h1>
          <p className="text-dark-500 dark:text-dark-400">
            {quizzes.length} quizzes available
          </p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" size={16} />
          <input
            type="text"
            placeholder="Search quizzes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title={search ? 'No matching quizzes' : 'No quizzes available'}
          description={search ? 'Try a different search term.' : 'Check back later for new quizzes.'}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((q) => <QuizCard key={q.id} quiz={q} />)}
        </div>
      )}
    </div>
  );
}
