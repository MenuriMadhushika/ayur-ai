package com.ayurai.ayuraibackend.dto;

import java.time.LocalDateTime;

public class OverallResultResponse {

    private Long id;
    private Long userId;

    // =========================================================
    // DOSHA RESULT
    // =========================================================

    private int vataScore;
    private int pittaScore;
    private int kaphaScore;

    private double vataPercentage;
    private double pittaPercentage;
    private double kaphaPercentage;

    private String dominantDosha;

    // =========================================================
    // SKIN RESULT
    // =========================================================

    private String estimatedSkinType;

    // Independent of estimatedSkinType, the legacy acne-severity field.
    private String skinType;
    private Double skinTypeConfidence;
    private String skinTypePredictedClass;
    private Boolean skinTypeRequiresReview;
    private Integer sensitivityScore;

    private String visibleCharacteristics;
    private String analysisStatus;

    // =========================================================
    // OVERALL GUIDANCE
    // =========================================================

    private String summary;
    private String skinGuidance;
    private String lifestyleGuidance;
    private String ayurvedicGuidance;

    // =========================================================
    // TIMESTAMP
    // =========================================================

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public OverallResultResponse() {
    }

    public OverallResultResponse(
            Long id,
            Long userId,

            int vataScore,
            int pittaScore,
            int kaphaScore,

            double vataPercentage,
            double pittaPercentage,
            double kaphaPercentage,

            String dominantDosha,

            String estimatedSkinType,
            String visibleCharacteristics,
            String analysisStatus,

            String summary,
            String skinGuidance,
            String lifestyleGuidance,
            String ayurvedicGuidance,

            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.userId = userId;

        this.vataScore = vataScore;
        this.pittaScore = pittaScore;
        this.kaphaScore = kaphaScore;

        this.vataPercentage = vataPercentage;
        this.pittaPercentage = pittaPercentage;
        this.kaphaPercentage = kaphaPercentage;

        this.dominantDosha = dominantDosha;

        this.estimatedSkinType = estimatedSkinType;
        this.visibleCharacteristics = visibleCharacteristics;
        this.analysisStatus = analysisStatus;

        this.summary = summary;
        this.skinGuidance = skinGuidance;
        this.lifestyleGuidance = lifestyleGuidance;
        this.ayurvedicGuidance = ayurvedicGuidance;

        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // =========================================================
    // GETTERS / SETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public int getVataScore() {
        return vataScore;
    }

    public void setVataScore(int vataScore) {
        this.vataScore = vataScore;
    }

    public int getPittaScore() {
        return pittaScore;
    }

    public void setPittaScore(int pittaScore) {
        this.pittaScore = pittaScore;
    }

    public int getKaphaScore() {
        return kaphaScore;
    }

    public void setKaphaScore(int kaphaScore) {
        this.kaphaScore = kaphaScore;
    }

    public double getVataPercentage() {
        return vataPercentage;
    }

    public void setVataPercentage(double vataPercentage) {
        this.vataPercentage = vataPercentage;
    }

    public double getPittaPercentage() {
        return pittaPercentage;
    }

    public void setPittaPercentage(double pittaPercentage) {
        this.pittaPercentage = pittaPercentage;
    }

    public double getKaphaPercentage() {
        return kaphaPercentage;
    }

    public void setKaphaPercentage(double kaphaPercentage) {
        this.kaphaPercentage = kaphaPercentage;
    }

    public String getDominantDosha() {
        return dominantDosha;
    }

    public void setDominantDosha(String dominantDosha) {
        this.dominantDosha = dominantDosha;
    }

    public String getEstimatedSkinType() {
        return estimatedSkinType;
    }

    public void setEstimatedSkinType(String estimatedSkinType) {
        this.estimatedSkinType = estimatedSkinType;
    }

    public String getVisibleCharacteristics() {
        return visibleCharacteristics;
    }

    public void setVisibleCharacteristics(
            String visibleCharacteristics) {

        this.visibleCharacteristics =
                visibleCharacteristics;
    }

    public String getAnalysisStatus() {
        return analysisStatus;
    }

    public void setAnalysisStatus(String analysisStatus) {
        this.analysisStatus = analysisStatus;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getSkinGuidance() {
        return skinGuidance;
    }

    public void setSkinGuidance(String skinGuidance) {
        this.skinGuidance = skinGuidance;
    }

    public String getLifestyleGuidance() {
        return lifestyleGuidance;
    }

    public void setLifestyleGuidance(
            String lifestyleGuidance) {

        this.lifestyleGuidance =
                lifestyleGuidance;
    }

    public String getAyurvedicGuidance() {
        return ayurvedicGuidance;
    }

    public void setAyurvedicGuidance(
            String ayurvedicGuidance) {

        this.ayurvedicGuidance =
                ayurvedicGuidance;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt) {

        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(
            LocalDateTime updatedAt) {

        this.updatedAt = updatedAt;
    }

    public String getSkinType() { return skinType; }
    public void setSkinType(String value) { this.skinType = value; }
    public Double getSkinTypeConfidence() { return skinTypeConfidence; }
    public void setSkinTypeConfidence(Double value) { this.skinTypeConfidence = value; }
    public String getSkinTypePredictedClass() { return skinTypePredictedClass; }
    public void setSkinTypePredictedClass(String value) { this.skinTypePredictedClass = value; }
    public Boolean getSkinTypeRequiresReview() { return skinTypeRequiresReview; }
    public void setSkinTypeRequiresReview(Boolean value) { this.skinTypeRequiresReview = value; }
    public Integer getSensitivityScore() { return sensitivityScore; }
    public void setSensitivityScore(Integer value) { this.sensitivityScore = value; }
}
