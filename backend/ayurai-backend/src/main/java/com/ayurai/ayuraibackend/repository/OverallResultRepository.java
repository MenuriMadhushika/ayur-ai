package com.ayurai.ayuraibackend.repository;

import com.ayurai.ayuraibackend.entity.OverallResult;
import com.ayurai.ayuraibackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OverallResultRepository
        extends JpaRepository<OverallResult, Long> {

    // =========================================================
    // GET ALL RESULTS FOR USER
    // =========================================================

    List<OverallResult> findByUser(User user);

    // =========================================================
    // GET LATEST RESULT
    // =========================================================

    Optional<OverallResult>
    findTopByUserOrderByCreatedAtDesc(User user);

    // =========================================================
    // CHECK EXISTING RESULT
    // =========================================================

    Optional<OverallResult>
    findByUserAndSkinScanIdAndDoshaAssessmentId(
            User user,
            Long skinScanId,
            Long doshaAssessmentId
    );
}