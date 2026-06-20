import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

export const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

export const UserRoute = ({ children }) => {
  const { user, loading, isUser } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!isUser) return <Navigate to="/admin" replace />;
  return children;
};

export const GuestRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;
  if (user) return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
  return children;
};
