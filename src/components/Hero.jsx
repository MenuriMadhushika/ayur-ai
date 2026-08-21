import React from "react";
import "./Hero.css";

const Hero = () => {

  // ==============================
  // GO TO DOSHA SECTION
  // ==============================

  const handleDosha = () => {
    const doshaSection =
      document.querySelector(".intro-section");

    if (doshaSection) {
      doshaSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };


  // ==============================
  // GO TO SKIN ANALYSIS
  // ==============================

  const handleSkinAnalysis = () => {
    const skinScanSection =
      document.getElementById("skin-scan");

    if (skinScanSection) {
      skinScanSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };


  return (
    <section className="hero">

      {/* =================================
          HERO CONTENT
      ================================= */}

      <div className="hero-content">

        <span className="hero-label">
          AI • AYURVEDA • BEAUTY
        </span>


        <h1>
          Your Skin.
          <br />
          <span>Your Balance.</span>
        </h1>


        <p>
          Discover intelligent skincare inspired by
          the ancient wisdom of Ayurveda. Understand
          your skin, discover your Dosha, and explore
          personalized Ayurvedic care.
        </p>


        {/* =================================
            BUTTONS
        ================================= */}

        <div className="hero-buttons">

          <button
            type="button"
            className="hero-primary-button"
            onClick={handleDosha}
          >
            <span>
              Discover Your Dosha
            </span>

            <span className="button-arrow">
              →
            </span>
          </button>


          <button
            type="button"
            className="hero-secondary-button"
            onClick={handleSkinAnalysis}
          >
            <span>
              Analyse My Skin
            </span>

            <span className="button-spark">
              ✦
            </span>
          </button>

        </div>


        {/* =================================
            TRUST / FEATURE LINE
        ================================= */}

        <div className="hero-features">

          <span>
            <b>✓</b>
            Ayurvedic Guidance
          </span>

          <span>
            <b>✓</b>
            AI Skin Analysis
          </span>

          <span>
            <b>✓</b>
            Personalized Care
          </span>

        </div>

      </div>


      {/* =================================
          AYURVISION AI CARD
      ================================= */}

      <div
        className="ayurvision-card"
        onClick={handleSkinAnalysis}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (
            event.key === "Enter" ||
            event.key === " "
          ) {
            handleSkinAnalysis();
          }
        }}
      >

        {/* =================================
            BACKGROUND GLOW
        ================================= */}

        <div className="ai-glow"></div>


        {/* =================================
            DECORATIVE RINGS
        ================================= */}

        <div className="scan-ring ring-one"></div>

        <div className="scan-ring ring-two"></div>

        <div className="scan-ring ring-three"></div>


        {/* =================================
            AI FACE
        ================================= */}

        <div className="ai-face">

          <div className="face-outline">

            <div className="face-eye left-eye"></div>

            <div className="face-eye right-eye"></div>

            <div className="face-nose"></div>

            <div className="face-mouth"></div>

          </div>

        </div>


        {/* =================================
            DETECTION POINTS
        ================================= */}

        <span className="hero-point hero-point-one"></span>

        <span className="hero-point hero-point-two"></span>

        <span className="hero-point hero-point-three"></span>

        <span className="hero-point hero-point-four"></span>


        {/* =================================
            SCAN LINE
        ================================= */}

        <div className="hero-scan-line"></div>


        {/* =================================
            AI CARD CONTENT
        ================================= */}

        <div className="ayurvision-content">

          <div className="ai-status">

            <span className="ai-status-dot"></span>

            AI READY

          </div>


          <span className="ayurvision-label">
            AYURVISION AI
          </span>


          <h3>
            AI Skin Analysis
          </h3>


          <p>
            Discover what your skin
            is telling you.
          </p>


          <div className="ayurvision-action">

           

          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;