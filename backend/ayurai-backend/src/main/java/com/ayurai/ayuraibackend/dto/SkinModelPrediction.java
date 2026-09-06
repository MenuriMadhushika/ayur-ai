package com.ayurai.ayuraibackend.dto;

import java.util.Map;

public record SkinModelPrediction(String status, String estimatedCategory,
        Double modelScore, Map<String, Double> probabilities, String message,
        String disclaimer, String modelVersion) {
}
