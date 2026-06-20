package com.quizplatform.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuestionResponse {
    private Long id;
    private String questionText;
    private String optionA;
    private String optionB;
    private String optionC;
    private String optionD;
    private String correctAnswer;
    private Integer marks;
    private Long quizId;
}
