package com.ayurai.ayuraibackend.service;

import com.ayurai.ayuraibackend.dto.SkinAnalysisRequest;
import com.ayurai.ayuraibackend.dto.SkinAnalysisResponse;
import com.ayurai.ayuraibackend.entity.SkinAnalysis;
import com.ayurai.ayuraibackend.entity.User;
import com.ayurai.ayuraibackend.repository.SkinAnalysisRepository;
import com.ayurai.ayuraibackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkinAnalysisService {

    private final SkinAnalysisRepository skinAnalysisRepository;
    private final UserRepository userRepository;

    public SkinAnalysisService(
            SkinAnalysisRepository skinAnalysisRepository,
            UserRepository userRepository) {

        this.skinAnalysisRepository = skinAnalysisRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // CREATE SKIN ANALYSIS
    // =========================================================

    public SkinAnalysisResponse createAnalysis(
            SkinAnalysisRequest request) {

        // -----------------------------------------------------
        // FIND USER
        // -----------------------------------------------------

        User user = userRepository
                .findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        // -----------------------------------------------------
        // CREATE ENTITY
        // -----------------------------------------------------

        SkinAnalysis analysis =
                new SkinAnalysis();

        analysis.setUser(user);

        analysis.setSkinType(
                request.getSkinType()
        );

        analysis.setConcerns(
                request.getConcerns()
        );

        analysis.setAnalysis(
                request.getAnalysis()
        );

        // -----------------------------------------------------
        // SAVE
        // -----------------------------------------------------

        SkinAnalysis savedAnalysis =
                skinAnalysisRepository.save(analysis);

        // -----------------------------------------------------
        // RETURN RESPONSE
        // -----------------------------------------------------

        return convertToResponse(
                savedAnalysis
        );
    }

    // =========================================================
    // GET ALL ANALYSES FOR USER
    // =========================================================

    public List<SkinAnalysisResponse> getUserAnalyses(
            Long userId) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return skinAnalysisRepository
                .findByUser(user)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // =========================================================
    // GET LATEST ANALYSIS
    // =========================================================

    public SkinAnalysisResponse getLatestAnalysis(
            Long userId) {

        User user = userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        SkinAnalysis analysis =
                skinAnalysisRepository
                        .findTopByUserOrderByCreatedAtDesc(user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No skin analysis found"
                                )
                        );

        return convertToResponse(
                analysis
        );
    }

    // =========================================================
    // ENTITY → RESPONSE
    // =========================================================

    private SkinAnalysisResponse convertToResponse(
            SkinAnalysis analysis) {

        return new SkinAnalysisResponse(

                analysis.getId(),

                analysis.getUser().getId(),

                analysis.getSkinType(),

                analysis.getConcerns(),

                analysis.getAnalysis(),

                analysis.getCreatedAt()
        );
    }
}