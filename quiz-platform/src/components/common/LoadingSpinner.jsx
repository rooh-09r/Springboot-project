export const LoadingSpinner = ({ fullScreen = false, size = 'md' }) => {
  const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

  const spinner = (
    <div className={`${sizes[size]} border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin`} />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-dark-950 z-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-3 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-sm text-dark-500 dark:text-dark-400">Loading…</p>
        </div>
      </div>
    );
  }

  return spinner;
};

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <LoadingSpinner size="lg" />
  </div>
);

export const SkeletonCard = () => (
  <div className="card p-6 space-y-4">
    <div className="skeleton h-5 w-3/4 rounded" />
    <div className="skeleton h-4 w-full rounded" />
    <div className="skeleton h-4 w-2/3 rounded" />
    <div className="flex gap-2 pt-2">
      <div className="skeleton h-6 w-16 rounded-full" />
      <div className="skeleton h-6 w-20 rounded-full" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="skeleton h-14 rounded-xl" />
    ))}
  </div>
);
