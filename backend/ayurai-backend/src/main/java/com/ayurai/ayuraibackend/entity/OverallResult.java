package com.ayurai.ayuraibackend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "overall_results")
public class OverallResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================================================
    // USER
    // =========================================================

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // =========================================================
    // SOURCE ASSESSMENTS
    // =========================================================

    @ManyToOne
    @JoinColumn(name = "skin_scan_id", nullable = false)
    private SkinScan skinScan;

    @ManyToOne
    @JoinColumn(name = "dosha_assessment_id", nullable = false)
    private DoshaAssessment doshaAssessment;

    // =========================================================
    // OVERALL RESULT
    // =========================================================

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String skinGuidance;

    @Column(columnDefinition = "TEXT")
    private String lifestyleGuidance;

    @Column(columnDefinition = "TEXT")
    private String ayurvedicGuidance;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public OverallResult() {
    }

    // =========================================================
    // CREATE / UPDATE TIMESTAMPS
    // =========================================================

    @PrePersist
    protected void onCreate() {

        LocalDateTime now =
                LocalDateTime.now();

        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {

        updatedAt =
                LocalDateTime.now();
    }

    // =========================================================
    // GETTERS / SETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public SkinScan getSkinScan() {
        return skinScan;
    }

    public void setSkinScan(SkinScan skinScan) {
        this.skinScan = skinScan;
    }

    public DoshaAssessment getDoshaAssessment() {
        return doshaAssessment;
    }

    public void setDoshaAssessment(
            DoshaAssessment doshaAssessment) {

        this.doshaAssessment =
                doshaAssessment;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getSkinGuidance() {
        return skinGuidance;
    }

    public void setSkinGuidance(
            String skinGuidance) {

        this.skinGuidance =
                skinGuidance;
    }

    public String getLifestyleGuidance() {
        return lifestyleGuidance;
    }

    public void setLifestyleGuidance(
            String lifestyleGuidance) {

        this.lifestyleGuidance =
                lifestyleGuidance;
    }

    public String getAyurvedicGuidance() {
        return ayurvedicGuidance;
    }

    public void setAyurvedicGuidance(
            String ayurvedicGuidance) {

        this.ayurvedicGuidance =
                ayurvedicGuidance;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt) {

        this.createdAt =
                createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(
            LocalDateTime updatedAt) {

        this.updatedAt =
                updatedAt;
    }
}