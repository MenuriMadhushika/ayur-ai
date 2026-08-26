package com.ayurai.ayuraibackend.dto;

import jakarta.validation.constraints.NotNull;

public class SkinAnalysisRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    private String skinType;

    private String concerns;

    private String analysis;

    public SkinAnalysisRequest() {
    }

    // =========================================================
    // USER ID
    // =========================================================

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    // =========================================================
    // SKIN TYPE
    // =========================================================

    public String getSkinType() {
        return skinType;
    }

    public void setSkinType(String skinType) {
        this.skinType = skinType;
    }

    // =========================================================
    // CONCERNS
    // =========================================================

    public String getConcerns() {
        return concerns;
    }

    public void setConcerns(String concerns) {
        this.concerns = concerns;
    }

    // =========================================================
    // ANALYSIS
    // =========================================================

    public String getAnalysis() {
        return analysis;
    }

    public void setAnalysis(String analysis) {
        this.analysis = analysis;
    }
}