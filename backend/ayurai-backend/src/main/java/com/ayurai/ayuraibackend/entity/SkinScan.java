package com.ayurai.ayuraibackend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "skin_scans")
public class SkinScan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String imagePath;

    private String estimatedSkinType;

    @Column(columnDefinition = "TEXT")
    private String visibleCharacteristics;

    private String analysisStatus;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public SkinScan() {
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
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

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getEstimatedSkinType() {
        return estimatedSkinType;
    }

    public void setEstimatedSkinType(String estimatedSkinType) {
        this.estimatedSkinType = estimatedSkinType;
    }

    public String getVisibleCharacteristics() {
        return visibleCharacteristics;
    }

    public void setVisibleCharacteristics(String visibleCharacteristics) {
        this.visibleCharacteristics = visibleCharacteristics;
    }

    public String getAnalysisStatus() {
        return analysisStatus;
    }

    public void setAnalysisStatus(String analysisStatus) {
        this.analysisStatus = analysisStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}