package com.ayurai.ayuraibackend.controller;

import com.ayurai.ayuraibackend.dto.SkinScanRequest;
import com.ayurai.ayuraibackend.dto.SkinScanResponse;
import com.ayurai.ayuraibackend.dto.SkinModelPrediction;
import com.ayurai.ayuraibackend.dto.SkinScanAnalysisResponse;
import com.ayurai.ayuraibackend.entity.User;
import com.ayurai.ayuraibackend.service.SkinScanService;
import com.ayurai.ayuraibackend.service.SkinModelClient;
import com.ayurai.ayuraibackend.service.SkinScanRateLimitService;
import com.ayurai.ayuraibackend.service.UserAccessService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/skin-scans")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://localhost:5174"
        }
)
public class SkinScanController {

    private final SkinScanService skinScanService;
    private final UserAccessService userAccessService;
    private final SkinModelClient skinModelClient;
    private final SkinScanRateLimitService rateLimitService;

    public SkinScanController(SkinScanService skinScanService,
                              UserAccessService userAccessService,
                              SkinModelClient skinModelClient,
                              SkinScanRateLimitService rateLimitService) {
        this.skinScanService = skinScanService;
        this.userAccessService = userAccessService;
        this.skinModelClient = skinModelClient;
        this.rateLimitService = rateLimitService;
    }

    // Retain the existing Java entry point used by callers/tests.
    public ResponseEntity<SkinScanAnalysisResponse> analyzeSkinPhoto(
            Long userId, MultipartFile image, User authenticatedUser) {
        return analyzeSkinPhoto(userId, image, authenticatedUser, null);
    }

    @PostMapping(value = "/analyze/user/{userId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SkinScanAnalysisResponse> analyzeSkinPhoto(
            @PathVariable Long userId,
            @RequestPart("image") MultipartFile image,
            @AuthenticationPrincipal User authenticatedUser,
            @RequestParam(required = false) String sensitivityAnswers) {
        userAccessService.requireOwner(authenticatedUser, userId);
        Integer sensitivityScore = null;
        if (sensitivityAnswers != null) {
            if (!sensitivityAnswers.matches("[01]{4}")) {
                throw new IllegalArgumentException("Sensitivity requires four yes/no answers");
            }
            sensitivityScore = (int) sensitivityAnswers.chars().filter(answer -> answer == '1').count();
        }
        rateLimitService.check(userId);
        SkinModelPrediction prediction = skinModelClient.predict(image);

        SkinScanRequest request = new SkinScanRequest();
        request.setUserId(userId);
        request.setSensitivityScore(sensitivityScore);
        if (prediction.skinType() != null) {
            request.setSkinType(prediction.skinType().skinType());
            request.setSkinTypeConfidence(prediction.skinType().confidence());
            request.setSkinTypePredictedClass(prediction.skinType().predictedClass());
            request.setSkinTypeRequiresReview(prediction.skinType().requiresReview());
        }
        request.setImagePath(null);
        request.setEstimatedSkinType(prediction.estimatedCategory());
        request.setVisibleCharacteristics(prediction.message());
        request.setAnalysisStatus(prediction.status().toUpperCase());

        SkinScanResponse saved = skinScanService.createSkinScan(request);
        return ResponseEntity.ok(new SkinScanAnalysisResponse(
                saved.getId(), saved.getUserId(), prediction.status(),
                prediction.estimatedCategory(), prediction.modelScore(),
                prediction.probabilities(), prediction.message(),
                prediction.disclaimer(), prediction.modelVersion(), saved.getCreatedAt(), prediction.skinType(), sensitivityScore));
    }

    @PostMapping
    public ResponseEntity<SkinScanResponse> createSkinScan(
            @Valid @RequestBody SkinScanRequest request,
            @AuthenticationPrincipal User authenticatedUser) {

        userAccessService.requireOwner(authenticatedUser, request.getUserId());

        return ResponseEntity.ok(
                skinScanService.createSkinScan(request)
        );
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SkinScanResponse>> getUserSkinScans(
            @PathVariable Long userId,
            @AuthenticationPrincipal User authenticatedUser) {

        userAccessService.requireOwner(authenticatedUser, userId);

        return ResponseEntity.ok(
                skinScanService.getUserSkinScans(userId)
        );
    }

    @GetMapping("/user/{userId}/latest")
    public ResponseEntity<SkinScanResponse> getLatestSkinScan(
            @PathVariable Long userId,
            @AuthenticationPrincipal User authenticatedUser) {

        userAccessService.requireOwner(authenticatedUser, userId);

        return ResponseEntity.ok(
                skinScanService.getLatestSkinScan(userId)
        );
    }
}
