import api from '../api/axios';

export const quizService = {
  getAll: () => api.get('/api/quizzes'),
  getById: (id) => api.get(`/api/quizzes/${id}`),
  getQuestions: (quizId) => api.get(`/api/quizzes/${quizId}/questions`),
  startAttempt: (quizId) => api.post(`/api/quizzes/${quizId}/attempts`),
  submitAttempt: (attemptId, answers) =>
    api.post(`/api/attempts/${attemptId}/submit`, { answers }),
};
