package com.quizplatform.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class QuizResponse {
    private Long id;
    private String title;
    private String description;
    private String category;
    private Integer timeLimit;
    private String createdByEmail;
    private boolean active;
    private Integer questionCount;
}
