import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, HelpCircle, ArrowLeft } from 'lucide-react';
import { quizService } from '../../services/quizService';
import { adminService } from '../../services/adminService';
import { useFetch } from '../../hooks/useFetch';
import { SkeletonTable } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { getErrorMessage } from '../../utils/formatters';

export default function QuizQuestionsPage() {
  const { quizId } = useParams();
  const { data: quiz } = useFetch(() => quizService.getById(quizId), [quizId]);
  const { data: questions, loading, refetch } = useFetch(
    () => quizService.getQuestions(quizId), [quizId]
  );
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const qList = Array.isArray(questions) ? questions : [];

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await adminService.deleteQuestion(deleteTarget.id);
      toast.success('Question deleted');
      refetch();
      setDeleteTarget(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
    setDeleting(false);
  };

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Manage Quizzes', path: '/admin/quizzes' },
        { label: quiz?.title || 'Quiz', path: `/admin/quizzes/${quizId}/edit` },
        { label: 'Questions' },
      ]} />

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="page-header mb-1">{quiz?.title || 'Quiz'} — Questions</h1>
          <p className="text-dark-500 dark:text-dark-400">{qList.length} questions</p>
        </div>
        <Link to={`/admin/quizzes/${quizId}/questions/create`} className="btn-primary">
          <Plus size={16} /> Add Question
        </Link>
      </div>

      {loading ? (
        <SkeletonTable rows={5} />
      ) : qList.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          title="No questions yet"
          description="Add your first question to this quiz."
          action={
            <Link to={`/admin/quizzes/${quizId}/questions/create`} className="btn-primary">
              <Plus size={16} /> Add Question
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {qList.map((q, i) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="card p-5 flex items-start justify-between gap-4"
            >
              <div className="flex items-start gap-4 min-w-0">
                <span className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-bold shrink-0">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-dark-900 dark:text-white text-sm leading-relaxed mb-2">
                    {q.questionText || q.text || q.question}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['A', 'B', 'C', 'D'].map((label) => {
                      const text = q[`option${label}`] || (q.options?.find(o => o.label === label)?.text);
                      if (!text) return null;
                      const isCorrect = q.correctAnswer === label;
                      return (
                        <span
                          key={label}
                          className={`text-xs px-2.5 py-1 rounded-lg font-medium ${
                            isCorrect
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-400'
                          }`}
                        >
                          {label}: {text}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Link
                  to={`/admin/questions/${q.id}/edit?quizId=${quizId}`}
                  className="p-1.5 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 text-dark-400 hover:text-dark-700 dark:hover:text-dark-200 transition-colors"
                >
                  <Edit2 size={16} />
                </Link>
                <button
                  onClick={() => setDeleteTarget(q)}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-dark-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Link to="/admin/quizzes" className="btn-secondary">
          <ArrowLeft size={16} /> Back to Quizzes
        </Link>
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Question"
        message="Are you sure you want to delete this question?"
        confirmLabel="Delete"
      />
    </div>
  );
}
