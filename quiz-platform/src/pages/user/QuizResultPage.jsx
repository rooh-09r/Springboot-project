import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle2, XCircle, RotateCcw, Home, TrendingUp } from 'lucide-react';
import { resultService } from '../../services/resultService';
import { useFetch } from '../../hooks/useFetch';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { formatDateTime, scoreColor, scoreBg } from '../../utils/formatters';

export default function QuizResultPage() {
  const { attemptId } = useParams();
  const { data: result, loading } = useFetch(() => resultService.getByAttempt(attemptId), [attemptId]);

  if (loading) return <PageLoader />;
  if (!result) return (
    <div className="text-center py-20 text-dark-400">Result not found.</div>
  );

  const score = result.score || result.percentage || 0;
  const isPassed = score >= (result.passingScore || 60);
  const correct = result.correctAnswers ?? result.correct ?? 0;
  const total = result.totalQuestions ?? result.total ?? 0;

  const getGrade = (s) => {
    if (s >= 90) return { label: 'A+', color: 'text-green-500' };
    if (s >= 80) return { label: 'A', color: 'text-green-500' };
    if (s >= 70) return { label: 'B', color: 'text-blue-500' };
    if (s >= 60) return { label: 'C', color: 'text-yellow-500' };
    return { label: 'F', color: 'text-red-500' };
  };
  const grade = getGrade(score);

  const circumference = 2 * Math.PI * 54;
  const strokeDash = (score / 100) * circumference;

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-8 text-center mb-6"
      >
        {/* Score circle */}
        <div className="relative w-36 h-36 mx-auto mb-6">
          <svg viewBox="0 0 120 120" className="transform -rotate-90 w-full h-full">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e6f3" strokeWidth="8" className="dark:stroke-dark-700" />
            <motion.circle
              cx="60" cy="60" r="54"
              fill="none"
              stroke={score >= 60 ? '#22c55e' : '#ef4444'}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${circumference}`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - strokeDash }}
              transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`font-display font-bold text-3xl ${grade.color}`}>{grade.label}</span>
            <span className="font-display font-bold text-xl text-dark-900 dark:text-white">{score}%</span>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3 ${isPassed ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
            {isPassed ? <Trophy size={16} /> : <XCircle size={16} />}
            {isPassed ? 'Passed! Well done.' : 'Not passed. Keep practicing!'}
          </div>

          <h1 className="font-display font-bold text-2xl text-dark-900 dark:text-white mb-1">
            {result.quizTitle || 'Quiz'} — Results
          </h1>
          {result.submittedAt && (
            <p className="text-sm text-dark-400">{formatDateTime(result.submittedAt)}</p>
          )}
        </motion.div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Correct', value: correct, icon: CheckCircle2, color: 'text-green-500' },
          { label: 'Incorrect', value: total - correct, icon: XCircle, color: 'text-red-500' },
          { label: 'Total', value: total, icon: TrendingUp, color: 'text-primary-500' },
        ].map((s) => (
          <div key={s.label} className="card p-5 text-center">
            <s.icon className={`mx-auto mb-2 ${s.color}`} size={20} />
            <p className="font-display font-bold text-2xl text-dark-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-dark-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Answer review */}
      {result.answers && result.answers.length > 0 && (
        <div className="card p-6 mb-6">
          <h2 className="section-title mb-4">Answer Review</h2>
          <div className="space-y-4">
            {result.answers.map((a, i) => (
              <div key={i} className={`p-4 rounded-xl border-l-4 ${a.correct ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-red-500 bg-red-50 dark:bg-red-900/10'}`}>
                <p className="text-sm font-medium text-dark-800 dark:text-dark-200 mb-2">
                  {i + 1}. {a.questionText || a.question}
                </p>
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className={`flex items-center gap-1 ${a.correct ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    Your answer: <strong>{a.selectedAnswer}</strong>
                  </span>
                  {!a.correct && a.correctAnswer && (
                    <span className="text-green-600 dark:text-green-400">
                      Correct: <strong>{a.correctAnswer}</strong>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Link to="/quizzes" className="btn-secondary flex-1 justify-center">
          <Home size={16} /> More Quizzes
        </Link>
        <Link to="/history" className="btn-primary flex-1 justify-center">
          <RotateCcw size={16} /> View History
        </Link>
      </div>
    </div>
  );
}
