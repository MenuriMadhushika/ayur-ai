import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OverallResult.css";

import {
  getAssessmentStatus,
  getSkinScanResult,
  getDoshaResult,
} from "../utils/assessmentStatus";

const OverallResult = () => {
  const navigate = useNavigate();

  const [skinScan, setSkinScan] = useState(null);
  const [dosha, setDosha] = useState(null);

  useEffect(() => {
    const loadResults = () => {
      const status = getAssessmentStatus();

      if (!status.skinScanCompleted) {
        navigate("/skin-scan", { replace: true });
        return;
      }

      if (!status.doshaCompleted) {
        navigate("/dosha-test", { replace: true });
        return;
      }

      setSkinScan(getSkinScanResult());
      setDosha(getDoshaResult());
    };

    loadResults();

    window.addEventListener(
      "ayurai-assessment-updated",
      loadResults
    );

    return () => {
      window.removeEventListener(
        "ayurai-assessment-updated",
        loadResults
      );
    };
  }, [navigate]);

  if (!skinScan || !dosha) {
    return (
      <main className="overall-result-page">
        <div className="overall-result-loading">
          Loading your Ayurvedic assessment...
        </div>
      </main>
    );
  }

  const dominantDosha =
    dosha.dominantDosha || "Not available";

  const percentages = dosha.percentages || {
    Vata: 0,
    Pitta: 0,
    Kapha: 0,
  };

  return (
    <main className="overall-result-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="overall-result-header">

        <span className="overall-label">
          AYURAI · OVERALL ASSESSMENT
        </span>

        <h1>
          Your Ayurvedic
          <span> Skin Profile</span>
        </h1>

        <p>
          Your Skin Scan and Dosha Test have been
          combined into one educational Ayurvedic
          assessment.
        </p>

        <small>
          AI-estimated and educational only —
          not a medical diagnosis.
        </small>

      </section>


      {/* =====================================================
          ASSESSMENT SUMMARY
      ===================================================== */}

      <section className="overall-result-grid">

        {/* DOSHA */}

        <article className="overall-card dosha-overall-card">

          <span className="card-label">
            01 · AYURVEDIC DOSHA
          </span>

          <div className="overall-card-heading">

            <div>
              <h2>
                {dominantDosha}
              </h2>

              <p>
                Your responses suggest{" "}
                <strong>
                  {dominantDosha}
                </strong>{" "}
                as the dominant Dosha pattern
                in this assessment.
              </p>
            </div>

            <div className="dominant-badge">
              DOMINANT
            </div>

          </div>


          <div className="dosha-percentages">

            <div className="dosha-percentage-item">

              <div>
                <span>Vata</span>

                <strong>
                  {percentages.Vata}%
                </strong>
              </div>

              <div className="mini-progress">
                <div
                  style={{
                    width: `${percentages.Vata}%`,
                  }}
                />
              </div>

            </div>


            <div className="dosha-percentage-item">

              <div>
                <span>Pitta</span>

                <strong>
                  {percentages.Pitta}%
                </strong>
              </div>

              <div className="mini-progress">
                <div
                  style={{
                    width: `${percentages.Pitta}%`,
                  }}
                />
              </div>

            </div>


            <div className="dosha-percentage-item">

              <div>
                <span>Kapha</span>

                <strong>
                  {percentages.Kapha}%
                </strong>
              </div>

              <div className="mini-progress">
                <div
                  style={{
                    width: `${percentages.Kapha}%`,
                  }}
                />
              </div>

            </div>

          </div>

        </article>


        {/* SKIN */}

        <article className="overall-card skin-overall-card">

          <span className="card-label">
            02 · AI SKIN SCAN
          </span>

          <h2>
            Visible Characteristics
          </h2>

          <p>
            Your Skin Scan provides
            AI-estimated observations from
            the uploaded image.
          </p>


          <div className="skin-observations">

            <div className="observation-item">

              <span>
                Skin observation
              </span>

              <strong>
                {skinScan.skinType ||
                  "AI-estimated"}
              </strong>

            </div>


            <div className="observation-item">

              <span>
                Hydration estimate
              </span>

              <strong>
                {skinScan.hydration &&
                !String(
                  skinScan.hydration
                ).includes("AI")
                  ? `${skinScan.hydration}%`
                  : "AI-estimated"}
              </strong>

            </div>


            <div className="observation-item">

              <span>
                Texture observation
              </span>

              <strong>
                {skinScan.texture ||
                  "AI-observed"}
              </strong>

            </div>


            <div className="observation-item">

              <span>
                Visible concern
              </span>

              <strong>
                {skinScan.concern ||
                  "AI-observed"}
              </strong>

            </div>

          </div>

        </article>

      </section>


      {/* =====================================================
          COMBINED RESULT
      ===================================================== */}

      <section className="combined-result-card">

        <div className="combined-result-top">

          <span className="card-label">
            YOUR AYURVEDIC DIRECTION
          </span>

          <span className="combined-status">
            ✓ ASSESSMENT COMPLETE
          </span>

        </div>


        <h2>
          {dominantDosha}-informed
          <span> skincare guidance</span>
        </h2>

        <p>
          AyurAI combines your AI-estimated
          visible skin characteristics with your
          Ayurvedic Dosha assessment to provide
          personalized educational guidance.
        </p>


        <div className="combined-points">

          <div>
            <span>01</span>

            <div>
              <strong>
                Skin observations
              </strong>

              <small>
                AI-estimated visible characteristics
              </small>
            </div>
          </div>


          <div>
            <span>02</span>

            <div>
              <strong>
                Dosha pattern
              </strong>

              <small>
                Based on your assessment responses
              </small>
            </div>
          </div>


          <div>
            <span>03</span>

            <div>
              <strong>
                Ayurvedic direction
              </strong>

              <small>
                Educational skincare guidance
              </small>
            </div>
          </div>

        </div>


        <div className="result-notice">

          <strong>
            Important
          </strong>

          <p>
            These results are AI-estimated and
            based on your responses and uploaded
            image. They are intended for educational
            and wellness purposes only and should
            not be treated as a medical diagnosis.
          </p>

        </div>

      </section>


      {/* =====================================================
          ACTIONS
      ===================================================== */}

      <div className="overall-result-actions">

        <button
          type="button"
          className="overall-primary-button"
          onClick={() =>
            navigate("/home-remedies")
          }
        >
          EXPLORE HOME REMEDIES
          <span>→</span>
        </button>


        <button
          type="button"
          className="overall-secondary-button"
          onClick={() =>
            navigate("/")
          }
        >
          BACK TO HOME
        </button>

      </div>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <p className="overall-result-disclaimer">
        AyurAI provides AI-estimated visual
        observations and educational Ayurvedic
        guidance. It does not diagnose, treat,
        or prevent medical conditions.
      </p>

    </main>
  );
};

export default OverallResult;