package com.ayurai.ayuraibackend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class SkinScanRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    private String imagePath;

    @NotBlank(message = "Please choose your usual skin type")
    @Pattern(regexp = "(?i)normal|dry|oily|combination|sensitive",
            message = "Skin type must be Normal, Dry, Oily, Combination, or Sensitive")
    private String estimatedSkinType;

    @Size(max = 500, message = "Skin profile notes must be 500 characters or fewer")
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
}
