package com.quizplatform.controller;

import com.quizplatform.dto.request.CreateQuestionRequest;
import com.quizplatform.dto.request.UpdateQuestionRequest;
import com.quizplatform.dto.response.QuestionResponse;
import com.quizplatform.service.interfaces.QuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping("/admin/quizzes/{quizId}/questions")
    public ResponseEntity<QuestionResponse> addQuestion(
            @PathVariable Long quizId,
            @Valid @RequestBody CreateQuestionRequest request) {
        return ResponseEntity.ok(questionService.addQuestion(quizId, request));
    }

    @PutMapping("/admin/questions/{id}")
    public ResponseEntity<QuestionResponse> updateQuestion(
            @PathVariable Long id,
            @Valid @RequestBody UpdateQuestionRequest request) {
        return ResponseEntity.ok(questionService.updateQuestion(id, request));
    }

    @DeleteMapping("/admin/questions/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/quizzes/{quizId}/questions")
    public ResponseEntity<List<QuestionResponse>> getQuestionsByQuiz(@PathVariable Long quizId) {
        return ResponseEntity.ok(questionService.getQuestionsByQuiz(quizId));
    }
}
