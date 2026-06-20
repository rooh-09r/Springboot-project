import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ page, total, perPage = 10, onChange }) => {
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-dark-500 dark:text-dark-400">
        Page {page} of {pages}
      </p>
      <div className="flex gap-1">
        <button
          className="btn-secondary !px-2.5 !py-2"
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft size={16} />
        </button>
        {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
          const p = i + 1;
          return (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-primary-600 text-white'
                  : 'btn-secondary'
              }`}
            >
              {p}
            </button>
          );
        })}
        <button
          className="btn-secondary !px-2.5 !py-2"
          onClick={() => onChange(page + 1)}
          disabled={page === pages}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
