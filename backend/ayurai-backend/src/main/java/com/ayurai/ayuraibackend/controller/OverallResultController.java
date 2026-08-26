package com.ayurai.ayuraibackend.controller;

import com.ayurai.ayuraibackend.dto.OverallResultRequest;
import com.ayurai.ayuraibackend.dto.OverallResultResponse;
import com.ayurai.ayuraibackend.service.OverallResultService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/overall-results")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5178"
        },
        allowCredentials = "true"
)
public class OverallResultController {

    private final OverallResultService overallResultService;

    public OverallResultController(
            OverallResultService overallResultService) {

        this.overallResultService = overallResultService;
    }

    // =========================================================
    // CREATE OVERALL RESULT
    // POST /api/overall-results
    // =========================================================

    @PostMapping
    public ResponseEntity<OverallResultResponse> createOverallResult(
            @Valid @RequestBody OverallResultRequest request) {

        OverallResultResponse response =
                overallResultService.createOverallResult(request);

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // GET ALL RESULTS FOR USER
    // GET /api/overall-results/user/{userId}
    // =========================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OverallResultResponse>> getUserOverallResults(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                overallResultService.getUserOverallResults(userId)
        );
    }

    // =========================================================
    // GET LATEST RESULT
    // GET /api/overall-results/user/{userId}/latest
    // =========================================================

    @GetMapping("/user/{userId}/latest")
    public ResponseEntity<OverallResultResponse> getLatestOverallResult(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                overallResultService.getLatestOverallResult(userId)
        );
    }
}