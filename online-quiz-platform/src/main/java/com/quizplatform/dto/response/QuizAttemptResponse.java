package com.quizplatform.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class QuizAttemptResponse {
    private Long id;
    private Long attemptId;   // alias for id — used by frontend
    private Long quizId;
    private String quizTitle;
    private Long userId;
    private String userEmail;
    private String userName;  // user's full name
    private int score;
    private int totalMarks;
    private BigDecimal percentage;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
    private List<SubmittedAnswerResponse> answers;
}
