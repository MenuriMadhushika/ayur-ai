package com.ayurai.ayuraibackend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "dosha_assessments")
public class DoshaAssessment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // User who completed the assessment
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Dosha scores
    private int vataScore;
    private int pittaScore;
    private int kaphaScore;

    // Dosha percentages
    private double vataPercentage;
    private double pittaPercentage;
    private double kaphaPercentage;

    // Dominant dosha
    private String dominantDosha;

    // Assessment date
    private LocalDateTime createdAt;

    public DoshaAssessment() {
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

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

    public int getVataScore() {
        return vataScore;
    }

    public void setVataScore(int vataScore) {
        this.vataScore = vataScore;
    }

    public int getPittaScore() {
        return pittaScore;
    }

    public void setPittaScore(int pittaScore) {
        this.pittaScore = pittaScore;
    }

    public int getKaphaScore() {
        return kaphaScore;
    }

    public void setKaphaScore(int kaphaScore) {
        this.kaphaScore = kaphaScore;
    }

    public double getVataPercentage() {
        return vataPercentage;
    }

    public void setVataPercentage(double vataPercentage) {
        this.vataPercentage = vataPercentage;
    }

    public double getPittaPercentage() {
        return pittaPercentage;
    }

    public void setPittaPercentage(double pittaPercentage) {
        this.pittaPercentage = pittaPercentage;
    }

    public double getKaphaPercentage() {
        return kaphaPercentage;
    }

    public void setKaphaPercentage(double kaphaPercentage) {
        this.kaphaPercentage = kaphaPercentage;
    }

    public String getDominantDosha() {
        return dominantDosha;
    }

    public void setDominantDosha(String dominantDosha) {
        this.dominantDosha = dominantDosha;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}