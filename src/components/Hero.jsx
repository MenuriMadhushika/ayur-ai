import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();
  const openSkinScan = () => {
  navigate("/skin-scan");
};

const handleCardKeyDown = (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openSkinScan();
  }
};
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      number: "01",
      title: "Understand",
      description: "Explore your skin's visible characteristics",
    },
    {
      number: "02",
      title: "Discover",
      description: "Explore your Ayurvedic balance",
    },
    {
      number: "03",
      title: "Personalize",
      description: "Find care approaches suited to you",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((current) => (current + 1) % steps.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <section className="hero">

      {/* =====================================================
          BACKGROUND DECORATION
      ===================================================== */}

      <div className="hero-bg-orb hero-bg-orb-one"></div>
      <div className="hero-bg-orb hero-bg-orb-two"></div>

      <div className="hero-grain"></div>


      <div className="hero-container">

        {/* =====================================================
            LEFT — CONTENT
        ===================================================== */}

        <div className="hero-content">

          <div className="hero-eyebrow">
            <span className="eyebrow-line"></span>

            <span>AI-POWERED AYURVEDIC WELLNESS</span>

            <span className="eyebrow-dot"></span>
          </div>


          <h1 className="hero-title">
            Your Skin.
            <br />
            <em>Your Balance.</em>
          </h1>


          <p className="hero-description">
            Discover visible characteristics of your skin through
            AI-assisted analysis and explore personalized Ayurvedic
            approaches for your natural care and balance.
          </p>


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="hero-actions">

            <button
              type="button"
              className="hero-primary-btn"
              onClick={() => navigate("/skin-scan")}
            >
              <span>Start Skin Scan</span>

              <span className="primary-arrow">
                →
              </span>
            </button>


            <button
              type="button"
              className="hero-secondary-btn"
              onClick={() => navigate("/dosha-test")}
            >
              <span className="secondary-icon">⌘</span>

              <span>Discover Your Dosha</span>
            </button>

          </div>


          {/* =================================================
              TRUST NOTE
          ================================================= */}

          <div className="hero-note">

            <span className="hero-note-icon">
              ⌘
            </span>

            <span>
              AI-estimated insights · Inspired by Ayurvedic principles
            </span>

          </div>


          {/* =================================================
              MINI STATS
          ================================================= */}

          <div className="hero-meta">

            <div className="hero-meta-item">
              <strong>AI</strong>
              <span>Skin Insights</span>
            </div>

            <span className="hero-meta-divider"></span>

            <div className="hero-meta-item">
              <strong>3</strong>
              <span>Dosha Types</span>
            </div>

            <span className="hero-meta-divider"></span>

            <div className="hero-meta-item">
              <strong>01</strong>
              <span>Personal Journey</span>
            </div>

          </div>

        </div>


        {/* =====================================================
            RIGHT — AI VISUAL
        ===================================================== */}

        <div className="hero-visual">

          {/* Ambient glow */}

          <div className="visual-glow"></div>

          {/* Large orbital system */}

          <div className="visual-orbit orbit-one"></div>
          <div className="visual-orbit orbit-two"></div>
          <div className="visual-orbit orbit-three"></div>


          {/* Orbit dots */}

          <span className="visual-dot dot-one"></span>
          <span className="visual-dot dot-two"></span>
          <span className="visual-dot dot-three"></span>
          <span className="visual-dot dot-four"></span>


          {/* =================================================
              MAIN AI CARD
          ================================================= */}

          <div
  className="ai-visual-card clickable-scan-card"
  onClick={openSkinScan}
  onKeyDown={handleCardKeyDown}
  role="button"
  tabIndex={0}
  aria-label="Open AI Skin Scan"
>
            

            {/* Header */}

            <div className="visual-card-header">

              <div className="visual-brand">

                <span className="status-dot"></span>

                <span>AYURAI</span>

              </div>

              <span className="visual-label">
                AI INSIGHT
              </span>

            </div>


            {/* =================================================
                FACE / SKIN VISUALIZATION
            ================================================= */}

            <div className="face-area">

              <div className="face-halo"></div>

              <div className="face-halo-inner"></div>


              <div className="face-shape">

                <div className="face-eye face-eye-left"></div>

                <div className="face-eye face-eye-right"></div>

                <div className="face-nose"></div>

                <div className="face-mouth"></div>


                <span className="face-point face-point-one"></span>

                <span className="face-point face-point-two"></span>

                <span className="face-point face-point-three"></span>

                <span className="face-point face-point-four"></span>


                <div className="face-grid"></div>

                <div className="scan-beam"></div>

              </div>


              {/* Scanning status */}

              <div className="scan-status">

                <span className="scan-status-line"></span>

                <span>
                  ANALYZING
                </span>

              </div>


              <div className="face-caption">

                <span></span>

                AI-ESTIMATED VISIBLE CHARACTERISTICS

              </div>

            </div>


            {/* =================================================
                JOURNEY PANEL
            ================================================= */}

            <div className="insight-panel">

              <div className="insight-heading">

                <span>
                  Your AyurAI Journey
                </span>

                <small>
                  {String(activeStep + 1).padStart(2, "0")} / 03
                </small>

              </div>


              <div className="journey-progress">

                <div
                  className="journey-progress-fill"
                  style={{
                    width:
                      `${((activeStep + 1) / steps.length) * 100}%`,
                  }}
                ></div>

              </div>


              <div className="journey-step">

                <div className="journey-number">
                  {steps[activeStep].number}
                </div>


                <div className="journey-content">

                  <strong>
                    {steps[activeStep].title}
                  </strong>

                  <p>
                    {steps[activeStep].description}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              FLOATING INFORMATION CARDS
          ================================================= */}

          <div className="floating-label floating-label-top">

            <span className="floating-icon">
              🌿
            </span>

            <div>
              <small>AI</small>
              <strong>Skin Insight</strong>
            </div>

          </div>


          <div className="floating-label floating-label-bottom">

            <span className="floating-icon">
              🌸
            </span>

            <div>
              <small>AYURVEDA</small>
              <strong>Natural Balance</strong>
            </div>

          </div>


          {/* Decorative central rings */}

          <div className="visual-ring ring-one"></div>
          <div className="visual-ring ring-two"></div>

        </div>
        

      </div>


      {/* =====================================================
          BOTTOM SCROLL INDICATOR
      ===================================================== */}

      <div className="hero-scroll">

        <span className="scroll-line"></span>

        <span>
          EXPLORE
        </span>

      </div>

    </section>
  );
};

export default Hero;