package com.ayurai.ayuraibackend.dto;

import java.util.Map;

// Privacy-safe platform totals used by the administrator dashboard.
// This response never includes photos, passwords, or personal guidance.
public class AdminInsightResponse {

    private final Map<String, Long> skinTypeCounts;
    private final Map<String, Long> doshaPatternCounts;
    private final long totalOverallResults;

    public AdminInsightResponse(
            Map<String, Long> skinTypeCounts,
            Map<String, Long> doshaPatternCounts,
            long totalOverallResults
    ) {
        this.skinTypeCounts = skinTypeCounts;
        this.doshaPatternCounts = doshaPatternCounts;
        this.totalOverallResults = totalOverallResults;
    }

    public Map<String, Long> getSkinTypeCounts() {
        return skinTypeCounts;
    }

    public Map<String, Long> getDoshaPatternCounts() {
        return doshaPatternCounts;
    }

    public long getTotalOverallResults() {
        return totalOverallResults;
    }
}
