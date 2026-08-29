package com.ayurai.ayuraibackend.controller;

import com.ayurai.ayuraibackend.dto.AdminDashboardResponse;
import com.ayurai.ayuraibackend.dto.AdminInsightResponse;
import com.ayurai.ayuraibackend.dto.AdminUserActivityResponse;
import com.ayurai.ayuraibackend.dto.AdminUserResponse;
import com.ayurai.ayuraibackend.entity.User;
import com.ayurai.ayuraibackend.repository.DoshaAssessmentRepository;
import com.ayurai.ayuraibackend.repository.OverallResultRepository;
import com.ayurai.ayuraibackend.repository.SkinScanRepository;
import com.ayurai.ayuraibackend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

// =========================================================
// ADMIN-ONLY API
// SecurityConfig protects every /api/admin/** endpoint.
// =========================================================
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final SkinScanRepository skinScanRepository;
    private final DoshaAssessmentRepository doshaAssessmentRepository;
    private final OverallResultRepository overallResultRepository;

    public AdminController(
            UserRepository userRepository,
            SkinScanRepository skinScanRepository,
            DoshaAssessmentRepository doshaAssessmentRepository,
            OverallResultRepository overallResultRepository
    ) {
        this.userRepository = userRepository;
        this.skinScanRepository = skinScanRepository;
        this.doshaAssessmentRepository = doshaAssessmentRepository;
        this.overallResultRepository = overallResultRepository;
    }

    // GET /api/admin/dashboard
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboardSummary() {

        AdminDashboardResponse response =
                new AdminDashboardResponse(
                        userRepository.count(),
                        skinScanRepository.count(),
                        doshaAssessmentRepository.count(),
                        overallResultRepository.count()
                );

        return ResponseEntity.ok(response);
    }

    // GET /api/admin/insights
    // Returns anonymous totals for each dashboard insight card.
    @GetMapping("/insights")
    public ResponseEntity<AdminInsightResponse> getPlatformInsights() {

        Map<String, Long> skinTypeCounts = skinScanRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(
                        skinScan -> displayValue(skinScan.getEstimatedSkinType()),
                        TreeMap::new,
                        Collectors.counting()
                ));

        Map<String, Long> doshaPatternCounts = doshaAssessmentRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(
                        dosha -> displayValue(dosha.getDominantDosha()),
                        TreeMap::new,
                        Collectors.counting()
                ));

        return ResponseEntity.ok(new AdminInsightResponse(
                skinTypeCounts,
                doshaPatternCounts,
                overallResultRepository.count()
        ));
    }

    // GET /api/admin/users
    // Returns safe account details only. Passwords are never exposed.
    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getAllUsers() {

        List<AdminUserResponse> users = userRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(User::getId).reversed())
                .map(user -> new AdminUserResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getAge(),
                        user.getRole().name()
                ))
                .toList();

        return ResponseEntity.ok(users);
    }

    // GET /api/admin/users/{id}/activity
    // Returns a privacy-conscious activity summary for administrators.
    @GetMapping("/users/{id}/activity")
    public ResponseEntity<AdminUserActivityResponse> getUserActivity(
            @PathVariable Long id
    ) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found."
                ));

        AdminUserActivityResponse response =
                new AdminUserActivityResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getAge(),
                        user.getRole().name(),
                        skinScanRepository.findByUser(user).size(),
                        doshaAssessmentRepository.findByUser(user).size(),
                        overallResultRepository.findByUser(user).size(),
                        skinScanRepository.findTopByUserOrderByCreatedAtDesc(user)
                                .map(skinScan -> skinScan.getEstimatedSkinType())
                                .orElse(null),
                        skinScanRepository.findTopByUserOrderByCreatedAtDesc(user)
                                .map(skinScan -> skinScan.getAnalysisStatus())
                                .orElse(null),
                        doshaAssessmentRepository.findTopByUserOrderByCreatedAtDesc(user)
                                .map(dosha -> dosha.getDominantDosha())
                                .orElse(null)
                );

        return ResponseEntity.ok(response);
    }

    private String displayValue(String value) {
        if (value == null || value.isBlank()) {
            return "Not available";
        }

        return value.replaceFirst("(?i)^AI-estimated\\s*", "").trim();
    }
}
