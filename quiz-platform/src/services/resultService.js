import api from '../api/axios';

export const resultService = {
  getByAttempt: async (attemptId) => {
    const res = await api.get(`/api/attempts/${attemptId}`);
    if (res.data) {
      const answers = res.data.answers || [];
      const correctCount = answers.filter(a => a.correct !== undefined ? a.correct : a.isCorrect).length;
      res.data = {
        ...res.data,
        score: res.data.percentage !== undefined ? Math.round(parseFloat(res.data.percentage)) : res.data.score,
        correctAnswers: correctCount,
        correct: correctCount,
        totalQuestions: answers.length,
        total: answers.length,
      };
    }
    return res;
  },
  getMyHistory: async () => {
    const res = await api.get('/api/attempts/my-history');
    if (Array.isArray(res.data)) {
      res.data = res.data.map(attempt => ({
        ...attempt,
        score: attempt.percentage !== undefined ? Math.round(parseFloat(attempt.percentage)) : attempt.score,
      }));
    }
    return res;
  },
};
