import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

/* =========================================================
   AYURAI — HOME HERO
   Animated journey: Scan → Balance → Personalized care
   ========================================================= */

const JOURNEY_STEPS = [
  {
    number: "01",
    title: "Know your skin type",
    description: "Record the skin type that feels most true for you on most days.",
    visual: "scan",
    label: "SKIN PROFILE",
  },
  {
    number: "02",
    title: "Discover your balance",
    description: "Explore your Ayurvedic wellness pattern through a short questionnaire.",
    visual: "balance",
    label: "WELLNESS PATTERN",
  },
  {
    number: "03",
    title: "Personalize your care",
    description: "Find gentle routines suited to your skin journey.",
    visual: "care",
    label: "PERSONAL CARE",
  },
];

const Hero = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);

  const currentStep = JOURNEY_STEPS[activeStep];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((current) => (current + 1) % JOURNEY_STEPS.length);
    }, 3600);

    return () => clearInterval(timer);
  }, []);

  const openSkinScan = () => navigate("/skin-scan");

  const handleCardKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openSkinScan();
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
              onClick={openSkinScan}
            >
              <span>Start Skin Profile</span>
              <span className="primary-arrow">→</span>
            </button>

            <button
              type="button"
              className="hero-secondary-btn"
              onClick={() => navigate("/dosha-test")}
            >
              <span className="secondary-icon">✦</span>
              <span>Take Dosha Test</span>
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
            className="ai-visual-card clickable-scan-card"
            onClick={openSkinScan}
            onKeyDown={handleCardKeyDown}
            role="button"
            tabIndex={0}
            aria-label="Open Skin Scan"
          >
            <div className="visual-card-header">
              <div className="visual-brand">
                <span className="status-dot" />
                <span>AYURAI</span>
              </div>

              <span className="visual-label">{currentStep.label}</span>
            </div>

            <div className="journey-visual-area">
              {currentStep.visual === "scan" && (
                <div className="scan-visual">
                  <div className="face-halo" />
                  <div className="face-halo-inner" />

                  <div className="face-shape">
                    <div className="face-eye face-eye-left" />
                    <div className="face-eye face-eye-right" />
                    <div className="face-nose" />
                    <div className="face-mouth" />

                    <span className="face-point face-point-one" />
                    <span className="face-point face-point-two" />
                    <span className="face-point face-point-three" />
                    <span className="face-point face-point-four" />

                    <div className="face-grid" />
                    <div className="scan-beam" />
                  </div>

                  <span className="journey-visual-caption">
                    SKIN PROFILE CHECK-IN
                  </span>
                </div>
              )}

              {currentStep.visual === "balance" && (
                <div className="balance-visual">
                  <div className="balance-orbit balance-orbit-one" />
                  <div className="balance-orbit balance-orbit-two" />

                  <div className="balance-node balance-vata">
                    <span>Vata</span>
                    <strong>Movement</strong>
                  </div>

                  <div className="balance-node balance-pitta">
                    <span>Pitta</span>
                    <strong>Warmth</strong>
                  </div>

                  <div className="balance-node balance-kapha">
                    <span>Kapha</span>
                    <strong>Steadiness</strong>
                  </div>

                  <span className="journey-visual-caption">
                    YOUR SKIN BALANCE
                  </span>
                </div>
              )}

              {currentStep.visual === "care" && (
                <div className="care-visual">
                  <div className="care-glow" />
                  <span className="care-leaf">🌿</span>

                  <div className="care-routine-card">
                    <span>PERSONALIZED CARE</span>
                    <strong>Gentle routine</strong>
                    <p>Skin insight · Balance · Care</p>
                  </div>

                  <span className="care-sparkle sparkle-one">✦</span>
                  <span className="care-sparkle sparkle-two">✦</span>
                  <span className="care-sparkle sparkle-three">✦</span>

                  <span className="journey-visual-caption">
                    CARE MADE FOR YOU
                  </span>
                </div>
              )}
            </div>

            <div className="insight-panel">
              <div className="insight-heading">
                <span>Your AyurAI Journey</span>
                <small>
                  {String(activeStep + 1).padStart(2, "0")} / 03
                </small>
              </div>

              <div className="journey-progress">
                <div
                  className="journey-progress-fill"
                  style={{
                    width: `${((activeStep + 1) / JOURNEY_STEPS.length) * 100}%`,
                  }}
                />
              </div>

              <div className="journey-step">
                <div className="journey-number">{currentStep.number}</div>

                <div className="journey-content">
                  <strong>{currentStep.title}</strong>
                  <p>{currentStep.description}</p>
                </div>
              </div>
            </div>

            <div className="card-click-note">CLICK TO START SKIN SCAN →</div>
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
