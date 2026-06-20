package com.quizplatform.mapper;

import com.quizplatform.dto.request.CreateQuizRequest;
import com.quizplatform.dto.response.QuizResponse;
import com.quizplatform.entity.Quiz;
import com.quizplatform.entity.User;
import org.springframework.stereotype.Component;

@Component
public class QuizMapper {

    public Quiz toEntity(CreateQuizRequest request, User creator) {

        return Quiz.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .timeLimit(request.getTimeLimit())
                .createdBy(creator)
                .active(true)
                .build();
    }

    public QuizResponse toResponse(Quiz quiz) {

        return QuizResponse.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .category(quiz.getCategory())
                .timeLimit(quiz.getTimeLimit())
                .createdByEmail(
                        quiz.getCreatedBy() != null
                                ? quiz.getCreatedBy().getEmail()
                                : null
                )
                .active(quiz.isActive())
                .questionCount(quiz.getQuestions() != null ? quiz.getQuestions().size() : 0)
                .build();
    }
}
