import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="card p-8 max-w-md text-center">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={40} />
            <h2 className="font-display font-bold text-xl text-dark-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-dark-500 dark:text-dark-400 text-sm mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button className="btn-primary" onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
