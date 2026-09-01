package com.ayurai.ayuraibackend.controller;

import com.ayurai.ayuraibackend.dto.OverallResultRequest;
import com.ayurai.ayuraibackend.dto.OverallResultResponse;
import com.ayurai.ayuraibackend.entity.User;
import com.ayurai.ayuraibackend.service.OverallResultService;
import com.ayurai.ayuraibackend.service.UserAccessService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    private final UserAccessService userAccessService;

    public OverallResultController(
            OverallResultService overallResultService,
            UserAccessService userAccessService) {

        this.overallResultService = overallResultService;
        this.userAccessService = userAccessService;
    }

    // =========================================================
    // CREATE OVERALL RESULT
    // POST /api/overall-results
    // =========================================================

    @PostMapping
    public ResponseEntity<OverallResultResponse> createOverallResult(
            @Valid @RequestBody OverallResultRequest request,
            @AuthenticationPrincipal User authenticatedUser) {

        userAccessService.requireOwner(authenticatedUser, request.getUserId());

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
            @PathVariable Long userId,
            @AuthenticationPrincipal User authenticatedUser) {

        userAccessService.requireOwner(authenticatedUser, userId);

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
            @PathVariable Long userId,
            @AuthenticationPrincipal User authenticatedUser) {

        userAccessService.requireOwner(authenticatedUser, userId);

        return ResponseEntity.ok(
                overallResultService.getLatestOverallResult(userId)
        );
    }
}
