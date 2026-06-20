package com.quizplatform.repository;

import com.quizplatform.entity.Quiz;
import com.quizplatform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByCategoryIgnoreCase(String category);
    List<Quiz> findByCreatedBy(User user);
    boolean existsByTitle(String title);
}
