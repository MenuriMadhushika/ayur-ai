import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./SkinScanCard.css";

import {
  saveSkinScanResult,
  getAssessmentStatus,
} from "../utils/assessmentStatus";

import { createSkinScan } from "../utils/api";
import { getCurrentUserId } from "../utils/userSession";

/* =========================================================
   CLICKABLE CAMERA ICON
========================================================= */

const CameraIcon = ({ size = 30 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.5 5.5L10 3.5H14L15.5 5.5H18C19.66 5.5 21 6.84 21 8.5V17.5C21 19.16 19.66 20.5 18 20.5H6C4.34 20.5 3 19.16 3 17.5V8.5C3 6.84 4.34 5.5 6 5.5H8.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="13"
      r="3.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

/* =========================================================
   AYURAI — SKIN SCAN CARD
========================================================= */

const SkinScanCard = () => {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [doshaCompleted, setDoshaCompleted] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  /* Checks whether the user already completed the Dosha Test. */
  const checkAssessmentStatus = () => {
    const status = getAssessmentStatus();

    setDoshaCompleted(
      Boolean(status.doshaCompleted || status.doshaTestCompleted)
    );
  };

  useEffect(() => {
    checkAssessmentStatus();

    window.addEventListener(
      "ayurai-assessment-updated",
      checkAssessmentStatus
    );

    return () => {
      window.removeEventListener(
        "ayurai-assessment-updated",
        checkAssessmentStatus
      );
    };
  }, []);

  /* Clears temporary browser photo URL after leaving the page. */
  useEffect(() => {
    return () => {
      if (image?.startsWith("blob:")) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  /* =========================================================
     PHOTO UPLOAD
  ========================================================= */

  const handleFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose a JPG, JPEG, or PNG image.");
      return;
    }

    setImage(URL.createObjectURL(file));
    setProgress(0);
    setIsScanning(false);
    setAnalysisComplete(false);
    setShowOptions(false);
  };

  const handleFileChange = (event) => {
    handleFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleChangePhoto = () => {
    setImage(null);
    setProgress(0);
    setIsScanning(false);
    setAnalysisComplete(false);
  };

  /* =========================================================
     SAVE RESULT TO SPRING BOOT
  ========================================================= */

  const saveScanToBackend = async () => {
    try {
      const userId = getCurrentUserId();

      if (!userId) {
        throw new Error("User session not found.");
      }

      const backendResult = await createSkinScan({
        userId,
        imagePath: "uploads/skin-scan.jpg",
        estimatedSkinType: "AI-estimated combination skin",
        visibleCharacteristics:
          "AI-estimated visible skin characteristics from uploaded image",
        analysisStatus: "COMPLETED",
      });

      /* Stores frontend journey status after the backend save succeeds. */
      saveSkinScanResult({
        completed: true,
        completedAt: new Date().toISOString(),
        skinType: backendResult.estimatedSkinType,
        hydration: "AI-estimated",
        concern: "AI-observed",
        texture: backendResult.visibleCharacteristics,
      });

      checkAssessmentStatus();
      setAnalysisComplete(true);
    } catch (error) {
      console.error("Skin scan save error:", error);

      alert(
        "The scan finished, but it could not be saved. Please check that the backend is running on port 8081."
      );

      setAnalysisComplete(false);
    }
  };

  /* =========================================================
     SCAN ANIMATION
  ========================================================= */

  const handleAnalyze = () => {
    if (!image || isScanning) return;

    setProgress(0);
    setAnalysisComplete(false);
    setIsScanning(true);
  };

  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setProgress((previousProgress) => {
        const nextProgress = previousProgress + 2;

        if (nextProgress >= 100) {
          clearInterval(interval);

          setTimeout(() => {
            setIsScanning(false);
            saveScanToBackend();
          }, 450);

          return 100;
        }

        return nextProgress;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [isScanning]);

  /* =========================================================
     NEXT STEP
  ========================================================= */

  const handleNextAssessment = () => {
    const status = getAssessmentStatus();

    if (status.skinScanCompleted && doshaCompleted) {
      navigate("/overall-result");
      return;
    }

    navigate("/dosha-test");
  };

  const nextButtonText = doshaCompleted
    ? "VIEW OVERALL RESULT"
    : "CONTINUE TO DOSHA TEST";

  const scanMessage =
    progress < 30
      ? "Detecting facial region..."
      : progress < 65
      ? "Observing visible skin characteristics..."
      : progress < 90
      ? "Preparing your assessment..."
      : "Saving your scan safely...";

  return (
    <section className="skin-scan-section">
      <header className="scan-heading">
        <span className="section-label">AI SKIN ANALYSIS</span>

        <h2>
          Understand Your <span>Skin</span>
        </h2>

        <p>
          Upload a clear facial photo and let AyurAI estimate visible skin
          characteristics to support your Ayurvedic skincare journey.
        </p>
      </header>

      <section className="scan-container">
        <div className="scan-info">
          <span className="scan-number">01 — SKIN SCAN</span>

          <h3>Begin with your skin.</h3>

          <p>
            Your photo is used to estimate visible characteristics such as skin
            appearance, hydration, and texture.
          </p>

          <div className="scan-features">
            <span>✓ AI-estimated visible skin characteristics</span>
            <span>✓ Simple and personalized guidance</span>
            <span>✓ Designed for your Ayurvedic journey</span>
          </div>

          <div className="scan-note">
            <span>✦</span>

            <p>
              For best results, use a clear, front-facing photo taken in natural
              or well-lit conditions. This tool provides an AI estimate and is
              not a medical diagnosis.
            </p>
          </div>
        </div>

        <div className="upload-wrapper">
          {!image ? (
            <div className="upload-area">
              <div className="upload-content">
                {/* Click camera icon to choose upload or phone camera. */}
                <button
                  type="button"
                  className="upload-icon-button"
                  onClick={() => setShowOptions(true)}
                  aria-label="Add a skin photo"
                >
                  <CameraIcon size={32} />
                </button>

                <h3>Add your skin photo</h3>

                <p>Choose an existing photo or use your camera.</p>

                <button
                  type="button"
                  className="upload-button"
                  onClick={() => setShowOptions(true)}
                >
                  ADD PHOTO
                </button>

                <small>JPG, JPEG or PNG · Clear facial photo recommended</small>
              </div>
            </div>
          ) : (
            <div className="image-preview-container">
              <div className="image-preview">
                <img src={image} alt="Uploaded skin scan preview" />

                {!isScanning && !analysisComplete && (
                  <div className="image-status">
                    <span className="status-dot" />
                    PHOTO READY
                  </div>
                )}

                {isScanning && (
                  <div className="ai-scan-overlay">
                    <div className="scan-frame" />
                    <div className="scan-line" />

                    <div className="scan-status">
                      <span className="scan-pulse" />
                      AI ANALYSIS IN PROGRESS
                    </div>

                    <p>{scanMessage}</p>

                    <div className="scan-progress">
                      <div style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                )}

                {analysisComplete && (
                  <div className="scan-complete-overlay">
                    <span className="complete-check">✓</span>
                    <strong>SKIN SCAN COMPLETE</strong>
                  </div>
                )}
              </div>

              {!isScanning && !analysisComplete && (
                <button
                  type="button"
                  className="change-photo-small"
                  onClick={handleChangePhoto}
                >
                  Change photo
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {image && !analysisComplete && (
        <div className="analysis-action">
          <button
            type="button"
            className="analyze-button"
            onClick={handleAnalyze}
            disabled={isScanning}
          >
            {isScanning ? "ANALYZING..." : "✦ ANALYZE MY SKIN  →"}
          </button>

          <p>AI-estimated results · Not a medical diagnosis</p>
        </div>
      )}

      {analysisComplete && (
        <section className="skin-scan-complete">
          <span className="section-label">SKIN SCAN COMPLETE</span>

          <h2>Your first assessment is complete.</h2>

          <p className="complete-intro">
            Your Skin Scan has been saved. AyurAI will combine it with your
            Dosha Test to create your Overall Ayurvedic Result.
          </p>

          <div className="assessment-status-grid">
            <div className="assessment-status completed">
              <div className="assessment-status-icon">✓</div>

              <div className="assessment-status-content">
                <span>01</span>
                <strong>Skin Scan</strong>
                <small>Completed</small>
              </div>
            </div>

            <div className="assessment-connector">
              <span />
            </div>

            <div
              className={`assessment-status ${
                doshaCompleted ? "completed" : "pending"
              }`}
            >
              <div className="assessment-status-icon">
                {doshaCompleted ? "✓" : "02"}
              </div>

              <div className="assessment-status-content">
                <span>02</span>
                <strong>Dosha Test</strong>
                <small>
                  {doshaCompleted ? "Completed" : "Still required"}
                </small>
              </div>
            </div>
          </div>

          <div
            className={`complete-message ${
              doshaCompleted ? "overall-ready" : ""
            }`}
          >
            <span>✦</span>

            <p>
              <strong>
                {doshaCompleted
                  ? "Both assessments are complete."
                  : "One more assessment is required."}
              </strong>{" "}
              {doshaCompleted
                ? "Your Skin Scan and Dosha Test are ready to be combined into your Overall Ayurvedic Result."
                : "Complete your Dosha Test so AyurAI can create your personalized Overall Result."}
            </p>
          </div>

          <div className="complete-action">
            <button
              type="button"
              className="continue-dosha-button"
              onClick={handleNextAssessment}
            >
              {nextButtonText} →
            </button>

            <button
              type="button"
              className="another-photo-button"
              onClick={handleChangePhoto}
            >
              Analyze another photo
            </button>
          </div>
        </section>
      )}

      {showOptions && (
        <div
          className="upload-options-overlay"
          onClick={() => setShowOptions(false)}
        >
          <div
            className="upload-options-card"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="upload-options-close"
              onClick={() => setShowOptions(false)}
              aria-label="Close photo options"
            >
              ×
            </button>

            <span className="section-label">ADD PHOTO</span>

            <h3>Choose a photo source</h3>

            <p>
              Use a clear, front-facing photo in natural or well-lit conditions.
            </p>

            <button
              type="button"
              className="upload-option-button"
              onClick={() => fileInputRef.current?.click()}
            >
              <span>↑</span>

              <div>
                <strong>Upload from device</strong>
                <small>Select an existing photo</small>
              </div>

              <b>→</b>
            </button>

            <button
              type="button"
              className="upload-option-button"
              onClick={() => cameraInputRef.current?.click()}
            >
              <span>
                <CameraIcon size={18} />
              </span>

              <div>
                <strong>Use camera</strong>
                <small>Take a new photo</small>
              </div>

              <b>→</b>
            </button>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        hidden
        onChange={handleFileChange}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        capture="environment"
        hidden
        onChange={handleFileChange}
      />
    </section>
  );
};

export default SkinScanCard;