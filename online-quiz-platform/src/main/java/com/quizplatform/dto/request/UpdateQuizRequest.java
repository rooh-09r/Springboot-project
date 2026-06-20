package com.quizplatform.dto.request;

import lombok.Data;

@Data
public class UpdateQuizRequest {
    private String title;
    private String description;
    private String category;
    private Integer timeLimit;
}
