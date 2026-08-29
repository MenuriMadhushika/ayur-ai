package com.ayurai.ayuraibackend.dto;

// =========================================================
// SAFE, READ-ONLY ADMIN VIEW OF ONE USER'S ACTIVITY
// This DTO deliberately excludes passwords, image paths,
// and detailed personal guidance.
// =========================================================
public class AdminUserActivityResponse {

    private final Long id;
    private final String name;
    private final String email;
    private final Integer age;
    private final String role;
    private final int totalSkinScans;
    private final int totalDoshaAssessments;
    private final int totalOverallResults;
    private final String latestEstimatedSkinType;
    private final String latestAnalysisStatus;
    private final String latestDominantDosha;

    public AdminUserActivityResponse(
            Long id,
            String name,
            String email,
            Integer age,
            String role,
            int totalSkinScans,
            int totalDoshaAssessments,
            int totalOverallResults,
            String latestEstimatedSkinType,
            String latestAnalysisStatus,
            String latestDominantDosha
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
        this.role = role;
        this.totalSkinScans = totalSkinScans;
        this.totalDoshaAssessments = totalDoshaAssessments;
        this.totalOverallResults = totalOverallResults;
        this.latestEstimatedSkinType = latestEstimatedSkinType;
        this.latestAnalysisStatus = latestAnalysisStatus;
        this.latestDominantDosha = latestDominantDosha;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public Integer getAge() { return age; }
    public String getRole() { return role; }
    public int getTotalSkinScans() { return totalSkinScans; }
    public int getTotalDoshaAssessments() { return totalDoshaAssessments; }
    public int getTotalOverallResults() { return totalOverallResults; }
    public String getLatestEstimatedSkinType() { return latestEstimatedSkinType; }
    public String getLatestAnalysisStatus() { return latestAnalysisStatus; }
    public String getLatestDominantDosha() { return latestDominantDosha; }
}
