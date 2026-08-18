import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

const Hero = () => {
  return (
    <section className="hero">

      <div className="hero-content">

        <div className="hero-label">
          AI × AYURVEDA × SKINCARE
        </div>

        <h1>
          Discover
          <br />
          Your <span>Skin Balance</span>
        </h1>

        <p className="hero-description">
          Intelligent Ayurvedic skincare personalized
          to your unique skin needs.
        </p>

        <div className="hero-buttons">

          <Link
            to="/dosha-test"
            className="hero-primary-button"
          >
            Take Dosha Test
            <span>→</span>
          </Link>

          <a
            href="#skin-scan"
            className="hero-secondary-button"
          >
            Try AI Skin Scan
          </a>

        </div>

        <div className="hero-stats">

          <div>
            <strong>03</strong>
            <span>Doshas</span>
          </div>

          <div>
            <strong>AI</strong>
            <span>Skin Analysis</span>
          </div>

          <div>
            <strong>∞</strong>
            <span>Personalized Care</span>
          </div>

        </div>

      </div>

      <div className="hero-visual">

        <div className="hero-circle"></div>

        <div className="hero-glow"></div>

        <div className="hero-card">

          <span>AYURVISION</span>

          <div className="face-placeholder">
            <div className="face-line"></div>
            <div className="face-eye left"></div>
            <div className="face-eye right"></div>
            <div className="face-mouth"></div>
          </div>

          <div className="scan-line"></div>

          <p>
            AI SKIN ANALYSIS
          </p>

        </div>

        <div className="floating-dosha vata">
          🌬️
          <span>VATA</span>
        </div>

        <div className="floating-dosha pitta">
          🔥
          <span>PITTA</span>
        </div>

        <div className="floating-dosha kapha">
          🌿
          <span>KAPHA</span>
        </div>

      </div>

    </section>
  );
};

export default Hero;