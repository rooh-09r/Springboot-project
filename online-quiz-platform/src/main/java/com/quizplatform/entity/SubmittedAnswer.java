package com.quizplatform.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "submitted_answers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmittedAnswer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "attempt_id", nullable = false)
    private QuizAttempt attempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Column(name = "selected_answer", nullable = false, length = 1)
    private char selectedAnswer;

    @Column(name = "is_correct", nullable = false)
    private Boolean isCorrect;
}
