package com.quizplatform.repository;

import com.quizplatform.entity.Quiz;
import com.quizplatform.entity.QuizAttempt;
import com.quizplatform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByUserOrderByStartedAtDesc(User user);
    List<QuizAttempt> findByQuizOrderByScoreDesc(Quiz quiz);
    
    @Query("SELECT qa FROM QuizAttempt qa WHERE qa.quiz.id = :quizId ORDER BY qa.score DESC")
    List<QuizAttempt> getLeaderboard(@Param("quizId") Long quizId);
}
