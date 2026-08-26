package com.ayurai.ayuraibackend.dto;

import java.time.LocalDateTime;

public class SkinAnalysisResponse {

    private Long id;
    private Long userId;

    private String skinType;
    private String concerns;
    private String analysis;

    private LocalDateTime createdAt;

    public SkinAnalysisResponse() {
    }

    public SkinAnalysisResponse(
            Long id,
            Long userId,
            String skinType,
            String concerns,
            String analysis,
            LocalDateTime createdAt) {

        this.id = id;
        this.userId = userId;
        this.skinType = skinType;
        this.concerns = concerns;
        this.analysis = analysis;
        this.createdAt = createdAt;
    }

    // =========================================================
    // ID
    // =========================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    // =========================================================
    // CREATED AT
    // =========================================================

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}