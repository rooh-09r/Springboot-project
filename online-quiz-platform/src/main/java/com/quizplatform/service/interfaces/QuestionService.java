package com.quizplatform.service.interfaces;

import com.quizplatform.dto.request.CreateQuestionRequest;
import com.quizplatform.dto.request.UpdateQuestionRequest;
import com.quizplatform.dto.response.QuestionResponse;
import java.util.List;

public interface QuestionService {
    QuestionResponse addQuestion(Long quizId, CreateQuestionRequest request);
    QuestionResponse updateQuestion(Long id, UpdateQuestionRequest request);
    void deleteQuestion(Long id);
    List<QuestionResponse> getQuestionsByQuiz(Long quizId);
}
