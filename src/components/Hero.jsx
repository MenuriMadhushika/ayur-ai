import React from "react";
import "./Hero.css";

const Hero = () => {

  // Go to AI Skin Analysis section
  const handleSkinAnalysis = () => {
    const skinScanSection = document.getElementById("skin-scan");

    if (skinScanSection) {
      skinScanSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="hero">

      {/* =========================
          LEFT SIDE
      ========================= */}

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
          your skin, discover your Dosha, and receive
          personalized care.
        </p>

        <div className="hero-buttons">

          {/* DOSHA BUTTON */}

          <button
            className="hero-primary-button"
            onClick={() => {
              const doshaSection =
                document.querySelector(".intro-section");

              if (doshaSection) {
                doshaSection.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }
            }}
          >
            Discover Your Dosha
            <span>→</span>
          </button>


          {/* SKIN ANALYSIS BUTTON */}

          <button
            className="hero-secondary-button"
            onClick={handleSkinAnalysis}
          >
            Analyse My Skin
            <span>✦</span>
          </button>

        </div>

      </div>


      {/* =========================
          AYURVISION AI CARD
      ========================= */}

      <div
        className="ayurvision-card"
        onClick={handleSkinAnalysis}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            handleSkinAnalysis();
          }
        }}
      >

        {/* AI GLOW */}

        <div className="ai-glow"></div>


        {/* SCAN RINGS */}

        <div className="scan-ring ring-one"></div>
        <div className="scan-ring ring-two"></div>
        <div className="scan-ring ring-three"></div>


        {/* FACE / AI VISUAL */}

        <div className="ai-face">

          <div className="face-outline">

            <div className="face-eye left-eye"></div>
            <div className="face-eye right-eye"></div>

            <div className="face-nose"></div>

            <div className="face-mouth"></div>

          </div>

        </div>


        {/* DETECTION POINTS */}

        <span className="hero-point hero-point-one"></span>
        <span className="hero-point hero-point-two"></span>
        <span className="hero-point hero-point-three"></span>
        <span className="hero-point hero-point-four"></span>


        {/* MOVING SCAN LINE */}

        <div className="hero-scan-line"></div>


        {/* CARD CONTENT */}

        <div className="ayurvision-content">

          <span className="ayurvision-label">
            AYURVISION AI
          </span>

          <h3>
            AI Skin Analysis
          </h3>

          <p>
            Discover what your skin is telling you.
          </p>

          <div className="ayurvision-action">
            Analyse Your Skin
            <span>→</span>
          </div>

        </div>

      </div>

    </section>
  );
};

export default Hero;