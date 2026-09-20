package com.ayurai.ayuraibackend.service;

import com.ayurai.ayuraibackend.dto.OverallResultRequest;
import com.ayurai.ayuraibackend.dto.OverallResultResponse;
import com.ayurai.ayuraibackend.entity.DoshaAssessment;
import com.ayurai.ayuraibackend.entity.OverallResult;
import com.ayurai.ayuraibackend.entity.SkinScan;
import com.ayurai.ayuraibackend.entity.User;
import com.ayurai.ayuraibackend.repository.DoshaAssessmentRepository;
import com.ayurai.ayuraibackend.repository.OverallResultRepository;
import com.ayurai.ayuraibackend.repository.SkinScanRepository;
import com.ayurai.ayuraibackend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OverallResultService {

    private final OverallResultRepository overallResultRepository;
    private final UserRepository userRepository;
    private final SkinScanRepository skinScanRepository;
    private final DoshaAssessmentRepository doshaAssessmentRepository;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public OverallResultService(
            OverallResultRepository overallResultRepository,
            UserRepository userRepository,
            SkinScanRepository skinScanRepository,
            DoshaAssessmentRepository doshaAssessmentRepository) {

        this.overallResultRepository =
                overallResultRepository;

        this.userRepository =
                userRepository;

        this.skinScanRepository =
                skinScanRepository;

        this.doshaAssessmentRepository =
                doshaAssessmentRepository;
    }

    // =========================================================
    // CREATE OR GET OVERALL RESULT
    // =========================================================

    public OverallResultResponse createOverallResult(
            OverallResultRequest request) {

        // -----------------------------------------------------
        // FIND USER
        // -----------------------------------------------------

        User user =
                userRepository.findById(request.getUserId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        // -----------------------------------------------------
        // FIND LATEST SKIN SCAN
        // -----------------------------------------------------

        SkinScan skinScan =
                skinScanRepository
                        .findTopByUserOrderByCreatedAtDesc(user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No Skin Scan found. " +
                                                "Please complete the Skin Scan first."
                                ));

        // -----------------------------------------------------
        // FIND LATEST DOSHA ASSESSMENT
        // -----------------------------------------------------

        DoshaAssessment doshaAssessment =
                doshaAssessmentRepository
                        .findTopByUserOrderByCreatedAtDesc(user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No Dosha Assessment found. " +
                                                "Please complete the Dosha Test first."
                                ));

        // -----------------------------------------------------
        // CHECK EXISTING OVERALL RESULT
        // -----------------------------------------------------

        Optional<OverallResult> existingResult =
                overallResultRepository
                        .findByUserAndSkinScanIdAndDoshaAssessmentId(
                                user,
                                skinScan.getId(),
                                doshaAssessment.getId()
                        );

        // -----------------------------------------------------
        // RETURN EXISTING RESULT
        // -----------------------------------------------------

        if (existingResult.isPresent()) {

            return convertToResponse(
                    existingResult.get()
            );
        }

        // -----------------------------------------------------
        // CREATE NEW OVERALL RESULT
        // -----------------------------------------------------

        OverallResult overallResult =
                new OverallResult();

        overallResult.setUser(user);

        overallResult.setSkinScan(skinScan);

        overallResult.setDoshaAssessment(
                doshaAssessment
        );

        // -----------------------------------------------------
        // GENERATE SUMMARY
        // -----------------------------------------------------

        overallResult.setSummary(
                generateSummary(
                        skinScan,
                        doshaAssessment
                )
        );

        // -----------------------------------------------------
        // GENERATE SKIN GUIDANCE
        // -----------------------------------------------------

        overallResult.setSkinGuidance(
                generateSkinGuidance(
                        skinScan,
                        doshaAssessment
                )
        );

        // -----------------------------------------------------
        // GENERATE LIFESTYLE GUIDANCE
        // -----------------------------------------------------

        overallResult.setLifestyleGuidance(
                generateLifestyleGuidance(
                        doshaAssessment
                )
        );

        // -----------------------------------------------------
        // GENERATE AYURVEDIC GUIDANCE
        // -----------------------------------------------------

        overallResult.setAyurvedicGuidance(
                generateAyurvedicGuidance(
                        doshaAssessment
                )
        );

        // -----------------------------------------------------
        // SAVE
        // -----------------------------------------------------

        OverallResult savedResult =
                overallResultRepository.save(
                        overallResult
                );

        // -----------------------------------------------------
        // RETURN RESPONSE
        // -----------------------------------------------------

        return convertToResponse(
                savedResult
        );
    }

    // =========================================================
    // GET ALL RESULTS FOR USER
    // =========================================================

    public List<OverallResultResponse> getUserOverallResults(
            Long userId) {

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        return overallResultRepository
                .findByUser(user)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // =========================================================
    // GET LATEST RESULT
    // =========================================================

    public OverallResultResponse getLatestOverallResult(
            Long userId) {

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                ));

        OverallResult result =
                overallResultRepository
                        .findTopByUserOrderByCreatedAtDesc(user)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "No Overall Result found"
                                ));

        return convertToResponse(
                result
        );
    }

    // =========================================================
    // GENERATE SUMMARY
    // =========================================================

    private String generateSummary(
            SkinScan skinScan,
            DoshaAssessment doshaAssessment) {

        String dominantDosha =
                doshaAssessment.getDominantDosha();

        if (dominantDosha == null ||
                dominantDosha.isBlank()) {

            dominantDosha =
                    "your assessed";
        }

        String patternDescription = dominantDosha.contains("-")
                ? "a blended " + dominantDosha.replace("-", " and ")
                : dominantDosha;

        return "Your educational acne-severity estimate and Dosha " +
                "questionnaire are shown together for convenience. Your answers indicate " +
                patternDescription +
                " Ayurvedic wellness pattern; it is separate from the AI scan and is not a medical diagnosis.";
    }

    // =========================================================
    // GENERATE SKIN GUIDANCE
    // =========================================================

    private String generateSkinGuidance(
            SkinScan skinScan,
            DoshaAssessment doshaAssessment) {

        String severity =
                skinScan.getEstimatedSkinType();

        if ("UNCERTAIN".equalsIgnoreCase(skinScan.getAnalysisStatus())) {
            return "The skin scan could not produce a reliable estimate. This educational result is not a medical diagnosis.";
        }

        if (severity == null || severity.isBlank()) {
            return "Follow a gentle skincare routine " +
                    "and observe how your skin responds " +
                    "to products and environmental changes.";
        }

        if ("severe".equalsIgnoreCase(severity) ||
                "very severe".equalsIgnoreCase(severity)) {
            return "The model estimated " + severity +
                    " acne-like severity. This is not a diagnosis; consider advice from a qualified healthcare professional.";
        }

        return "The model estimated " + severity +
                " acne-like severity. This educational result is not a diagnosis; keep care gentle and non-comedogenic.";
    }

    // =========================================================
    // GENERATE LIFESTYLE GUIDANCE
    // =========================================================

    private String generateLifestyleGuidance(
            DoshaAssessment doshaAssessment) {

        String dominantDosha =
                doshaAssessment.getDominantDosha();

        if (dominantDosha == null) {

            return "Maintain a consistent daily routine, " +
                    "balanced meals, adequate hydration " +
                    "and sufficient rest.";
        }

        String primaryDosha = dominantDosha.split("-")[0];

        if ("Vata".equalsIgnoreCase(
                primaryDosha)) {

            return "Maintain a regular daily routine, " +
                    "prioritize adequate rest and hydration, " +
                    "and favor calming lifestyle practices.";
        }

        if ("Pitta".equalsIgnoreCase(
                primaryDosha)) {

            return "Favor balanced routines, adequate " +
                    "rest, hydration and practices that " +
                    "support calm and relaxation.";
        }

        if ("Kapha".equalsIgnoreCase(
                primaryDosha)) {

            return "Maintain a consistent daily routine, " +
                    "regular movement, balanced meals and " +
                    "adequate rest.";
        }

        return "Maintain a balanced daily routine, " +
                "adequate hydration, balanced meals " +
                "and sufficient rest.";
    }

    // =========================================================
    // GENERATE AYURVEDIC GUIDANCE
    // =========================================================

    private String generateAyurvedicGuidance(
            DoshaAssessment doshaAssessment) {

        String dominantDosha =
                doshaAssessment.getDominantDosha();

        if (dominantDosha == null ||
                dominantDosha.isBlank()) {

            return "Use your assessment as a " +
                    "wellness-oriented guide for exploring " +
                    "Ayurvedic practices. It is not a " +
                    "medical diagnosis.";
        }

        String patternDescription = dominantDosha.contains("-")
                ? "a blend of " + dominantDosha.replace("-", " and ")
                : dominantDosha + " as the stronger pattern";

        return "Your assessment indicates " +
                patternDescription + ". " +
                "Use this result as a wellness-oriented " +
                "guide for exploring Ayurvedic practices. " +
                "It is not a medical diagnosis.";
    }

    // =========================================================
    // ENTITY Ã¢â€ â€™ RESPONSE
    // =========================================================

    private OverallResultResponse convertToResponse(
            OverallResult result) {

        DoshaAssessment dosha =
                result.getDoshaAssessment();

        SkinScan skin =
                result.getSkinScan();

        return new OverallResultResponse(

                // -------------------------------------------------
                // BASIC
                // -------------------------------------------------

                result.getId(),

                result.getUser().getId(),

                // -------------------------------------------------
                // DOSHA SCORES
                // -------------------------------------------------

                dosha.getVataScore(),

                dosha.getPittaScore(),

                dosha.getKaphaScore(),

                // -------------------------------------------------
                // DOSHA PERCENTAGES
                // -------------------------------------------------

                dosha.getVataPercentage(),

                dosha.getPittaPercentage(),

                dosha.getKaphaPercentage(),

                // -------------------------------------------------
                // DOMINANT DOSHA
                // -------------------------------------------------

                dosha.getDominantDosha(),

                // -------------------------------------------------
                // SKIN
                // -------------------------------------------------

                skin.getEstimatedSkinType(),

                skin.getVisibleCharacteristics(),

                skin.getAnalysisStatus(),

                // -------------------------------------------------
                // GUIDANCE
                // -------------------------------------------------

                result.getSummary(),

                result.getSkinGuidance(),

                result.getLifestyleGuidance(),

                result.getAyurvedicGuidance(),

                // -------------------------------------------------
                // TIMESTAMPS
                // -------------------------------------------------

                result.getCreatedAt(),

                result.getUpdatedAt()
        );
    }
}


