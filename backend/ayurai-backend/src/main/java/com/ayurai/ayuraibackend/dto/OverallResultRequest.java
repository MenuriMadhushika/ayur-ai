
package com.ayurai.ayuraibackend.dto;

import jakarta.validation.constraints.NotNull;

public class OverallResultRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    public OverallResultRequest() {
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}