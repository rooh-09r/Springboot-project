package com.quizplatform.mapper;

import com.quizplatform.dto.response.QuizAttemptResponse;
import com.quizplatform.dto.response.SubmittedAnswerResponse;
import com.quizplatform.entity.QuizAttempt;
import com.quizplatform.entity.SubmittedAnswer;
import org.springframework.stereotype.Component;
import java.util.stream.Collectors;

@Component
public class QuizAttemptMapper {

    public QuizAttemptResponse toResponse(QuizAttempt attempt) {
        return QuizAttemptResponse.builder()
                .id(attempt.getId())
                .attemptId(attempt.getId())
                .quizId(attempt.getQuiz().getId())
                .quizTitle(attempt.getQuiz().getTitle())
                .userId(attempt.getUser().getId())
                .userEmail(attempt.getUser().getEmail())
                .userName(attempt.getUser().getFullName())
                .score(attempt.getScore())
                .totalMarks(attempt.getTotalMarks())
                .percentage(attempt.getPercentage())
                .startedAt(attempt.getStartedAt())
                .submittedAt(attempt.getSubmittedAt())
                .answers(attempt.getAnswers() != null ? 
                    attempt.getAnswers().stream().map(this::toAnswerResponse).collect(Collectors.toList()) : null)
                .build();
    }

    private SubmittedAnswerResponse toAnswerResponse(SubmittedAnswer answer) {
        return SubmittedAnswerResponse.builder()
                .questionId(answer.getQuestion().getId())
                .questionText(answer.getQuestion().getQuestionText())
                .selectedAnswer(String.valueOf(answer.getSelectedAnswer()))
                .correctAnswer(String.valueOf(answer.getQuestion().getCorrectAnswer()))
                .correct(answer.getIsCorrect())
                .build();
    }
}
