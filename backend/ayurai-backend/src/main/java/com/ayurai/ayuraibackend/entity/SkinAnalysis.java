package com.ayurai.ayuraibackend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "skin_analyses")
public class SkinAnalysis {

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
    // SKIN INFORMATION
    // =========================================================

    private String skinType;

    @Column(length = 1000)
    private String concerns;

    @Column(length = 3000)
    private String analysis;

    // =========================================================
    // CREATED DATE
    // =========================================================

    private LocalDateTime createdAt;

    public SkinAnalysis() {
    }

    // =========================================================
    // AUTO CREATE DATE
    // =========================================================

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // =========================================================
    // ID
    // =========================================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // =========================================================
    // USER
    // =========================================================

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // =========================================================
    // SKIN TYPE
    // =========================================================

    public String getSkinType() {
        return skinType;
    }

    public void setSkinType(String skinType) {
        this.skinType = skinType;
    }

    // =========================================================
    // CONCERNS
    // =========================================================

    public String getConcerns() {
        return concerns;
    }

    public void setConcerns(String concerns) {
        this.concerns = concerns;
    }

    // =========================================================
    // ANALYSIS
    // =========================================================

    public String getAnalysis() {
        return analysis;
    }

    public void setAnalysis(String analysis) {
        this.analysis = analysis;
    }

    // =========================================================
    // CREATED AT
    // =========================================================

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}