package com.ayurai.ayuraibackend.controller;

import com.ayurai.ayuraibackend.dto.SkinAnalysisRequest;
import com.ayurai.ayuraibackend.dto.SkinAnalysisResponse;
import com.ayurai.ayuraibackend.service.SkinAnalysisService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skin-analysis")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5178"
        }
)
public class SkinAnalysisController {

    private final SkinAnalysisService skinAnalysisService;

    public SkinAnalysisController(
            SkinAnalysisService skinAnalysisService) {

        this.skinAnalysisService =
                skinAnalysisService;
    }

    // =========================================================
    // CREATE SKIN ANALYSIS
    // =========================================================

    @PostMapping
    public ResponseEntity<SkinAnalysisResponse> createAnalysis(
            @Valid @RequestBody SkinAnalysisRequest request) {

        SkinAnalysisResponse response =
                skinAnalysisService.createAnalysis(request);

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // GET ALL USER ANALYSES
    // =========================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SkinAnalysisResponse>>
    getUserAnalyses(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                skinAnalysisService
                        .getUserAnalyses(userId)
        );
    }

    // =========================================================
    // GET LATEST USER ANALYSIS
    // =========================================================

    @GetMapping("/user/{userId}/latest")
    public ResponseEntity<SkinAnalysisResponse>
    getLatestAnalysis(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                skinAnalysisService
                        .getLatestAnalysis(userId)
        );
    }
}