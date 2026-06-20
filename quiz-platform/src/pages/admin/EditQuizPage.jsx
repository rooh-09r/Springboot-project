import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Save, X } from 'lucide-react';
import { quizService } from '../../services/quizService';
import { adminService } from '../../services/adminService';
import { useFetch } from '../../hooks/useFetch';
import { PageLoader } from '../../components/common/LoadingSpinner';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { getErrorMessage } from '../../utils/formatters';

export default function EditQuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: quiz, loading } = useFetch(() => quizService.getById(id), [id]);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (quiz) {
      reset({
        title: quiz.title,
        category: quiz.category || '',
        description: quiz.description || '',
        timeLimit: quiz.timeLimit || '',
        active: String(quiz.active !== false),
      });
    }
  }, [quiz, reset]);

  const onSubmit = async (data) => {
    try {
      await adminService.updateQuiz(id, {
        title: data.title,
        description: data.description || '',
        category: data.category,
        timeLimit: data.timeLimit ? parseInt(data.timeLimit) : null,
        active: data.active === 'true',
      });
      toast.success('Quiz updated!');
      navigate('/admin/quizzes');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div>
      <Breadcrumb items={[
        { label: 'Manage Quizzes', path: '/admin/quizzes' },
        { label: 'Edit Quiz' },
      ]} />
      <h1 className="page-header mb-6">Edit Quiz</h1>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="card p-6 space-y-5">
                <h2 className="section-title">Basic Information</h2>
                <div>
                  <label className="label">Title <span className="text-red-500">*</span></label>
                  <input {...register('title', { required: 'Title is required' })} className="input-field" />
                  {errors.title && <p className="text-red-500 text-xs mt-1.5">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="label">Category <span className="text-red-500">*</span></label>
                  <input {...register('category', { required: 'Category is required' })} className="input-field" placeholder="e.g. React, Spring Boot, Database" />
                  {errors.category && <p className="text-red-500 text-xs mt-1.5">{errors.category.message}</p>}
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea {...register('description')} rows={4} className="input-field !h-auto resize-none" />
                </div>
              </div>
              <div className="card p-6 space-y-5">
                <h2 className="section-title">Settings</h2>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Time Limit (minutes) <span className="text-red-500">*</span></label>
                    <input
                      {...register('timeLimit', {
                        required: 'Time limit is required',
                        min: { value: 1, message: 'Minimum 1 minute' },
                        max: { value: 300, message: 'Maximum 300 minutes' },
                      })}
                      type="number"
                      className="input-field"
                      placeholder="e.g. 30"
                    />
                    {errors.timeLimit && <p className="text-red-500 text-xs mt-1.5">{errors.timeLimit.message}</p>}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-5">
              <div className="card p-6">
                <h2 className="section-title mb-4">Visibility</h2>
                <div className="space-y-3">
                  {[{ value: 'true', label: 'Active', desc: 'Visible to users' }, { value: 'false', label: 'Inactive', desc: 'Hidden from users' }].map((opt) => (
                    <label key={opt.value} className="flex items-start gap-3 p-3 rounded-xl border border-dark-100 dark:border-dark-700 cursor-pointer hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors">
                      <input {...register('active')} type="radio" value={opt.value} className="mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-dark-800 dark:text-dark-200">{opt.label}</p>
                        <p className="text-xs text-dark-400">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <button type="submit" className="btn-primary w-full justify-center" disabled={isSubmitting}>
                  <Save size={16} /> {isSubmitting ? 'Saving…' : 'Save Changes'}
                </button>
                <button type="button" className="btn-secondary w-full justify-center" onClick={() => navigate('/admin/quizzes')}>
                  <X size={16} /> Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
