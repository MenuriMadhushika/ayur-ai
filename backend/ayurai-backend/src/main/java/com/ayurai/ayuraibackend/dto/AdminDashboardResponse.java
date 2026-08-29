package com.ayurai.ayuraibackend.dto;

// =========================================================
// ADMIN DASHBOARD SUMMARY
// Returned only to authenticated ADMIN accounts.
// =========================================================
public class AdminDashboardResponse {

    private final long totalUsers;
    private final long totalSkinScans;
    private final long totalDoshaAssessments;
    private final long totalOverallResults;

    public AdminDashboardResponse(
            long totalUsers,
            long totalSkinScans,
            long totalDoshaAssessments,
            long totalOverallResults
    ) {
        this.totalUsers = totalUsers;
        this.totalSkinScans = totalSkinScans;
        this.totalDoshaAssessments = totalDoshaAssessments;
        this.totalOverallResults = totalOverallResults;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public long getTotalSkinScans() {
        return totalSkinScans;
    }

    public long getTotalDoshaAssessments() {
        return totalDoshaAssessments;
    }

    public long getTotalOverallResults() {
        return totalOverallResults;
    }
}
