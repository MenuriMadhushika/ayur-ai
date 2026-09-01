import React from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

/* =========================================================
   AYURAI — HOME HERO
   Animated journey: Skin Profile → Balance → Personalized care
   ========================================================= */

const Hero = () => {
  const navigate = useNavigate();

  const openSkinProfile = () => navigate("/skin-scan");

  const handleCardKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openSkinProfile();
    }
  };

  return (
    <section className="hero">
      <div className="hero-bg-orb hero-bg-orb-one" />
      <div className="hero-bg-orb hero-bg-orb-two" />
      <div className="hero-grain" />

      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-line" />
            <span>AYURVEDIC SKINCARE &amp; WELLNESS</span>
            <span className="eyebrow-dot" />
          </div>

          <h1 className="hero-title">
            Your Skin.
            <br />
            <em>Your Balance.</em>
          </h1>

          <p className="hero-description">
            Start with a simple skin profile and Ayurvedic wellness
            questionnaire, then explore gentle care ideas suited to your
            unique journey.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="hero-primary-btn"
              onClick={openSkinProfile}
            >
              <span>Start Skin Profile</span>
              <span className="primary-arrow">→</span>
            </button>

          </div>

          <div className="hero-note">
            <span className="hero-note-icon">✦</span>
            <span>
              Skin type · Wellness pattern · Gentle care
            </span>
          </div>

          <div className="hero-meta">
            <div className="hero-meta-item">
              <strong>5</strong>
              <span>Skin Types</span>
            </div>

            <span className="hero-meta-divider" />

            <div className="hero-meta-item">
              <strong>3</strong>
              <span>Wellness Patterns</span>
            </div>

            <span className="hero-meta-divider" />

            <div className="hero-meta-item">
              <strong>01</strong>
              <span>Care Journey</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-glow" />
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="visual-orbit orbit-three" />

          <span className="visual-dot dot-one" />
          <span className="visual-dot dot-two" />
          <span className="visual-dot dot-three" />
          <span className="visual-dot dot-four" />

          <div
            className="ai-visual-card calm-journey-card"
            onClick={openSkinProfile}
            onKeyDown={handleCardKeyDown}
            role="button"
            tabIndex={0}
            aria-label="Open Skin Profile"
          >
            <div className="visual-card-header">
              <div className="visual-brand">
                <span className="status-dot" />
                <span>AYURAI</span>
              </div>

              <span className="visual-label">YOUR GENTLE PATH</span>
            </div>

            <div className="journey-visual-area">
              <div className="scan-visual calm-profile-visual">
                <div className="face-halo" />
                <div className="face-halo-inner" />

                <div className="face-shape">
                  <div className="face-eye face-eye-left" />
                  <div className="face-eye face-eye-right" />
                  <div className="face-nose" />
                  <div className="face-mouth" />
                </div>

                <span className="journey-visual-caption">
                  YOUR SKIN PROFILE
                </span>
              </div>
            </div>

            <div className="insight-panel journey-overview">
              <div className="insight-heading">
                <span>Your AyurAI Journey</span>
                <small>3 SIMPLE STEPS</small>
              </div>

              <div className="journey-overview-steps">
                <span className="journey-overview-step current"><b>01</b> Skin Profile</span>
                <span className="journey-overview-connector">→</span>
                <span className="journey-overview-step"><b>02</b> Dosha Test</span>
                <span className="journey-overview-connector">→</span>
                <span className="journey-overview-step"><b>03</b> Remedies</span>
              </div>
            </div>

            <div className="card-click-note">CLICK TO START SKIN PROFILE →</div>
          </div>

          <div className="floating-label floating-label-top">
            <span className="floating-icon">🌿</span>
            <div>
              <small>SKINCARE</small>
              <strong>Skin Profile</strong>
            </div>
          </div>

          <div className="floating-label floating-label-bottom">
            <span className="floating-icon">✦</span>
            <div>
              <small>AYURVEDA</small>
              <strong>Natural Balance</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
