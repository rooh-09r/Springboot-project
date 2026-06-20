import api from '../api/axios';

export const adminService = {
  // Quiz management
  createQuiz: (data) => api.post('/api/admin/quizzes', data),
  updateQuiz: (id, data) => api.put(`/api/admin/quizzes/${id}`, data),
  deleteQuiz: (id) => api.delete(`/api/admin/quizzes/${id}`),
  toggleStatus: (id) => api.patch(`/api/admin/quizzes/${id}/toggle`),

  // Question management
  addQuestion: (quizId, data) =>
    api.post(`/api/admin/quizzes/${quizId}/questions`, data),
  updateQuestion: (id, data) => api.put(`/api/admin/questions/${id}`, data),
  deleteQuestion: (id) => api.delete(`/api/admin/questions/${id}`),

  // Analytics
  getLeaderboard: async (id) => {
    const res = await api.get(`/api/quizzes/${id}/leaderboard`);
    if (Array.isArray(res.data)) {
      res.data = res.data.map(entry => ({
        ...entry,
        score: entry.percentage !== undefined ? Math.round(parseFloat(entry.percentage)) : entry.score,
      }));
    }
    return res;
  },
  getAttempts: async (id) => {
    const res = await api.get(`/api/admin/quizzes/${id}/attempts`);
    if (Array.isArray(res.data)) {
      res.data = res.data.map(attempt => ({
        ...attempt,
        score: attempt.percentage !== undefined ? Math.round(parseFloat(attempt.percentage)) : attempt.score,
      }));
    }
    return res;
  },
};
