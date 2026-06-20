import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-white dark:bg-dark-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="font-display font-bold text-8xl text-primary-100 dark:text-primary-900/40 mb-4 select-none">
          404
        </div>
        <h1 className="font-display font-bold text-2xl text-dark-900 dark:text-white mb-2">
          Page not found
        </h1>
        <p className="text-dark-500 dark:text-dark-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => window.history.back()} className="btn-secondary">
            <ArrowLeft size={16} /> Go Back
          </button>
          <Link to="/" className="btn-primary">
            <Home size={16} /> Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
