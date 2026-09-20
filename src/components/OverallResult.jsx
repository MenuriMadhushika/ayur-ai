import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OverallResult.css";

import { createOverallResult } from "../utils/api";
import { getCurrentUserId } from "../utils/userSession";
import {
  formatAcneSeverity,
  isHigherAcneSeverity,
} from "../utils/acneSeverityInfo";
import { getAssessmentStatus } from "../utils/assessmentStatus";
import { getPrimaryDosha, isMixedDosha } from "../utils/doshaInfo";

import SkinTypeResult from "./SkinTypeResult";
import { sensitivityLabel } from "../utils/skinTypeInfo";

const OverallResult = () => {
  const navigate = useNavigate();
  const userId = getCurrentUserId();
  const hasLoaded = useRef(false);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const assessmentStatus = getAssessmentStatus();
  const missingSkinProfile = !assessmentStatus.skinScanCompleted;
  const missingDoshaTest = !assessmentStatus.doshaCompleted;
  const hasMissingStep = missingSkinProfile || missingDoshaTest;

  useEffect(() => {
    const loadResult = async () => {
      if (hasLoaded.current) return;

      if (!userId) {
        setError("Your user session could not be found. Please log in again.");
        setLoading(false);
        return;
      }

      hasLoaded.current = true;

      try {
        const data = await createOverallResult(userId);
        setResult(data);
      } catch (err) {
        let message = "Unable to load your assessment result.";

        try {
          const errorData = JSON.parse(err.message);
          message = errorData.message || message;
        } catch {
          message = err.message || message;
        }

        setError(message);
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [userId]);

  if (loading) {
    return (
      <main className="overall-page">
        <div className="overall-loading">
          <span>AYURAI</span>
          <p>Loading your results...</p>
        </div>
      </main>
    );
  }

  if (error || !result) {
    const nextStep = missingSkinProfile ? "/skin-scan" : "/dosha-test";

    return (
      <main className="overall-page">
        <section className="overall-error-card">
          <span>AYURAI · ASSESSMENT</span>
          <h1>
            {hasMissingStep
              ? "One gentle step remains"
              : "Unable to load your result"}
          </h1>
          <p>
            {hasMissingStep
              ? `Complete your ${missingSkinProfile ? "Skin Scan" : "Dosha Test"} to review both independent results in one place.`
              : error}
          </p>

          {hasMissingStep ? (
            <button type="button" onClick={() => navigate(nextStep)}>
              {missingSkinProfile
                ? "COMPLETE SKIN SCAN"
                : "COMPLETE DOSHA TEST"}
            </button>
          ) : (
            <button type="button" onClick={() => window.location.reload()}>
              TRY AGAIN
            </button>
          )}

          <button type="button" onClick={() => navigate("/")}>
            BACK TO HOME
          </button>
        </section>
      </main>
    );
  }

  const dominantDosha = result.dominantDosha || "Balance";
  const primaryDosha = getPrimaryDosha(dominantDosha) || "Balance";
  const theme = primaryDosha.toLowerCase();
  const blendedPattern = isMixedDosha(dominantDosha);
  const higherSeverity = isHigherAcneSeverity(result.estimatedSkinType);

  const scores = [
    {
      name: "Vata",
      value: Number(result.vataPercentage ?? 0),
      className: "vata",
    },
    {
      name: "Pitta",
      value: Number(result.pittaPercentage ?? 0),
      className: "pitta",
    },
    {
      name: "Kapha",
      value: Number(result.kaphaPercentage ?? 0),
      className: "kapha",
    },
  ];

  return (
    <main className={`overall-page theme-${theme}`}>
      <section className="overall-hero">
        <span className="overall-eyebrow">
          YOUR RESULTS
        </span>

        <div className="dosha-orb">
          {dominantDosha.charAt(0)}
        </div>

        <h1>
          Your {blendedPattern ? "wellness blend is" : "wellness pattern is"}{" "}
          <em>{dominantDosha}</em>
        </h1>

        <p className="overall-hero-text">
          Your AI Skin Scan and Ayurvedic questionnaire results are shown
          together for convenience. They are produced independently and are
          not medically correlated.
        </p>

        <div className="score-chips">
          {scores.map((score) => (
            <div
              className={`score-chip ${score.className}`}
              key={score.name}
            >
              <span>{score.name}</span>
              <strong>{score.value}%</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="result-card-grid">
        <article className="result-card skin-card">
          <div className="result-card-top">
            <span className="result-icon">✦</span>
            <span className="result-tag">SKIN SNAPSHOT</span>
          </div>

          <h2>Your skin scan</h2>
          <SkinTypeResult prediction={{ skinType: result.skinType, confidence: result.skinTypeConfidence, requiresReview: result.skinTypeRequiresReview }} />
          <p>Sensitivity: {sensitivityLabel(result.sensitivityScore)}</p>

          <div className="skin-detail">
            <span>Estimated acne-like severity</span>
            <strong>
              {formatAcneSeverity(result.estimatedSkinType)}
            </strong>
          </div>

          <div className="skin-detail">
            <span>Your care priority</span>
            <strong>
              {higherSeverity
                ? "Consider advice from a qualified healthcare professional."
                : "Keep care gentle, simple, and non-comedogenic."}
            </strong>
          </div>

          <p>{result.skinGuidance}</p>
        </article>

        <article className="result-card dosha-card">
          <div className="result-card-top">
            <span className="result-icon">◌</span>
            <span className="result-tag">DOSHA BALANCE</span>
          </div>

          <h2>Your Dosha pattern</h2>

          <div className="dosha-bars">
            {scores.map((score) => (
              <div className="dosha-bar-item" key={score.name}>
                <div className="dosha-bar-label">
                  <span>{score.name}</span>
                  <strong>{score.value}%</strong>
                </div>

                <div className="dosha-bar-track">
                  <div
                    className={`dosha-bar-fill ${score.className}`}
                    style={{ width: `${score.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p>
            {blendedPattern
              ? "Your answers show a close blend of these wellness patterns."
              : <>Your answers currently show a stronger <strong>{dominantDosha}</strong> wellness pattern.</>}
          </p>
        </article>

        <article className="result-card lifestyle-card">
          <div className="result-card-top">
            <span className="result-icon">☼</span>
            <span className="result-tag">DAILY BALANCE</span>
          </div>

          <h2>A gentle daily focus</h2>

          <p className="lifestyle-message">
            {result.lifestyleGuidance ||
              "Drink water regularly, keep a balanced routine, and take time for rest and gentle movement."}
          </p>

          <span className="small-note">
            Simple wellness guidance for your daily routine.
          </span>
        </article>
      </section>

      <section className="ayurvedic-direction">
        <div className="direction-heading">
          <span>YOUR AYURVEDIC DIRECTION</span>
          <small>✓ ASSESSMENT COMPLETE</small>
        </div>

        <h2>
          A gentle path for your{" "}
          <em>{dominantDosha}</em> nature
        </h2>

        <p>{result.ayurvedicGuidance}</p>

        <div className="direction-reminder">
          <strong>Remember</strong>
          <span>
            These results are educational wellness guidance,
            not a medical diagnosis.
          </span>
        </div>
      </section>

      <div className="overall-actions">
        <button
          type="button"
          className="overall-primary-action"
          onClick={() => navigate("/home-remedies")}
        >
          EXPLORE GENERAL WELLNESS IDEAS <span>→</span>
        </button>

        <button
          type="button"
          className="overall-secondary-action"
          onClick={() => navigate("/")}
        >
          BACK TO HOME
        </button>
      </div>
    </main>
  );
};

export default OverallResult;
