package com.quizplatform.service.interfaces;

import com.quizplatform.dto.request.SubmitQuizRequest;
import com.quizplatform.dto.response.QuizAttemptResponse;
import java.util.List;

public interface QuizAttemptService {
    QuizAttemptResponse startAttempt(Long quizId);
    QuizAttemptResponse submitAttempt(Long attemptId, SubmitQuizRequest request);
    QuizAttemptResponse getAttemptById(Long attemptId);
    List<QuizAttemptResponse> getUserAttemptHistory();
    List<QuizAttemptResponse> getQuizAttempts(Long quizId);
    List<QuizAttemptResponse> getLeaderboard(Long quizId);
}
