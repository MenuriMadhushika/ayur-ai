import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  const navigate = useNavigate();

  // Active AyurAI process stage
  const [activeStage, setActiveStage] = useState(0);

  // Automatically move through:
  // Skin → AI Scan → Dosha Balance → Personalized Care
  useEffect(() => {
    const stageTimer = setInterval(() => {
      setActiveStage((current) => (current + 1) % 4);
    }, 3000);

    return () => clearInterval(stageTimer);
  }, []);

  return (
    <section className="hero">
      <div className="hero-container">

        {/* =====================================
            LEFT SIDE — HERO CONTENT
        ===================================== */}
        <div className="hero-content">

          <span className="hero-eyebrow">
            AI-POWERED AYURVEDIC SKINCARE
          </span>

          <h1>
            Your Skin.
            <br />
            <span>Your Balance.</span>
          </h1>

          <p>
            Discover your skin's unique needs through AI-powered analysis
            and Ayurvedic wisdom. Get personalized recommendations designed
            for your natural balance.
          </p>

          {/* HERO BUTTONS */}
          <div className="hero-actions">

            <button
              type="button"
              className="hero-primary-btn"
              onClick={() => navigate("/skin-scan")}
            >
              Start Skin Analysis
              <span>→</span>
            </button>

            <button
              type="button"
              className="hero-secondary-btn"
              onClick={() => navigate("/dosha-test")}
            >
              Discover Your Dosha
            </button>

          </div>
        </div>


        {/* =====================================
            RIGHT SIDE — AYURVEDIC ENERGY FLOW
        ===================================== */}
        <div className="hero-visual">

          {/* Background glow */}
          <div className="energy-glow"></div>

          {/* Energy orbit paths */}
          <div className="energy-orbit energy-orbit-one"></div>
          <div className="energy-orbit energy-orbit-two"></div>
          <div className="energy-orbit energy-orbit-three"></div>

          {/* Floating energy particles */}
          <span className="energy-particle particle-one"></span>
          <span className="energy-particle particle-two"></span>
          <span className="energy-particle particle-three"></span>
          <span className="energy-particle particle-four"></span>


          {/* =====================================
              CLICKABLE CENTRAL AI CARD
          ===================================== */}
          <button
            type="button"
            className="hero-ai-card hero-ai-card-clickable"
            onClick={() => navigate("/skin-scan")}
            aria-label="Start AI Skin Scan"
          >

            {/* Card header */}
            <div className="ai-card-top">

              <span className="ai-status-dot"></span>

              <span>
                AYURAI ANALYSIS
              </span>

            </div>


            {/* Skin visualization */}
            <div className="skin-visual">

              <div className="scan-face">

                {/* Face outline */}
                <div className="face-outline"></div>

                {/* Eyes */}
                <div className="face-eye left-eye"></div>
                <div className="face-eye right-eye"></div>

                {/* Nose */}
                <div className="face-nose"></div>

                {/* Mouth */}
                <div className="face-mouth"></div>

                {/* AI scanning line */}
                <div className="ai-scan-line"></div>

                {/* AI scan points */}
                <span className="scan-point point-one"></span>
                <span className="scan-point point-two"></span>
                <span className="scan-point point-three"></span>

              </div>


              {/* Scan label */}
              <div className="scan-label">

                <span></span>

                AI SKIN SCAN

              </div>

            </div>


            {/* =====================================
                AI ANALYSIS INFORMATION
            ===================================== */}
            <div className="ai-analysis">

              {/* Analysis title */}
              <div className="analysis-title">

                <span>
                  Skin Analysis
                </span>

                <strong>
                  AI
                </strong>

              </div>


              {/* Progress bar */}
              <div className="analysis-bar">
                <div></div>
              </div>


              {/* Dynamic analysis message */}
              <div className="analysis-status">

                <span>

                  {activeStage === 0 &&
                    "Understanding your skin"}

                  {activeStage === 1 &&
                    "Scanning skin characteristics"}

                  {activeStage === 2 &&
                    "Balancing your dosha"}

                  {activeStage === 3 &&
                    "Preparing personalized care"}

                </span>

                <span>●</span>

              </div>

            </div>


            

          </button>


          {/* =====================================
              STAGE 01 — SKIN
          ===================================== */}
          <button
            type="button"
            className={`energy-node node-skin ${
              activeStage === 0 ? "active-stage" : ""
            }`}
            onClick={() => navigate("/skin-scan")}
          >

            <span className="node-icon">
              ✦
            </span>

            <span className="node-text">

              <small>
                01
              </small>

              Skin

            </span>

          </button>


          {/* =====================================
              STAGE 02 — AI SCAN
          ===================================== */}
          <button
            type="button"
            className={`energy-node node-ai ${
              activeStage === 1 ? "active-stage" : ""
            }`}
            onClick={() => navigate("/skin-scan")}
          >

            <span className="node-icon">
              ⌁
            </span>

            <span className="node-text">

              <small>
                02
              </small>

              AI Scan

            </span>

          </button>


          {/* =====================================
              STAGE 03 — DOSHA BALANCE
          ===================================== */}
          <button
            type="button"
            className={`energy-node node-dosha ${
              activeStage === 2 ? "active-stage" : ""
            }`}
            onClick={() => navigate("/dosha-test")}
          >

            <span className="node-icon">
              ◌
            </span>

            <span className="node-text">

              <small>
                03
              </small>

              Dosha Balance

            </span>

          </button>


          {/* =====================================
              STAGE 04 — PERSONALIZED CARE
              → HOME REMEDIES
          ===================================== */}
          <button
            type="button"
            className={`energy-node node-care ${
              activeStage === 3 ? "active-stage" : ""
            }`}
            onClick={() => navigate("/home-remedies")}
          >

            <span className="node-icon">
              ❋
            </span>

            <span className="node-text">

              <small>
                04
              </small>

              Personalized Care

            </span>

          </button>


          {/* =====================================
              CENTRAL ENERGY POINT
          ===================================== */}
          <div className="central-energy">

            <div className="central-energy-inner"></div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;