package com.quizplatform.mapper;

import com.quizplatform.dto.request.CreateQuestionRequest;
import com.quizplatform.dto.response.QuestionResponse;
import com.quizplatform.entity.Question;
import com.quizplatform.entity.Quiz;
import org.springframework.stereotype.Component;

@Component
public class QuestionMapper {

    public Question toEntity(CreateQuestionRequest request, Quiz quiz) {
        return Question.builder()
                .questionText(request.getQuestionText())
                .optionA(request.getOptionA())
                .optionB(request.getOptionB())
                .optionC(request.getOptionC())
                .optionD(request.getOptionD())
                .correctAnswer(request.getCorrectAnswer().toUpperCase().charAt(0))
                .marks(request.getMarks())
                .quiz(quiz)
                .build();
    }

    public QuestionResponse toResponse(Question question) {
        return QuestionResponse.builder()
                .id(question.getId())
                .questionText(question.getQuestionText())
                .optionA(question.getOptionA())
                .optionB(question.getOptionB())
                .optionC(question.getOptionC())
                .optionD(question.getOptionD())
                .correctAnswer(String.valueOf(question.getCorrectAnswer()))
                .marks(question.getMarks())
                .quizId(question.getQuiz().getId())
                .build();
    }
}
