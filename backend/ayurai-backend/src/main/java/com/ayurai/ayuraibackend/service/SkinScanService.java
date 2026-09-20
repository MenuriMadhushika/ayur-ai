package com.ayurai.ayuraibackend.service;

import com.ayurai.ayuraibackend.dto.SkinScanRequest;
import com.ayurai.ayuraibackend.dto.SkinScanResponse;
import com.ayurai.ayuraibackend.entity.SkinScan;
import com.ayurai.ayuraibackend.entity.User;
import com.ayurai.ayuraibackend.repository.SkinScanRepository;
import com.ayurai.ayuraibackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SkinScanService {

    private final SkinScanRepository skinScanRepository;
    private final UserRepository userRepository;

    public SkinScanService(
            SkinScanRepository skinScanRepository,
            UserRepository userRepository) {

        this.skinScanRepository = skinScanRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // CREATE SKIN SCAN
    // =========================================================

    public SkinScanResponse createSkinScan(
            SkinScanRequest request) {

        // -----------------------------------------------------
        // Find user
        // -----------------------------------------------------

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        // -----------------------------------------------------
        // Create SkinScan entity
        // -----------------------------------------------------

        SkinScan skinScan = new SkinScan();

        skinScan.setUser(user);
        skinScan.setSkinType(request.getSkinType());
        skinScan.setSkinTypeConfidence(request.getSkinTypeConfidence());
        skinScan.setSkinTypePredictedClass(request.getSkinTypePredictedClass());
        skinScan.setSkinTypeRequiresReview(request.getSkinTypeRequiresReview());
        skinScan.setSensitivityScore(request.getSensitivityScore());


        skinScan.setImagePath(
                request.getImagePath()
        );

        skinScan.setEstimatedSkinType(
                request.getEstimatedSkinType()
        );

        skinScan.setVisibleCharacteristics(
                request.getVisibleCharacteristics()
        );

        // -----------------------------------------------------
        // Analysis status
        // -----------------------------------------------------

        if (request.getAnalysisStatus() != null
                && !request.getAnalysisStatus().isBlank()) {

            skinScan.setAnalysisStatus(
                    request.getAnalysisStatus()
            );

        } else {

            skinScan.setAnalysisStatus(
                    "PENDING"
            );
        }

        // -----------------------------------------------------
        // Save
        // -----------------------------------------------------

        SkinScan savedSkinScan =
                skinScanRepository.save(skinScan);

        return convertToResponse(savedSkinScan);
    }

    // =========================================================
    // GET ALL SKIN SCANS FOR USER
    // =========================================================

    public List<SkinScanResponse> getUserSkinScans(
            Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return skinScanRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // =========================================================
    // GET LATEST SKIN SCAN
    // =========================================================

    public SkinScanResponse getLatestSkinScan(
            Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        SkinScan skinScan =
                skinScanRepository
                        .findTopByUserOrderByCreatedAtDesc(user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No Skin Scan found"
                                ));

        return convertToResponse(skinScan);
    }

    // =========================================================
    // GET SKIN SCAN BY ID
    // =========================================================

    public SkinScanResponse getSkinScanById(
            Long id) {

        SkinScan skinScan =
                skinScanRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Skin Scan not found"
                                ));

        return convertToResponse(skinScan);
    }

    // =========================================================
    // UPDATE ANALYSIS STATUS
    // =========================================================

    public SkinScanResponse updateAnalysisStatus(
            Long id,
            String status) {

        SkinScan skinScan =
                skinScanRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Skin Scan not found"
                                ));

        skinScan.setAnalysisStatus(status);

        SkinScan updatedSkinScan =
                skinScanRepository.save(skinScan);

        return convertToResponse(updatedSkinScan);
    }

    // =========================================================
    // DELETE SKIN SCAN
    // =========================================================

    public void deleteSkinScan(Long id) {

        if (!skinScanRepository.existsById(id)) {

            throw new RuntimeException(
                    "Skin Scan not found"
            );
        }

        skinScanRepository.deleteById(id);
    }

    // =========================================================
    // CONVERT ENTITY → RESPONSE
    // =========================================================

    private SkinScanResponse convertToResponse(
            SkinScan skinScan) {

        SkinScanResponse response = new SkinScanResponse(

                skinScan.getId(),

                skinScan.getUser().getId(),

                skinScan.getImagePath(),

                skinScan.getEstimatedSkinType(),

                skinScan.getVisibleCharacteristics(),

                skinScan.getAnalysisStatus(),

                skinScan.getCreatedAt(),

                skinScan.getUpdatedAt()
        );
        response.setSkinType(skinScan.getSkinType());
        response.setSkinTypeConfidence(skinScan.getSkinTypeConfidence());
        response.setSkinTypePredictedClass(skinScan.getSkinTypePredictedClass());
        response.setSkinTypeRequiresReview(skinScan.getSkinTypeRequiresReview());
        response.setSensitivityScore(skinScan.getSensitivityScore());
        return response;
    }
}
