
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OverallResult.css";

import API_BASE_URL from "../utils/api";

import {
  getCurrentUserId,
} from "../utils/assessmentStatus";


const OverallResult = () => {
  const navigate = useNavigate();

  /*
   * Temporary user ID.
   * Replace this with the authenticated user's ID
   * when JWT authentication is implemented.
   */
  const userId = getCurrentUserId();

  const [skinScan, setSkinScan] = useState(null);
  const [dosha, setDosha] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD RESULTS FROM BACKEND
  ========================================================= */

  useEffect(() => {
    const loadResults = async () => {
      setLoading(true);
      setError("");

      if (!userId) {
  setError(
    "Your user session could not be found. Please log in again."
  );
  setLoading(false);
  return;
}

      try {
        /*
         * Get latest Dosha assessment
         */
        const doshaResponse = await fetch(
          `${API_BASE_URL}/dosha-assessments/user/${userId}/latest`
        );

        if (!doshaResponse.ok) {
          if (doshaResponse.status === 401) {
            throw new Error(
              "You are not authorized to view your Dosha assessment."
            );
          }

          if (doshaResponse.status === 404) {
            navigate("/dosha-test", { replace: true });
            return;
          }

          throw new Error(
            "Unable to load your Dosha assessment."
          );
        }

        const doshaData = await doshaResponse.json();

        /*
         * Get latest Skin Scan
         */
        const skinResponse = await fetch(
          `${API_BASE_URL}/skin-scans/user/${userId}/latest`
        );

        if (!skinResponse.ok) {
          if (skinResponse.status === 401) {
            throw new Error(
              "You are not authorized to view your Skin Scan."
            );
          }

          if (skinResponse.status === 404) {
            navigate("/skin-scan", { replace: true });
            return;
          }

          throw new Error(
            "Unable to load your Skin Scan."
          );
        }

        const skinData = await skinResponse.json();

        console.log(
          "Dosha result from backend:",
          doshaData
        );

        console.log(
          "Skin Scan result from backend:",
          skinData
        );

        /*
         * Save backend results into React state.
         */
        setDosha(doshaData);
        setSkinScan(skinData);

      } catch (err) {
        console.error(
          "Overall result loading error:",
          err
        );

        setError(
          err.message ||
          "Unable to load your assessment results."
        );

      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [navigate, userId]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="overall-result-page">

        <div className="overall-result-loading">

          <span>
            AYURAI
          </span>

          <p>
            Loading your Ayurvedic assessment...
          </p>

        </div>

      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <main className="overall-result-page">

        <section className="overall-result-error">

          <span className="overall-label">
            AYURAI · ASSESSMENT
          </span>

          <h1>
            Unable to load your results
          </h1>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="overall-primary-button"
            onClick={() => window.location.reload()}
          >
            TRY AGAIN
          </button>

          <button
            type="button"
            className="overall-secondary-button"
            onClick={() => navigate("/")}
          >
            BACK TO HOME
          </button>

        </section>

      </main>
    );
  }

  /* =========================================================
     SAFETY CHECK
  ========================================================= */

  if (!skinScan || !dosha) {
    return (
      <main className="overall-result-page">

        <div className="overall-result-loading">

          <p>
            No complete assessment results were found.
          </p>

        </div>

      </main>
    );
  }

  /* =========================================================
     DOSHA DATA
  ========================================================= */

  const dominantDosha =
    dosha.dominantDosha || "Not available";

  const percentages = {
    Vata: dosha.vataPercentage ?? 0,
    Pitta: dosha.pittaPercentage ?? 0,
    Kapha: dosha.kaphaPercentage ?? 0,
  };

  /* =========================================================
     SKIN DATA
  ========================================================= */

  const estimatedSkinType =
    skinScan.estimatedSkinType ||
    "AI-estimated";

  const visibleCharacteristics =
    skinScan.visibleCharacteristics ||
    "AI-observed visible characteristics";

  const analysisStatus =
    skinScan.analysisStatus ||
    "COMPLETED";

  /* =========================================================
     RENDER
  ========================================================= */

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

        {/* ===================================================
            DOSHA CARD
        =================================================== */}

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


          {/* DOSHA PERCENTAGES */}

          <div className="dosha-percentages">

            {/* VATA */}

            <div className="dosha-percentage-item">

              <div>

                <span>
                  Vata
                </span>

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


            {/* PITTA */}

            <div className="dosha-percentage-item">

              <div>

                <span>
                  Pitta
                </span>

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


            {/* KAPHA */}

            <div className="dosha-percentage-item">

              <div>

                <span>
                  Kapha
                </span>

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


        {/* ===================================================
            SKIN SCAN CARD
        =================================================== */}

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

            {/* ESTIMATED SKIN TYPE */}

            <div className="observation-item">

              <span>
                Estimated skin type
              </span>

              <strong>
                {estimatedSkinType}
              </strong>

            </div>


            {/* VISIBLE CHARACTERISTICS */}

            <div className="observation-item">

              <span>
                Visible characteristics
              </span>

              <strong>
                {visibleCharacteristics}
              </strong>

            </div>


            {/* ANALYSIS STATUS */}

            <div className="observation-item">

              <span>
                Analysis status
              </span>

              <strong>
                {analysisStatus}
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

          {/* POINT 01 */}

          <div>

            <span>
              01
            </span>

            <div>

              <strong>
                Skin observations
              </strong>

              <small>
                AI-estimated visible characteristics
              </small>

            </div>

          </div>


          {/* POINT 02 */}

          <div>

            <span>
              02
            </span>

            <div>

              <strong>
                Dosha pattern
              </strong>

              <small>
                Based on your assessment responses
              </small>

            </div>

          </div>


          {/* POINT 03 */}

          <div>

            <span>
              03
            </span>

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


        {/* ===================================================
            IMPORTANT NOTICE
        =================================================== */}

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
          <span>
            →
          </span>
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
