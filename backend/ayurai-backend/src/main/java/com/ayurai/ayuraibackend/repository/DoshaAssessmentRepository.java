package com.ayurai.ayuraibackend.repository;

import com.ayurai.ayuraibackend.entity.DoshaAssessment;
import com.ayurai.ayuraibackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DoshaAssessmentRepository
        extends JpaRepository<DoshaAssessment, Long> {

    List<DoshaAssessment> findByUser(User user);

    Optional<DoshaAssessment> findTopByUserOrderByCreatedAtDesc(User user);
}