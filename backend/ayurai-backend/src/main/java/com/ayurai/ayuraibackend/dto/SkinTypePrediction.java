package com.ayurai.ayuraibackend.dto;

import java.util.Map;

@com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
public record SkinTypePrediction(String skinType, Double confidence, String predictedClass,
        boolean requiresReview, Map<String, Double> probabilities) {
}
