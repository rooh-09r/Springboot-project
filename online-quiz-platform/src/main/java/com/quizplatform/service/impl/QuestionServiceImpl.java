package com.quizplatform.service.impl;

import com.quizplatform.dto.request.CreateQuestionRequest;
import com.quizplatform.dto.request.UpdateQuestionRequest;
import com.quizplatform.dto.response.QuestionResponse;
import com.quizplatform.entity.Question;
import com.quizplatform.entity.Quiz;
import com.quizplatform.exception.ResourceNotFoundException;
import com.quizplatform.mapper.QuestionMapper;
import com.quizplatform.repository.QuestionRepository;
import com.quizplatform.repository.QuizRepository;
import com.quizplatform.service.interfaces.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionServiceImpl implements QuestionService {
    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;
    private final QuestionMapper questionMapper;

    @Override
    public QuestionResponse addQuestion(Long quizId, CreateQuestionRequest request) {
        Quiz quiz = quizRepository.findById(quizId).orElseThrow(() -> new ResourceNotFoundException("Quiz not found"));
        Question question = questionMapper.toEntity(request, quiz);
        return questionMapper.toResponse(questionRepository.save(question));
    }

    @Override
    public QuestionResponse updateQuestion(Long id, UpdateQuestionRequest request) {
        Question question = questionRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Question not found"));
        if (request.getQuestionText() != null) question.setQuestionText(request.getQuestionText());
        if (request.getOptionA() != null) question.setOptionA(request.getOptionA());
        if (request.getOptionB() != null) question.setOptionB(request.getOptionB());
        if (request.getOptionC() != null) question.setOptionC(request.getOptionC());
        if (request.getOptionD() != null) question.setOptionD(request.getOptionD());
        if (request.getCorrectAnswer() != null && !request.getCorrectAnswer().isEmpty()) {
            question.setCorrectAnswer(request.getCorrectAnswer().toUpperCase().charAt(0));
        }
        if (request.getMarks() != null) question.setMarks(request.getMarks());
        return questionMapper.toResponse(questionRepository.save(question));
    }

    @Override
    public void deleteQuestion(Long id) {
        if (!questionRepository.existsById(id)) throw new ResourceNotFoundException("Question not found");
        questionRepository.deleteById(id);
    }

    @Override
    public List<QuestionResponse> getQuestionsByQuiz(Long quizId) {
        return questionRepository.findByQuizId(quizId).stream().map(questionMapper::toResponse).collect(Collectors.toList());
    }
}
