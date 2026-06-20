import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Save, X } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { getErrorMessage } from '../../utils/formatters';

const OPTIONS = ['A', 'B', 'C', 'D'];

export default function CreateQuestionPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { correctAnswer: 'A', marks: 1 }
  });

  const onSubmit = async (data) => {
    try {
      await adminService.addQuestion(quizId, {
        ...data,
        marks: data.marks ? parseInt(data.marks) : 1,
      });
      toast.success('Question added!');
      navigate(`/admin/quizzes/${quizId}/questions`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Manage Quizzes', path: '/admin/quizzes' },
        { label: 'Questions', path: `/admin/quizzes/${quizId}/questions` },
        { label: 'Add Question' },
      ]} />
      <h1 className="page-header mb-6">Add New Question</h1>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="card p-6 space-y-5">
            <h2 className="section-title">Question</h2>
            <div>
              <label className="label">Question Text <span className="text-red-500">*</span></label>
              <textarea
                {...register('questionText', { required: 'Question text is required' })}
                rows={3}
                className="input-field !h-auto resize-none"
                placeholder="Enter your question here…"
              />
              {errors.questionText && <p className="text-red-500 text-xs mt-1.5">{errors.questionText.message}</p>}
            </div>
            <div>
              <label className="label">Marks <span className="text-red-500">*</span></label>
              <input
                {...register('marks', {
                  required: 'Marks is required',
                  min: { value: 1, message: 'Minimum 1 mark' },
                })}
                type="number"
                className="input-field"
                placeholder="e.g. 1"
              />
              {errors.marks && <p className="text-red-500 text-xs mt-1.5">{errors.marks.message}</p>}
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h2 className="section-title">Answer Options</h2>
            {OPTIONS.map((opt) => (
              <div key={opt}>
                <label className="label">Option {opt} <span className="text-red-500">*</span></label>
                <input
                  {...register(`option${opt}`, { required: `Option ${opt} is required` })}
                  className="input-field"
                  placeholder={`Option ${opt}`}
                />
                {errors[`option${opt}`] && (
                  <p className="text-red-500 text-xs mt-1.5">{errors[`option${opt}`].message}</p>
                )}
              </div>
            ))}
          </div>

          <div className="card p-6">
            <h2 className="section-title mb-4">Correct Answer</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {OPTIONS.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2.5 p-3 rounded-xl border-2 border-dark-100 dark:border-dark-700 cursor-pointer hover:border-primary-300 dark:hover:border-primary-700 transition-colors has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 dark:has-[:checked]:bg-primary-900/20"
                >
                  <input {...register('correctAnswer')} type="radio" value={opt} className="accent-primary-600" />
                  <span className="font-semibold text-dark-800 dark:text-dark-200">Option {opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              <Save size={16} /> {isSubmitting ? 'Adding…' : 'Add Question'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate(`/admin/quizzes/${quizId}/questions`)}
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
