package com.ayurai.ayuraibackend.repository;

import com.ayurai.ayuraibackend.entity.SkinAnalysis;
import com.ayurai.ayuraibackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SkinAnalysisRepository
        extends JpaRepository<SkinAnalysis, Long> {

    // =========================================================
    // GET ALL SKIN ANALYSES FOR USER
    // =========================================================

    List<SkinAnalysis> findByUser(User user);

    // =========================================================
    // GET LATEST SKIN ANALYSIS
    // =========================================================

    Optional<SkinAnalysis> findTopByUserOrderByCreatedAtDesc(User user);
}