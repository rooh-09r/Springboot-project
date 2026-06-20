import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { quizService } from '../../services/quizService';
import { useFetch } from '../../hooks/useFetch';
import { useAsync } from '../../hooks/useAsync';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { getErrorMessage } from '../../utils/formatters';

export default function QuizAttemptPage() {
  const { quizId, attemptId } = useParams();
  const navigate = useNavigate();
  const { data: questions, loading } = useFetch(() => quizService.getQuestions(quizId), [quizId]);
  const { execute, loading: submitting } = useAsync();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);

  const qList = Array.isArray(questions) ? questions : [];

  // Initialize timer if quiz has time limit (stored in session)
  useEffect(() => {
    const limitKey = `quiz_time_${attemptId}`;
    const stored = sessionStorage.getItem(limitKey);
    if (stored) {
      setTimeLeft(parseInt(stored));
    }
  }, [attemptId]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const handleAnswer = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = useCallback(async () => {
    const payload = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
      questionId: parseInt(questionId),
      selectedAnswer,
    }));

    try {
      const res = await execute(() => quizService.submitAttempt(attemptId, payload));
      const resultAttemptId = res.data?.attemptId || attemptId;
      toast.success('Quiz submitted!');
      navigate(`/results/${resultAttemptId}`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
    setShowConfirm(false);
  }, [answers, quizId, attemptId, execute, navigate]);

  if (loading) return <PageLoader />;
  if (qList.length === 0) return (
    <div className="text-center py-20">
      <AlertCircle className="mx-auto text-dark-400 mb-3" size={36} />
      <p className="text-dark-500">No questions found for this quiz.</p>
    </div>
  );

  const current = qList[currentIdx];
  const answered = Object.keys(answers).length;
  const progress = (answered / qList.length) * 100;
  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header bar */}
      <div className="card p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-dark-600 dark:text-dark-400">
            Question {currentIdx + 1} of {qList.length}
          </span>
          <div className="h-1.5 w-40 bg-dark-100 dark:bg-dark-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIdx + 1) / qList.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-dark-500">
            {answered}/{qList.length} answered
          </span>
          {timeLeft !== null && (
            <div className={`flex items-center gap-1.5 text-sm font-mono font-semibold ${timeLeft < 60 ? 'text-red-500' : 'text-dark-700 dark:text-dark-300'}`}>
              <Clock size={14} />
              {formatTime(timeLeft)}
            </div>
          )}
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex flex-wrap gap-1.5 mb-6">
        {qList.map((q, i) => (
          <button
            key={i}
            onClick={() => setCurrentIdx(i)}
            className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
              i === currentIdx
                ? 'bg-primary-600 text-white shadow-sm'
                : answers[q.id]
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-dark-100 dark:bg-dark-700 text-dark-500'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="card p-8 mb-6"
        >
          <div className="flex items-start gap-3 mb-6">
            <span className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-bold shrink-0">
              {currentIdx + 1}
            </span>
            <p className="text-dark-900 dark:text-white font-medium leading-relaxed text-lg">
              {current.questionText || current.text || current.question}
            </p>
          </div>

          <div className="space-y-3">
            {(current.options || [
              { label: 'A', text: current.optionA },
              { label: 'B', text: current.optionB },
              { label: 'C', text: current.optionC },
              { label: 'D', text: current.optionD },
            ]).filter(o => o.text || o.optionText).map((option, oi) => {
              const label = option.label || optionLabels[oi];
              const text = option.text || option.optionText;
              const isSelected = answers[current.id] === label;

              return (
                <button
                  key={label}
                  onClick={() => handleAnswer(current.id, label)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150 ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-dark-100 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-dark-50 dark:hover:bg-dark-700/50'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-primary-500 text-white'
                      : 'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-400'
                  }`}>
                    {label}
                  </span>
                  <span className={`text-sm leading-relaxed ${isSelected ? 'text-primary-800 dark:text-primary-200 font-medium' : 'text-dark-700 dark:text-dark-300'}`}>
                    {text}
                  </span>
                  {isSelected && <CheckCircle2 size={16} className="ml-auto text-primary-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="btn-secondary"
        >
          <ChevronLeft size={16} /> Previous
        </button>

        {currentIdx < qList.length - 1 ? (
          <button
            onClick={() => setCurrentIdx((i) => i + 1)}
            className="btn-primary"
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            className="btn-primary !bg-green-600 hover:!bg-green-700"
          >
            <CheckCircle2 size={16} /> Submit Quiz
          </button>
        )}
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleSubmit}
        title="Submit Quiz?"
        message={`You've answered ${answered} of ${qList.length} questions. Are you sure you want to submit?`}
        confirmLabel="Submit"
        loading={submitting}
        variant="primary"
      />
    </div>
  );
}
