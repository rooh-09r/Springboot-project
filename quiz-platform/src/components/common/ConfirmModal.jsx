import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  loading = false,
  variant = 'danger',
}) => {
  const btnClass = variant === 'danger' ? 'btn-danger' : 'btn-primary';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <AlertTriangle className="text-red-600 dark:text-red-400" size={22} />
        </div>
        <div>
          <h3 className="font-display font-semibold text-dark-900 dark:text-white text-lg">{title}</h3>
          <p className="text-sm text-dark-500 dark:text-dark-400 mt-1">{message}</p>
        </div>
        <div className="flex gap-3 w-full">
          <button className="btn-secondary flex-1" onClick={onClose}>Cancel</button>
          <button
            className={`${btnClass} flex-1`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Processing…' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
