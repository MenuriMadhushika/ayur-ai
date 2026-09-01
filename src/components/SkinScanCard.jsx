import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SkinScanCard.css";

import {
  saveSkinScanResult,
  getAssessmentStatus,
} from "../utils/assessmentStatus";
import { createSkinScan } from "../utils/api";
import { getCurrentUserId } from "../utils/userSession";
import { SKIN_TYPES } from "../utils/skinTypeInfo";

const SkinScanCard = () => {
  const navigate = useNavigate();
  const [selectedSkinType, setSelectedSkinType] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [doshaCompleted, setDoshaCompleted] = useState(false);
  const [error, setError] = useState("");

  const checkAssessmentStatus = () => {
    const status = getAssessmentStatus();
    setDoshaCompleted(Boolean(status.doshaCompleted || status.doshaTestCompleted));
  };

  useEffect(() => {
    checkAssessmentStatus();
    window.addEventListener("ayurai-assessment-updated", checkAssessmentStatus);

    return () => {
      window.removeEventListener("ayurai-assessment-updated", checkAssessmentStatus);
    };
  }, []);

  const handleSave = async () => {
    if (!selectedSkinType || isSaving) {
      setError("Choose the option that feels most true for your skin on most days.");
      return;
    }

    try {
      setError("");
      setIsSaving(true);

      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("User session not found.");
      }

      const backendResult = await createSkinScan({
        userId,
        imagePath: null,
        estimatedSkinType: selectedSkinType,
        visibleCharacteristics: `Skin Profile check-in based on the user's selected ${selectedSkinType} skin type.`,
        analysisStatus: "COMPLETED",
      });

      saveSkinScanResult({
        completed: true,
        completedAt: new Date().toISOString(),
        skinType: backendResult.estimatedSkinType,
        hydration: "Not available",
        concern: "Not available",
        texture: backendResult.visibleCharacteristics,
      });

      checkAssessmentStatus();
      setIsComplete(true);
    } catch (saveError) {
      console.error("Skin Profile save error:", saveError);
      setError("We could not save your Skin Profile. Please check that the backend is running and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNextAssessment = () => {
    const status = getAssessmentStatus();
    navigate(status.skinScanCompleted && doshaCompleted ? "/overall-result" : "/dosha-test");
  };

  const nextButtonText = doshaCompleted
    ? "VIEW OVERALL RESULT"
    : "CONTINUE TO DOSHA TEST";

  if (isComplete) {
    return (
      <section className="skin-scan-section">
        <section className="skin-scan-complete">
          <span className="section-label">SKIN PROFILE COMPLETE</span>
          <h2>Your skin profile is complete.</h2>
          <p className="complete-intro">
            Your usual skin type has been saved. Complete the Dosha Test so
            AyurAI can prepare your combined result and matched home remedies.
          </p>

          <div className="assessment-status-grid">
            <div className="assessment-status completed">
              <div className="assessment-status-icon">✓</div>
              <div className="assessment-status-content">
                <span>01</span>
                <strong>Skin Profile</strong>
                <small>Completed</small>
              </div>
            </div>

            <div className="assessment-connector"><span /></div>

            <div className={`assessment-status ${doshaCompleted ? "completed" : "pending"}`}>
              <div className="assessment-status-icon">{doshaCompleted ? "✓" : "02"}</div>
              <div className="assessment-status-content">
                <span>02</span>
                <strong>Dosha Test</strong>
                <small>{doshaCompleted ? "Completed" : "Still required"}</small>
              </div>
            </div>
          </div>

          <div className={`complete-message ${doshaCompleted ? "overall-ready" : ""}`}>
            <span>✦</span>
            <p>
              <strong>{doshaCompleted ? "Both assessments are complete." : "One more step is required."}</strong>{" "}
              {doshaCompleted
                ? "Your personalized Overall Result is ready to view."
                : "Complete your Dosha Test next to receive your combined result."}
            </p>
          </div>

          <div className="complete-action">
            <button type="button" className="continue-dosha-button" onClick={handleNextAssessment}>
              {nextButtonText} →
            </button>
            <button
              type="button"
              className="another-photo-button"
              onClick={() => {
                setIsComplete(false);
                setSelectedSkinType("");
              }}
            >
              Update skin type
            </button>
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className="skin-scan-section">
      <header className="scan-heading">
        <span className="section-label">01 · SKIN PROFILE</span>
        <h2>How does your skin usually feel?</h2>
        <p>
          Choose the answer that feels most true on most days. There is no
          photo, scan, or perfect answer required.
        </p>
      </header>

      <section className="scan-container skin-profile-choice-card">
        <div className="scan-info profile-choice-copy">
          <span className="scan-number">A SIMPLE CHECK-IN</span>
          <h3>Choose what feels familiar.</h3>
          <p>
            Think about your skin before makeup or skincare products. You can
            update this choice later if your skin changes.
          </p>

          <div className="scan-features">
            <span>✓ Takes less than a minute</span>
            <span>✓ Your answer is combined with your Dosha Test</span>
            <span>✓ Used only for gentle, educational recommendations</span>
          </div>

          <div className="scan-note">
            <span>✦</span>
            <p>
              Skin type and Ayurvedic wellness patterns are different. This is
              educational skincare guidance, not a medical diagnosis.
            </p>
          </div>
        </div>

        <div className="skin-type-picker">
          <div className="skin-type-picker-heading">
            <span>YOUR USUAL SKIN TYPE</span>
            <p>Select one option.</p>
          </div>

          <div className="skin-type-choice-grid" role="group" aria-label="Usual skin type">
            {SKIN_TYPES.map((skinType) => (
              <button
                key={skinType.value}
                type="button"
                className={selectedSkinType === skinType.value ? "selected" : ""}
                onClick={() => {
                  setSelectedSkinType(skinType.value);
                  setError("");
                }}
                aria-pressed={selectedSkinType === skinType.value}
              >
                <strong>{skinType.label}</strong>
                <span>{skinType.description}</span>
              </button>
            ))}
          </div>

          {error && <p className="skin-profile-error">{error}</p>}

          <button
            type="button"
            className="save-skin-profile-button"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving
              ? "SAVING YOUR PROFILE..."
              : selectedSkinType
                ? `CONTINUE WITH ${selectedSkinType.toUpperCase()} SKIN →`
                : "CHOOSE YOUR SKIN TYPE TO CONTINUE"}
          </button>
        </div>
      </section>
    </section>
  );
};

export default SkinScanCard;
