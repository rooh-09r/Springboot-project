package com.quizplatform.repository;

import com.quizplatform.entity.SubmittedAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SubmittedAnswerRepository extends JpaRepository<SubmittedAnswer, Long> {
}
