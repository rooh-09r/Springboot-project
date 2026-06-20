package com.quizplatform.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateQuizRequest {
    @NotBlank
    private String title;
    private String description;
    @NotBlank
    private String category;
    @NotNull
    private Integer timeLimit;
}
