package com.ayurai.ayuraibackend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SkinScanRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    private String imagePath;

    @NotBlank(message = "An acne-severity estimate is required")
    @Pattern(regexp = "(?i)mild|moderate|severe|very severe|uncertain",
            message = "Severity must be Mild, Moderate, Severe, Very Severe, or Uncertain")
    private String estimatedSkinType;

    // Independent of estimatedSkinType, the legacy acne-severity field.
    @Pattern(regexp = "combination|dry|normal|oily|uncertain|unavailable")
    private String skinType;
    @jakarta.validation.constraints.DecimalMin("0.0")
    @jakarta.validation.constraints.DecimalMax("1.0")
    private Double skinTypeConfidence;
    @Pattern(regexp = "combination|dry|normal|oily|uncertain|unavailable")
    private String skinTypePredictedClass;
    private Boolean skinTypeRequiresReview;
    @jakarta.validation.constraints.Min(0)
    @jakarta.validation.constraints.Max(4)
    private Integer sensitivityScore;


    @Size(max = 500, message = "Skin scan notes must be 500 characters or fewer")
    private String visibleCharacteristics;

    private String analysisStatus;

    public SkinScanRequest() {
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
