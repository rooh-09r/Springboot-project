import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { BookOpen, HelpCircle, Clock, Play, ArrowLeft } from 'lucide-react';
import { quizService } from '../../services/quizService';
import { useFetch } from '../../hooks/useFetch';
import { useAsync } from '../../hooks/useAsync';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { getErrorMessage } from '../../utils/formatters';

export default function QuizDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: quiz, loading } = useFetch(() => quizService.getById(id), [id]);
  const { execute, loading: starting } = useAsync();

  const handleStart = async () => {
    try {
      const res = await execute(() => quizService.startAttempt(id));
      const attemptId = res.data?.attemptId || res.data?.id;
      navigate(`/quiz/${id}/attempt/${attemptId}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) return <PageLoader />;
  if (!quiz) return <div className="text-center py-20 text-dark-400">Quiz not found.</div>;

  return (
    <div className="max-w-3xl mx-auto">
      <Breadcrumb items={[{ label: 'Quizzes', path: '/quizzes' }, { label: quiz.title }]} />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="card p-8">
        <div className="flex items-start gap-5 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/20">
            <BookOpen className="text-white" size={24} />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-dark-900 dark:text-white mb-1">{quiz.title}</h1>
            <span className={`badge ${quiz.active !== false ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-dark-100 text-dark-500'}`}>
              {quiz.active !== false ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        {quiz.description && (
          <p className="text-dark-600 dark:text-dark-300 mb-6 leading-relaxed">{quiz.description}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {quiz.questionCount && (
            <div className="bg-dark-50 dark:bg-dark-900 rounded-xl p-4">
              <HelpCircle className="text-primary-500 mb-2" size={18} />
              <p className="text-xl font-display font-bold text-dark-900 dark:text-white">{quiz.questionCount}</p>
              <p className="text-xs text-dark-500">Questions</p>
            </div>
          )}
          {quiz.timeLimit && (
            <div className="bg-dark-50 dark:bg-dark-900 rounded-xl p-4">
              <Clock className="text-accent-500 mb-2" size={18} />
              <p className="text-xl font-display font-bold text-dark-900 dark:text-white">{quiz.timeLimit}m</p>
              <p className="text-xs text-dark-500">Time Limit</p>
            </div>
          )}
          {quiz.passingScore && (
            <div className="bg-dark-50 dark:bg-dark-900 rounded-xl p-4">
              <p className="text-xl font-display font-bold text-dark-900 dark:text-white mb-1">{quiz.passingScore}%</p>
              <p className="text-xs text-dark-500">Passing Score</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button onClick={() => navigate(-1)} className="btn-secondary">
            <ArrowLeft size={16} /> Back
          </button>
          <button
            onClick={handleStart}
            disabled={starting || quiz.active === false}
            className="btn-primary flex-1"
          >
            {starting ? 'Starting…' : <><Play size={16} /> Start Quiz</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
