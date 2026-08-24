package com.ayurai.ayuraibackend.dto;

public class DoshaAssessmentResponse {

    private Long id;
    private Long userId;

    private int vataScore;
    private int pittaScore;
    private int kaphaScore;

    private double vataPercentage;
    private double pittaPercentage;
    private double kaphaPercentage;

    private String dominantDosha;

    public DoshaAssessmentResponse() {
    }

    public DoshaAssessmentResponse(
            Long id,
            Long userId,
            int vataScore,
            int pittaScore,
            int kaphaScore,
            double vataPercentage,
            double pittaPercentage,
            double kaphaPercentage,
            String dominantDosha) {

        this.id = id;
        this.userId = userId;
        this.vataScore = vataScore;
        this.pittaScore = pittaScore;
        this.kaphaScore = kaphaScore;
        this.vataPercentage = vataPercentage;
        this.pittaPercentage = pittaPercentage;
        this.kaphaPercentage = kaphaPercentage;
        this.dominantDosha = dominantDosha;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
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
}