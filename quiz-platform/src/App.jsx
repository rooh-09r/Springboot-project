import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { MainLayout } from './components/layouts/MainLayout';
import { AdminLayout } from './components/layouts/AdminLayout';
import {
  ProtectedRoute,
  AdminRoute,
  UserRoute,
  GuestRoute,
} from './routes/ProtectedRoute';

// Public pages
import LandingPage from './pages/public/LandingPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// User pages
import UserDashboard from './pages/user/UserDashboard';
import QuizzesPage from './pages/user/QuizzesPage';
import QuizDetailPage from './pages/user/QuizDetailPage';
import QuizAttemptPage from './pages/user/QuizAttemptPage';
import QuizResultPage from './pages/user/QuizResultPage';
import AttemptHistoryPage from './pages/user/AttemptHistoryPage';
import ProfilePage from './pages/user/ProfilePage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageQuizzesPage from './pages/admin/ManageQuizzesPage';
import CreateQuizPage from './pages/admin/CreateQuizPage';
import EditQuizPage from './pages/admin/EditQuizPage';
import QuizQuestionsPage from './pages/admin/QuizQuestionsPage';
import CreateQuestionPage from './pages/admin/CreateQuestionPage';
import EditQuestionPage from './pages/admin/EditQuestionPage';
import LeaderboardPage from './pages/admin/LeaderboardPage';
import QuizAttemptsPage from './pages/admin/QuizAttemptsPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import AdminProfilePage from './pages/admin/AdminProfilePage';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3500,
                style: {
                  background: 'var(--toast-bg, #fff)',
                  color: 'var(--toast-color, #1e1d4d)',
                  borderRadius: '12px',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                  fontSize: '14px',
                  padding: '12px 16px',
                },
                success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />

            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />

              {/* Auth routes — redirect if already logged in */}
              <Route
                path="/login"
                element={
                  <GuestRoute>
                    <LoginPage />
                  </GuestRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <GuestRoute>
                    <RegisterPage />
                  </GuestRoute>
                }
              />

              {/* User routes */}
              <Route element={<MainLayout />}>
                <Route
                  path="/dashboard"
                  element={
                    <UserRoute>
                      <UserDashboard />
                    </UserRoute>
                  }
                />
                <Route
                  path="/quizzes"
                  element={
                    <ProtectedRoute>
                      <QuizzesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quizzes/:id"
                  element={
                    <ProtectedRoute>
                      <QuizDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz/:quizId/attempt/:attemptId"
                  element={
                    <ProtectedRoute>
                      <QuizAttemptPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/results/:attemptId"
                  element={
                    <ProtectedRoute>
                      <QuizResultPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/history"
                  element={
                    <UserRoute>
                      <AttemptHistoryPage />
                    </UserRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <UserRoute>
                      <ProfilePage />
                    </UserRoute>
                  }
                />
              </Route>

              {/* Admin routes */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="quizzes" element={<ManageQuizzesPage />} />
                <Route path="quizzes/create" element={<CreateQuizPage />} />
                <Route path="quizzes/:id/edit" element={<EditQuizPage />} />
                <Route path="quizzes/:quizId/questions" element={<QuizQuestionsPage />} />
                <Route path="quizzes/:quizId/questions/create" element={<CreateQuestionPage />} />
                <Route path="questions/:questionId/edit" element={<EditQuestionPage />} />
                <Route path="quizzes/:quizId/leaderboard" element={<LeaderboardPage />} />
                <Route path="quizzes/:quizId/attempts" element={<QuizAttemptsPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="profile" element={<AdminProfilePage />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
