package com.quizplatform.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class SubmitQuizRequest {
    @NotEmpty
    private List<AnswerRequest> answers;
}
