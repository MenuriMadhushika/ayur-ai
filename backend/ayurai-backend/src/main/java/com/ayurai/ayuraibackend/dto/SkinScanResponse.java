package com.ayurai.ayuraibackend.dto;

import java.time.LocalDateTime;

public class SkinScanResponse {

    private Long id;
    private Long userId;

    private String imagePath;
    private String estimatedSkinType;

    // Independent of estimatedSkinType, the legacy acne-severity field.
    private String skinType;
    private Double skinTypeConfidence;
    private String skinTypePredictedClass;
    private Boolean skinTypeRequiresReview;
    private Integer sensitivityScore;

    private String visibleCharacteristics;
    private String analysisStatus;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public SkinScanResponse() {
    }

    public SkinScanResponse(
            Long id,
            Long userId,
            String imagePath,
            String estimatedSkinType,
            String visibleCharacteristics,
            String analysisStatus,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.userId = userId;
        this.imagePath = imagePath;
        this.estimatedSkinType = estimatedSkinType;
        this.visibleCharacteristics = visibleCharacteristics;
        this.analysisStatus = analysisStatus;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

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

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
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

    public void setVisibleCharacteristics(String visibleCharacteristics) {
        this.visibleCharacteristics = visibleCharacteristics;
    }

    public String getAnalysisStatus() {
        return analysisStatus;
    }

    public void setAnalysisStatus(String analysisStatus) {
        this.analysisStatus = analysisStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
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
