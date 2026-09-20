package com.ayurai.ayuraibackend.dto;

import java.time.LocalDateTime;
import java.util.Map;

public record SkinScanAnalysisResponse(Long scanId, Long userId, String status,
        String estimatedCategory, Double modelScore, Map<String, Double> probabilities,
        String message, String disclaimer, String modelVersion, LocalDateTime createdAt,
        SkinTypePrediction skinType, Integer sensitivityScore) {
}
