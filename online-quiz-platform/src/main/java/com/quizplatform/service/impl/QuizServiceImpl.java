package com.quizplatform.service.impl;

import com.quizplatform.dto.request.CreateQuizRequest;
import com.quizplatform.dto.request.UpdateQuizRequest;
import com.quizplatform.dto.response.QuizResponse;
import com.quizplatform.entity.Quiz;
import com.quizplatform.entity.User;
import com.quizplatform.exception.DuplicateResourceException;
import com.quizplatform.exception.ResourceNotFoundException;
import com.quizplatform.mapper.QuizMapper;
import com.quizplatform.repository.QuizRepository;
import com.quizplatform.repository.UserRepository;
import com.quizplatform.service.interfaces.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final UserRepository userRepository;
    private final QuizMapper quizMapper;

    @Override
    public QuizResponse createQuiz(CreateQuizRequest request) {

        if (quizRepository.existsByTitle(request.getTitle())) {
            throw new DuplicateResourceException("Quiz with this title already exists");
        }

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Quiz quiz = quizMapper.toEntity(request, user);

        return quizMapper.toResponse(
                quizRepository.save(quiz)
        );
    }

    @Override
    public QuizResponse updateQuiz(Long id, UpdateQuizRequest request) {

        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        if (request.getTitle() != null) {
            quiz.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            quiz.setDescription(request.getDescription());
        }

        if (request.getCategory() != null) {
            quiz.setCategory(request.getCategory());
        }

        if (request.getTimeLimit() != null) {
            quiz.setTimeLimit(request.getTimeLimit());
        }

        return quizMapper.toResponse(
                quizRepository.save(quiz)
        );
    }

    @Override
    public void deleteQuiz(Long id) {

        if (!quizRepository.existsById(id)) {
            throw new ResourceNotFoundException("Quiz not found");
        }

        quizRepository.deleteById(id);
    }

    @Override
    public QuizResponse getQuizById(Long id) {

        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        return quizMapper.toResponse(quiz);
    }

    @Override
    public List<QuizResponse> getAllQuizzes() {

        return quizRepository.findAll()
                .stream()
                .map(quizMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<QuizResponse> getQuizzesByCategory(String category) {

        return quizRepository.findByCategoryIgnoreCase(category)
                .stream()
                .map(quizMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public QuizResponse toggleQuizStatus(Long id) {

        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));

        quiz.setActive(!quiz.isActive());

        Quiz updatedQuiz = quizRepository.save(quiz);

        return quizMapper.toResponse(updatedQuiz);
    }
}
