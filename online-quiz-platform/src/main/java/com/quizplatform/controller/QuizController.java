package com.quizplatform.controller;

import com.quizplatform.dto.request.CreateQuizRequest;
import com.quizplatform.dto.request.UpdateQuizRequest;
import com.quizplatform.dto.response.QuizResponse;
import com.quizplatform.service.interfaces.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class QuizController {
    private final QuizService quizService;

    @PostMapping("/admin/quizzes")
    public ResponseEntity<QuizResponse> createQuiz(@Valid @RequestBody CreateQuizRequest request) {
        return ResponseEntity.ok(quizService.createQuiz(request));
    }

    @PutMapping("/admin/quizzes/{id}")
    public ResponseEntity<QuizResponse> updateQuiz(@PathVariable Long id, @RequestBody UpdateQuizRequest request) {
        return ResponseEntity.ok(quizService.updateQuiz(id, request));
    }

    @DeleteMapping("/admin/quizzes/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/admin/quizzes/{id}/toggle")
    public ResponseEntity<QuizResponse> toggleQuizStatus(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.toggleQuizStatus(id));
    }

    @GetMapping("/quizzes")
    public ResponseEntity<List<QuizResponse>> getAllQuizzes() {
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }

    @GetMapping("/quizzes/{id}")
    public ResponseEntity<QuizResponse> getQuizById(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizById(id));
    }

    @GetMapping("/quizzes/category/{category}")
    public ResponseEntity<List<QuizResponse>> getQuizzesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(quizService.getQuizzesByCategory(category));
    }
}
