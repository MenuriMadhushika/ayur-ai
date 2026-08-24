package com.ayurai.ayuraibackend.dto;

import jakarta.validation.constraints.NotNull;

import java.util.List;

public class DoshaAssessmentRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Answers are required")
    private List<String> answers;

    public DoshaAssessmentRequest() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<String> getAnswers() {
        return answers;
    }

    public void setAnswers(List<String> answers) {
        this.answers = answers;
    }
}