import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumb = ({ items }) => (
  <nav className="flex items-center gap-1 text-sm mb-6">
    <Link to="/" className="text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
      <Home size={14} />
    </Link>
    {items.map((item, idx) => (
      <span key={idx} className="flex items-center gap-1">
        <ChevronRight size={14} className="text-dark-300 dark:text-dark-600" />
        {idx === items.length - 1 ? (
          <span className="text-dark-700 dark:text-dark-300 font-medium">{item.label}</span>
        ) : (
          <Link to={item.path} className="text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {item.label}
          </Link>
        )}
      </span>
    ))}
  </nav>
);
