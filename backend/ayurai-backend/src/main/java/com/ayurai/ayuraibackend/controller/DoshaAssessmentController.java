package com.ayurai.ayuraibackend.controller;

import com.ayurai.ayuraibackend.dto.DoshaAssessmentRequest;
import com.ayurai.ayuraibackend.dto.DoshaAssessmentResponse;
import com.ayurai.ayuraibackend.service.DoshaAssessmentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dosha-assessments")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://localhost:5174"
        }
)
public class DoshaAssessmentController {

    private final DoshaAssessmentService doshaAssessmentService;

    public DoshaAssessmentController(
            DoshaAssessmentService doshaAssessmentService) {

        this.doshaAssessmentService =
                doshaAssessmentService;
    }

    // =========================================================
    // CREATE ASSESSMENT
    // =========================================================

    @PostMapping
    public ResponseEntity<DoshaAssessmentResponse> createAssessment(
            @Valid @RequestBody DoshaAssessmentRequest request) {

        DoshaAssessmentResponse response =
                doshaAssessmentService.createAssessment(request);

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // GET ALL USER ASSESSMENTS
    // =========================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<DoshaAssessmentResponse>>
    getUserAssessments(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                doshaAssessmentService
                        .getUserAssessments(userId)
        );
    }

    // =========================================================
    // GET LATEST USER ASSESSMENT
    // =========================================================

    @GetMapping("/user/{userId}/latest")
    public ResponseEntity<DoshaAssessmentResponse>
    getLatestAssessment(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                doshaAssessmentService
                        .getLatestAssessment(userId)
        );
    }
}