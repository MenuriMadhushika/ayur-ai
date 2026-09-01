package com.ayurai.ayuraibackend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public class DoshaAssessmentRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Answers are required")
    @Size(min = 8, max = 8, message = "Please answer all 8 Dosha questions")
    private List<@NotBlank(message = "Each Dosha answer is required") String> answers;

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
