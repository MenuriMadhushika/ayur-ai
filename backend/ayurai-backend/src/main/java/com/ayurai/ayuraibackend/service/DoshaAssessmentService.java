package com.ayurai.ayuraibackend.service;

import com.ayurai.ayuraibackend.dto.DoshaAssessmentRequest;
import com.ayurai.ayuraibackend.dto.DoshaAssessmentResponse;
import com.ayurai.ayuraibackend.entity.DoshaAssessment;
import com.ayurai.ayuraibackend.entity.User;
import com.ayurai.ayuraibackend.repository.DoshaAssessmentRepository;
import com.ayurai.ayuraibackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoshaAssessmentService {

    private final DoshaAssessmentRepository doshaAssessmentRepository;
    private final UserRepository userRepository;

    public DoshaAssessmentService(
            DoshaAssessmentRepository doshaAssessmentRepository,
            UserRepository userRepository) {

        this.doshaAssessmentRepository = doshaAssessmentRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // CREATE ASSESSMENT
    // =========================================================

    public DoshaAssessmentResponse createAssessment(
            DoshaAssessmentRequest request) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<String> answers = request.getAnswers();

        if (answers == null || answers.size() != 8) {
            throw new RuntimeException(
                    "Dosha assessment must contain exactly 8 answers"
            );
        }

        int vataScore = 0;
        int pittaScore = 0;
        int kaphaScore = 0;

        for (String answer : answers) {

            if (answer == null) {
                throw new RuntimeException(
                        "Answer cannot be empty"
                );
            }

            switch (answer.trim().toLowerCase()) {

                case "vata":
                    vataScore++;
                    break;

                case "pitta":
                    pittaScore++;
                    break;

                case "kapha":
                    kaphaScore++;
                    break;

                default:
                    throw new RuntimeException(
                            "Invalid Dosha answer: " + answer
                    );
            }
        }

        int total = answers.size();

        double vataPercentage =
                calculatePercentage(vataScore, total);

        double pittaPercentage =
                calculatePercentage(pittaScore, total);

        double kaphaPercentage =
                calculatePercentage(kaphaScore, total);

        String dominantDosha =
                calculateDominantDosha(
                        vataScore,
                        pittaScore,
                        kaphaScore
                );

        DoshaAssessment assessment =
                new DoshaAssessment();

        assessment.setUser(user);

        assessment.setVataScore(vataScore);
        assessment.setPittaScore(pittaScore);
        assessment.setKaphaScore(kaphaScore);

        assessment.setVataPercentage(vataPercentage);
        assessment.setPittaPercentage(pittaPercentage);
        assessment.setKaphaPercentage(kaphaPercentage);

        assessment.setDominantDosha(dominantDosha);

        DoshaAssessment savedAssessment =
                doshaAssessmentRepository.save(assessment);

        return convertToResponse(savedAssessment);
    }

    // =========================================================
    // GET ALL ASSESSMENTS FOR USER
    // =========================================================

    public List<DoshaAssessmentResponse> getUserAssessments(
            Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return doshaAssessmentRepository
                .findByUser(user)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // =========================================================
    // GET LATEST ASSESSMENT
    // =========================================================

    public DoshaAssessmentResponse getLatestAssessment(
            Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        DoshaAssessment assessment =
                doshaAssessmentRepository
                        .findTopByUserOrderByCreatedAtDesc(user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No Dosha assessment found"
                                ));

        return convertToResponse(assessment);
    }

    // =========================================================
    // CALCULATE PERCENTAGE
    // =========================================================

    private double calculatePercentage(
            int score,
            int total) {

        return Math.round(
                ((double) score / total) * 100
        );
    }

    // =========================================================
    // FIND DOMINANT DOSHA
    // =========================================================

    private String calculateDominantDosha(
            int vata,
            int pitta,
            int kapha) {

        if (vata >= pitta && vata >= kapha) {
            return "Vata";
        }

        if (pitta >= vata && pitta >= kapha) {
            return "Pitta";
        }

        return "Kapha";
    }

    // =========================================================
    // CONVERT ENTITY → RESPONSE
    // =========================================================

    private DoshaAssessmentResponse convertToResponse(
            DoshaAssessment assessment) {

        return new DoshaAssessmentResponse(
                assessment.getId(),
                assessment.getUser().getId(),
                assessment.getVataScore(),
                assessment.getPittaScore(),
                assessment.getKaphaScore(),
                assessment.getVataPercentage(),
                assessment.getPittaPercentage(),
                assessment.getKaphaPercentage(),
                assessment.getDominantDosha()
        );
    }
}