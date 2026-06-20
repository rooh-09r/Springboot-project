package com.quizplatform.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SubmittedAnswerResponse {
    private Long questionId;
    private String questionText;
    private String selectedAnswer;
    private String correctAnswer;
    private boolean correct;
    // alias so both field names work in JSON
    public boolean isCorrect() { return correct; }
}
