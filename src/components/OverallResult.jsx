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
    const status = getAssessmentStatus();

    if (!status.bothCompleted) {
      if (!status.skinScanCompleted) {
        navigate("/skin-scan", { replace: true });
        return;
      }

      if (!status.doshaCompleted) {
        navigate("/dosha-test", { replace: true });
        return;
      }
    }

    setSkinScan(getSkinScanResult());
    setDosha(getDoshaResult());
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

  return (
    <main className="overall-result-page">

      <section className="overall-result-header">

        <span className="overall-label">
          AYURAI · OVERALL ASSESSMENT
        </span>

        <h1>
          Your Ayurvedic Skin Profile
        </h1>

        <p>
          Your Skin Scan and Dosha Test have been combined into
          one educational Ayurvedic assessment.
        </p>

        <small>
          AI-estimated and educational only — not a medical diagnosis.
        </small>

      </section>


      <section className="overall-result-grid">

        {/* DOSHA */}

        <article className="overall-card">

          <span className="card-label">
            AYURVEDIC DOSHA
          </span>

          <h2>
            {dosha.dominantDosha}
          </h2>

          <p>
            Your responses suggest {dosha.dominantDosha} as the
            dominant Dosha pattern in this assessment.
          </p>

          <div className="dosha-percentages">

            <div>
              <span>Vata</span>
              <strong>{dosha.percentages?.Vata || 0}%</strong>
            </div>

            <div>
              <span>Pitta</span>
              <strong>{dosha.percentages?.Pitta || 0}%</strong>
            </div>

            <div>
              <span>Kapha</span>
              <strong>{dosha.percentages?.Kapha || 0}%</strong>
            </div>

          </div>

        </article>


        {/* SKIN */}

        <article className="overall-card">

          <span className="card-label">
            AI SKIN SCAN
          </span>

          <h2>
            Visible Characteristics
          </h2>

          <p>
            The Skin Scan provides AI-estimated observations
            from the uploaded image.
          </p>

          <div className="skin-observations">

            <div>
              <span>Skin observation</span>
              <strong>
                {skinScan.skinType || "AI Estimated"}
              </strong>
            </div>

            <div>
              <span>Hydration estimate</span>
              <strong>
                {skinScan.hydration
                  ? `${skinScan.hydration}%`
                  : "Not available"}
              </strong>
            </div>

            <div>
              <span>Texture</span>
              <strong>
                {skinScan.texture || "Visible characteristics"}
              </strong>
            </div>

          </div>

        </article>

      </section>


      {/* COMBINED RESULT */}

      <section className="combined-result-card">

        <span className="card-label">
          YOUR AYURVEDIC DIRECTION
        </span>

        <h2>
          {dosha.dominantDosha}-informed skincare guidance
        </h2>

        <p>
          AyurAI combines your AI-estimated visible skin
          characteristics with your Ayurvedic Dosha assessment
          to provide personalized educational guidance.
        </p>

        <div className="result-notice">
          These results are estimates based on your responses
          and uploaded image. They should not be treated as a
          medical diagnosis.
        </div>

      </section>


      {/* ACTIONS */}

      <div className="overall-result-actions">

        <button
          type="button"
          onClick={() => navigate("/home-remedies")}
        >
          EXPLORE HOME REMEDIES →
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
        >
          BACK TO HOME
        </button>

      </div>

    </main>
  );
};

export default OverallResult;