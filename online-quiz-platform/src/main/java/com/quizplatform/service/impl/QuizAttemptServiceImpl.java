package com.quizplatform.service.impl;

import com.quizplatform.dto.request.AnswerRequest;
import com.quizplatform.dto.request.SubmitQuizRequest;
import com.quizplatform.dto.response.QuizAttemptResponse;
import com.quizplatform.entity.*;
import com.quizplatform.exception.ResourceNotFoundException;
import com.quizplatform.exception.UnauthorizedAccessException;
import com.quizplatform.mapper.QuizAttemptMapper;
import com.quizplatform.repository.*;
import com.quizplatform.service.interfaces.QuizAttemptService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizAttemptServiceImpl implements QuizAttemptService {

    private final QuizAttemptRepository quizAttemptRepository;
    private final QuizRepository quizRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final QuizAttemptMapper quizAttemptMapper;

    @Override
    @Transactional
    public QuizAttemptResponse startAttempt(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        if (!quiz.isActive()) {
            throw new UnauthorizedAccessException("This quiz is currently inactive");
        }

        User user = getCurrentUser();

        QuizAttempt attempt = QuizAttempt.builder()
                .quiz(quiz)
                .user(user)
                .startedAt(LocalDateTime.now())
                .score(0)
                .totalMarks(0)
                .answers(new ArrayList<>())
                .build();

        return quizAttemptMapper.toResponse(quizAttemptRepository.save(attempt));
    }

    @Override
    @Transactional
    public QuizAttemptResponse submitAttempt(Long attemptId, SubmitQuizRequest request) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz attempt not found"));

        if (attempt.getSubmittedAt() != null) {
            throw new UnauthorizedAccessException("This attempt has already been submitted");
        }

        User currentUser = getCurrentUser();
        if (!attempt.getUser().getId().equals(currentUser.getId())) {
            throw new UnauthorizedAccessException("You can only submit your own attempts");
        }

        Quiz quiz = attempt.getQuiz();
        List<Question> questions = quiz.getQuestions();
        Map<Long, Question> questionMap = questions.stream()
                .collect(Collectors.toMap(Question::getId, Function.identity()));

        int score = 0;
        int totalPossibleMarks = questions.stream().mapToInt(Question::getMarks).sum();
        List<SubmittedAnswer> submittedAnswers = new ArrayList<>();

        for (AnswerRequest answerRequest : request.getAnswers()) {
            Question question = questionMap.get(answerRequest.getQuestionId());
            if (question == null) continue;

            boolean isCorrect = false;
            char selectedChar = answerRequest.getSelectedAnswer().toUpperCase().charAt(0);
            if (selectedChar == Character.toUpperCase(question.getCorrectAnswer())) {
                isCorrect = true;
                score += question.getMarks();
            }

            SubmittedAnswer sa = SubmittedAnswer.builder()
                    .attempt(attempt)
                    .question(question)
                    .selectedAnswer(selectedChar)
                    .isCorrect(isCorrect)
                    .build();
            submittedAnswers.add(sa);
        }

        attempt.setScore(score);
        attempt.setTotalMarks(totalPossibleMarks);
        attempt.setSubmittedAt(LocalDateTime.now());
        
        if (totalPossibleMarks > 0) {
            BigDecimal percentage = BigDecimal.valueOf(score)
                    .multiply(BigDecimal.valueOf(100))
                    .divide(BigDecimal.valueOf(totalPossibleMarks), 2, RoundingMode.HALF_UP);
            attempt.setPercentage(percentage);
        } else {
            attempt.setPercentage(BigDecimal.ZERO);
        }

        attempt.getAnswers().clear();
        attempt.getAnswers().addAll(submittedAnswers);

        return quizAttemptMapper.toResponse(quizAttemptRepository.save(attempt));
    }

    @Override
    public QuizAttemptResponse getAttemptById(Long attemptId) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz attempt not found"));
        
        User currentUser = getCurrentUser();
        // Allow if it's the user's own attempt or if the user is an admin
        if (!attempt.getUser().getId().equals(currentUser.getId()) && !currentUser.getRole().equals(Role.ADMIN)) {
            throw new UnauthorizedAccessException("You are not authorized to view this result");
        }
        
        return quizAttemptMapper.toResponse(attempt);
    }

    @Override
    public List<QuizAttemptResponse> getUserAttemptHistory() {
        User user = getCurrentUser();
        return quizAttemptRepository.findByUserOrderByStartedAtDesc(user)
                .stream()
                .map(quizAttemptMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuizAttemptResponse> getQuizAttempts(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        return quizAttemptRepository.findByQuizOrderByScoreDesc(quiz)
                .stream()
                .map(quizAttemptMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuizAttemptResponse> getLeaderboard(Long quizId) {
        return quizAttemptRepository.getLeaderboard(quizId)
                .stream()
                .limit(10)
                .map(quizAttemptMapper::toResponse)
                .collect(Collectors.toList());
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
