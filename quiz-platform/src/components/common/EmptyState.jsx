import { motion } from 'framer-motion';

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-16 text-center"
  >
    {Icon && (
      <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-4">
        <Icon size={28} className="text-primary-500" />
      </div>
    )}
    <h3 className="section-title mb-2">{title}</h3>
    {description && (
      <p className="text-sm text-dark-500 dark:text-dark-400 max-w-sm">{description}</p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </motion.div>
);
