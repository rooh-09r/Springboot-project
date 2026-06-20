package com.quizplatform.service.interfaces;

import com.quizplatform.dto.request.CreateQuizRequest;
import com.quizplatform.dto.request.UpdateQuizRequest;
import com.quizplatform.dto.response.QuizResponse;
import java.util.List;

public interface QuizService {
    QuizResponse createQuiz(CreateQuizRequest request);
    QuizResponse updateQuiz(Long id, UpdateQuizRequest request);
    void deleteQuiz(Long id);
    QuizResponse getQuizById(Long id);
    List<QuizResponse> getAllQuizzes();
    List<QuizResponse> getQuizzesByCategory(String category);
    QuizResponse toggleQuizStatus(Long id);
}
