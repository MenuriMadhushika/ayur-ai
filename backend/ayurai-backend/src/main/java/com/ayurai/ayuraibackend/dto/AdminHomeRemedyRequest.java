package com.ayurai.ayuraibackend.dto;

import jakarta.validation.constraints.NotBlank;

// =========================================================
// INPUT USED ONLY BY ADMIN REMEDY MANAGEMENT ENDPOINTS
// =========================================================
public class AdminHomeRemedyRequest {

    @NotBlank(message = "A remedy title is required")
    private String title;

    private String description;
    private String ingredients;
    private String instructions;
    private String dosha;
    private String skinType;
    private String category;
    private String icon;
    private String duration;
    private String difficulty;
    private String frequency;
    private String benefits;
    private String importantNote;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getIngredients() { return ingredients; }
    public void setIngredients(String ingredients) { this.ingredients = ingredients; }
    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }
    public String getDosha() { return dosha; }
    public void setDosha(String dosha) { this.dosha = dosha; }
    public String getSkinType() { return skinType; }
    public void setSkinType(String skinType) { this.skinType = skinType; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }
    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
    public String getBenefits() { return benefits; }
    public void setBenefits(String benefits) { this.benefits = benefits; }
    public String getImportantNote() { return importantNote; }
    public void setImportantNote(String importantNote) { this.importantNote = importantNote; }
}
