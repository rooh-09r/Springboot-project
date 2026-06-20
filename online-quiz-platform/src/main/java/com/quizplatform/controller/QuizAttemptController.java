package com.quizplatform.controller;

import com.quizplatform.dto.request.SubmitQuizRequest;
import com.quizplatform.dto.response.QuizAttemptResponse;
import com.quizplatform.service.interfaces.QuizAttemptService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class QuizAttemptController {

    private final QuizAttemptService quizAttemptService;

    @PostMapping("/quizzes/{quizId}/attempts")
    public ResponseEntity<QuizAttemptResponse> startAttempt(@PathVariable Long quizId) {
        return ResponseEntity.ok(quizAttemptService.startAttempt(quizId));
    }

    @PostMapping("/attempts/{id}/submit")
    public ResponseEntity<QuizAttemptResponse> submitAttempt(
            @PathVariable Long id,
            @Valid @RequestBody SubmitQuizRequest request) {
        return ResponseEntity.ok(quizAttemptService.submitAttempt(id, request));
    }

    @GetMapping("/attempts/{id}")
    public ResponseEntity<QuizAttemptResponse> getAttemptById(@PathVariable Long id) {
        return ResponseEntity.ok(quizAttemptService.getAttemptById(id));
    }

    @GetMapping("/attempts/my-history")
    public ResponseEntity<List<QuizAttemptResponse>> getMyHistory() {
        return ResponseEntity.ok(quizAttemptService.getUserAttemptHistory());
    }

    @GetMapping("/admin/quizzes/{quizId}/attempts")
    public ResponseEntity<List<QuizAttemptResponse>> getQuizAttempts(@PathVariable Long quizId) {
        return ResponseEntity.ok(quizAttemptService.getQuizAttempts(quizId));
    }

    @GetMapping("/quizzes/{quizId}/leaderboard")
    public ResponseEntity<List<QuizAttemptResponse>> getLeaderboard(@PathVariable Long quizId) {
        return ResponseEntity.ok(quizAttemptService.getLeaderboard(quizId));
    }
}
