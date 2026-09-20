import React from "react";
import "./SkinTypeResult.css";
import {
  skinTypeLabel,
  confidenceLabel,
} from "../utils/skinTypeInfo";

export default function SkinTypeResult({ prediction }) {
  const label = skinTypeLabel(
    prediction?.skinType,
    prediction?.requiresReview
  );

  return (
    <div className="skin-type-result">

      {/* =====================================================
          PRIMARY SKIN TYPE RESULT
      ===================================================== */}

      <div className="future-result-grid skin-type-result-grid">

        {/* Highlighted Primary Result */}
        <div className="skin-type-primary-card">
          <small>ESTIMATED SKIN TYPE</small>

          <strong className="skin-type-primary-value">
            {label}
          </strong>
        </div>

        {/* Secondary Confidence Result */}
        <div className="skin-type-confidence-card">
          <small>AI CONFIDENCE</small>

          <strong>
            {confidenceLabel(prediction?.confidence)}
          </strong>
        </div>

      </div>

      {/* =====================================================
          CONFIDENCE EXPLANATION
      ===================================================== */}

      {label !== "Uncertain" &&
        label !== "Not available" && (
          <div className="skin-type-confidence-help">

            <strong>AI Confidence</strong>

            <p>
              shows how confident the AI is in this
              skin-type estimate.
            </p>

          </div>
        )}

      {/* =====================================================
          UNCERTAIN RESULT
      ===================================================== */}

      {label === "Uncertain" && (
        <div className="skin-type-result-message">
          <strong>Result uncertain</strong>

          <p>
            We could not confidently estimate your skin
            type. Try a clearer photo in natural light.
          </p>
        </div>
      )}

      {/* =====================================================
          RESULT NOT AVAILABLE
      ===================================================== */}

      {label === "Not available" && (
        <div className="skin-type-result-message">
          <strong>Skin-type analysis unavailable</strong>

          <p>
            Skin-type analysis is not available for this
            scan.
          </p>
        </div>
      )}

    </div>
  );
}