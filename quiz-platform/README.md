# QuizMaster Pro — Frontend

A production-ready React frontend for the Online Quiz Platform, built with Vite + React 19 + Tailwind CSS.

---

## Quick Start

```bash
npm install
npm run dev
```

Visit `http://localhost:5173`

> **Requires** the Spring Boot backend running on `http://localhost:8080`

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 19 + Vite | UI framework & build tool |
| React Router DOM | Client-side routing |
| Axios | HTTP client with JWT interceptors |
| Context API | Auth & theme state management |
| Tailwind CSS v3 | Utility-first styling |
| React Hook Form | Form handling & validation |
| React Hot Toast | Notifications |
| Lucide React | Icon library |
| Recharts | Charts & analytics |
| Framer Motion | Animations & transitions |

---

## Project Structure

```
src/
├── api/
│   └── axios.js              # Axios instance with JWT interceptors & 401 auto-logout
├── components/
│   ├── common/               # Modal, ConfirmModal, EmptyState, Breadcrumb, Pagination,
│   │                         # LoadingSpinner, SkeletonCard, ErrorBoundary
│   └── layouts/              # MainLayout, AdminLayout, Navbar, AdminSidebar
├── context/
│   ├── AuthContext.jsx       # Login, logout, user state, role helpers
│   └── ThemeContext.jsx      # Dark/light mode toggle
├── hooks/
│   ├── useAsync.js           # Execute async ops with loading/error state
│   └── useFetch.js           # Fetch data on mount, with refetch support
├── pages/
│   ├── public/               # LandingPage, NotFoundPage
│   ├── auth/                 # LoginPage, RegisterPage
│   ├── user/                 # UserDashboard, QuizzesPage, QuizDetailPage,
│   │                         # QuizAttemptPage, QuizResultPage, AttemptHistoryPage,
│   │                         # ProfilePage
│   └── admin/                # AdminDashboard, ManageQuizzesPage, CreateQuizPage,
│                             # EditQuizPage, QuizQuestionsPage, CreateQuestionPage,
│                             # EditQuestionPage, LeaderboardPage, QuizAttemptsPage,
│                             # AnalyticsPage, AdminProfilePage
├── routes/
│   └── ProtectedRoute.jsx    # ProtectedRoute, AdminRoute, UserRoute, GuestRoute
├── services/
│   ├── authService.js        # /api/auth/*
│   ├── quizService.js        # /api/quizzes/*, attempts, questions
│   ├── resultService.js      # /api/results/*
│   └── adminService.js       # /api/admin/*
└── utils/
    └── formatters.js         # Date, score, color helpers
```

---

## Authentication Flow

1. User logs in → JWT stored in `localStorage` as `token`, user info as `user`
2. Every Axios request automatically attaches `Authorization: Bearer <token>`
3. On any `401` response → token cleared, user redirected to `/login`
4. `GuestRoute` — redirects logged-in users away from `/login` and `/register`
5. `AdminRoute` — only allows `ROLE_ADMIN`, redirects others to `/dashboard`
6. `UserRoute` — only allows `ROLE_USER`, redirects admins to `/admin`
7. `ProtectedRoute` — requires any authenticated user

---

## Role-Based Navigation

### ROLE_USER
- `/dashboard` — personal stats & recent attempts
- `/quizzes` — browse all active quizzes
- `/quizzes/:id` — quiz detail & start
- `/quiz/:quizId/attempt/:attemptId` — take quiz
- `/results/:attemptId` — view result with answer review
- `/history` — full attempt history with pagination
- `/profile` — stats & score distribution chart

### ROLE_ADMIN
- `/admin` — dashboard with analytics overview
- `/admin/quizzes` — manage quizzes (CRUD, toggle status)
- `/admin/quizzes/create` — create new quiz
- `/admin/quizzes/:id/edit` — edit quiz
- `/admin/quizzes/:quizId/questions` — list & delete questions
- `/admin/quizzes/:quizId/questions/create` — add question
- `/admin/questions/:id/edit` — edit question
- `/admin/quizzes/:id/leaderboard` — leaderboard with podium
- `/admin/quizzes/:id/attempts` — all user attempts
- `/admin/analytics` — charts & platform metrics

---

## Features

- **Dark mode** — system preference detected, toggle in navbar
- **Responsive** — mobile-first, sidebar drawer on mobile for admin
- **Loading skeletons** — all data-fetching states covered
- **Empty states** — friendly illustrations when no data
- **Confirm modals** — before every destructive action
- **Toast notifications** — success/error feedback throughout
- **Search & filter** — quizzes, history, attempts tables
- **Pagination** — history and attempts tables
- **Breadcrumb navigation** — all nested admin pages
- **Error boundary** — catches runtime errors globally
- **Score visualizations** — circular progress, line/bar/pie charts

---

## Environment

The Vite dev server proxies `/api` requests to `http://localhost:8080`, so no CORS issues during development. For production, configure your reverse proxy (nginx/caddy) accordingly.

To change the backend URL, edit `src/api/axios.js`:

```js
const BASE_URL = 'http://localhost:8080';
```

---

## Available Scripts

```bash
npm run dev      # Start dev server on :5173
npm run build    # Production build → dist/
npm run preview  # Preview production build
npm run lint     # ESLint
```
