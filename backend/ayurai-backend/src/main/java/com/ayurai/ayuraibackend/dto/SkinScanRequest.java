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
}
