import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SkinScanCard.css";

import {
  generateRecommendation
} from "../utils/recommendationEngine";

const SkinScanCard = () => {

  // =====================================================
  // NAVIGATION
  // =====================================================

  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [showUploadOptions, setShowUploadOptions] =
    useState(false);

  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");

  const [analysisStep, setAnalysisStep] = useState(0);

  const [dosha, setDosha] = useState(null);

  // =====================================================
  // REFS
  // =====================================================

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // =====================================================
  // ANALYSIS STEPS
  // =====================================================

  const analysisSteps = [
    "Preparing your image...",
    "Checking image quality...",
    "Analyzing visible skin patterns...",
    "Assessing skin characteristics...",
    "Preparing your skin profile..."
  ];

  // =====================================================
  // GET SAVED DOSHA
  // =====================================================

  useEffect(() => {

    const savedDoshaResult =
      localStorage.getItem("ayuraiDoshaResult");

    if (!savedDoshaResult) {
      setDosha(null);
      return;
    }

    try {

      const parsedDosha =
        JSON.parse(savedDoshaResult);

      if (parsedDosha?.dominant) {

        setDosha(
          parsedDosha.dominant
        );

      }

    } catch (error) {

      console.error(
        "Unable to read Dosha result:",
        error
      );

      setDosha(null);

    }

  }, []);

  // =====================================================
  // IMAGE PROCESSING
  // =====================================================

  const processImage = (file) => {

    setError("");

    if (!file) {
      return;
    }

    // -----------------------------------------------
    // FILE TYPE
    // -----------------------------------------------

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {

      setError(
        "Please upload a JPG, PNG, or WEBP image."
      );

      return;
    }

    // -----------------------------------------------
    // FILE SIZE
    // -----------------------------------------------

    if (file.size > 10 * 1024 * 1024) {

      setError(
        "Please upload an image smaller than 10MB."
      );

      return;
    }

    // -----------------------------------------------
    // CREATE PREVIEW
    // -----------------------------------------------

    const imageUrl =
      URL.createObjectURL(file);

    setImage(imageUrl);

    setImageFile(file);

    setAnalysis(null);

    setAnalyzing(false);

    setAnalysisStep(0);

    setShowUploadOptions(false);

  };

  // =====================================================
  // NORMAL FILE UPLOAD
  // =====================================================

  const handleImageUpload = (event) => {

    const file =
      event.target.files?.[0];

    if (file) {
      processImage(file);
    }

    event.target.value = "";

  };

  // =====================================================
  // CAMERA CAPTURE
  // =====================================================

  const handleCameraCapture = (event) => {

    const file =
      event.target.files?.[0];

    if (file) {
      processImage(file);
    }

    event.target.value = "";

  };

  // =====================================================
  // OPEN FILE SELECTOR
  // =====================================================

  const openFileSelector = () => {

    setShowUploadOptions(false);

    fileInputRef.current?.click();

  };

  // =====================================================
  // OPEN CAMERA
  // =====================================================

  const openCamera = () => {

    setShowUploadOptions(false);

    cameraInputRef.current?.click();

  };

  // =====================================================
  // DRAG OVER
  // =====================================================

  const handleDragOver = (event) => {

    event.preventDefault();

    setDragActive(true);

  };

  // =====================================================
  // DRAG LEAVE
  // =====================================================

  const handleDragLeave = (event) => {

    event.preventDefault();

    setDragActive(false);

  };

  // =====================================================
  // DROP
  // =====================================================

  const handleDrop = (event) => {

    event.preventDefault();

    setDragActive(false);

    const file =
      event.dataTransfer.files?.[0];

    if (file) {
      processImage(file);
    }

  };

 // =====================================================
// ANALYZE IMAGE
// =====================================================

const handleAnalyze = () => {

  if (!imageFile || analyzing) {
    return;
  }

  setError("");
  setAnalysis(null);
  setAnalyzing(true);
  setAnalysisStep(0);

  // ===================================================
  // GET DOSHA RESULT
  // ===================================================

  const savedDoshaResult =
    localStorage.getItem("ayuraiDoshaResult");

  let savedDosha = null;

  if (savedDoshaResult) {

    try {

      const parsedDosha =
        JSON.parse(savedDoshaResult);

      savedDosha =
        parsedDosha.dominant || null;

      setDosha(savedDosha);

    } catch (error) {

      console.error(
        "Unable to read Dosha result:",
        error
      );

      setDosha(null);

    }

  }


  // ===================================================
  // ANALYSIS ANIMATION
  // ===================================================

  let currentStep = 0;

  const stepInterval =
    setInterval(() => {

      currentStep++;

      if (
        currentStep <
        analysisSteps.length
      ) {

        setAnalysisStep(currentStep);

      }

    }, 700);


  // ===================================================
  // DEMO SKIN ANALYSIS
  // ===================================================

  setTimeout(() => {

    clearInterval(stepInterval);


    // =================================================
    // SKIN TYPE
    // =================================================
    //
    // IMPORTANT:
    // Only use the 3 skin types you decided:
    //
    // dry
    // sensitive
    // oily
    //
    // NO COMBINATION
    // =================================================

    const skinType = "Dry";


    // =================================================
    // VISIBLE CONCERNS
    // =================================================

    const concerns = [
      "Possible mild dryness",
      "Blemish-prone appearance"
    ];


    // =================================================
    // RECOMMENDATION ENGINE
    // =================================================

    const recommendation =
      generateRecommendation({
        dosha: savedDosha,
        skinType,
        concerns
      });


    // =================================================
    // CREATE SKIN RESULT
    // =================================================

    const skinResult = {

      skinType,

      hydration: {
        level:
          "Moderate hydration appearance",

        percentage: 68
      },

      concerns,

      confidence: 86,

      recommendation:
        recommendation.summary,

      careTips:
        recommendation.tips,

      completedAt:
        new Date().toISOString()

    };


    // =================================================
    // SAVE SKIN RESULT
    // =================================================

    localStorage.setItem(
      "ayuraiSkinAnalysis",
      JSON.stringify(skinResult)
    );


    // =================================================
    // UPDATE UI
    // =================================================

    setAnalysis(skinResult);

    setAnalyzing(false);

    setAnalysisStep(
      analysisSteps.length - 1
    );

  }, 4000);

};
  // =====================================================
  // RESET
  // =====================================================

  const handleChangePhoto = () => {

    if (image) {
      URL.revokeObjectURL(image);
    }

    setImage(null);

    setImageFile(null);

    setAnalysis(null);

    setAnalyzing(false);

    setAnalysisStep(0);

    setError("");

  };

  // =====================================================
  // CAMERA ICON
  // =====================================================

  const CameraIcon = () => (

    <svg
      className="upload-camera-icon"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >

      <path
        d="M8.5 6.5L9.7 4.5H14.3L15.5 6.5H19C20.1 6.5 21 7.4 21 8.5V17.5C21 18.6 20.1 19.5 19 19.5H5C3.9 19.5 3 18.6 3 17.5V8.5C3 7.4 3.9 6.5 5 6.5H8.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx="12"
        cy="13"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />

      <circle
        cx="17.5"
        cy="9.5"
        r="0.7"
        fill="currentColor"
      />

    </svg>

  );

  // =====================================================
  // RENDER
  // =====================================================

  return (

    <section
      className="skin-scan-section"
      id="skin-scan"
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="scan-heading">

        <span className="section-label">
          AYURVISION AI ENGINE
        </span>

        <h2>
          See What Your Skin
          <br />
          <span>Is Telling You</span>
        </h2>

        <p>
          Upload a clear photo and let AyurAI
          analyse visible skin characteristics
          and create your skincare profile.
        </p>

      </div>


      {/* =================================================
          MAIN SCAN AREA
      ================================================= */}

      <div className="scan-container">

        {/* =================================================
            LEFT INFORMATION
        ================================================= */}

        <div className="scan-info">

          <div className="scan-number">
            01
          </div>

          <h3>
            AI Skin Analysis
          </h3>

          <p>
            Upload a clear photo of your face
            to begin your AyurAI skin analysis.
          </p>


          <div className="scan-features">

            <span>
              <b>✓</b>
              Skin characteristics
            </span>

            <span>
              <b>✓</b>
              Hydration patterns
            </span>

            <span>
              <b>✓</b>
              Visible concerns
            </span>

            <span>
              <b>✓</b>
              Personalized care
            </span>

          </div>


          <div className="scan-note">

            <span className="scan-note-icon">
              ⌘
            </span>

            <p>
              For best results, upload a clear,
              well-lit face photo without heavy
              makeup or filters.
            </p>

          </div>

        </div>


        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="upload-wrapper">

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="upload-error">

              <span>!</span>

              {error}

            </div>

          )}


          {/* =================================================
              UPLOAD AREA
          ================================================= */}

          {!image && (

            <div
              className={`upload-area ${
                dragActive
                  ? "drag-active"
                  : ""
              }`}

              onDragOver={handleDragOver}

              onDragLeave={handleDragLeave}

              onDrop={handleDrop}
            >

              <div className="upload-content">

                <button
                  type="button"
                  className="upload-icon-button"
                  onClick={() =>
                    setShowUploadOptions(true)
                  }
                  aria-label="Upload or take a photo"
                  title="Upload or take a photo"
                >

                  <CameraIcon />

                </button>


                <h3>
                  Upload Your Skin Photo
                </h3>

                <p>
                  Drag & drop your photo here
                </p>


                <div className="or-divider">
                  <span>OR</span>
                </div>


                <button
                  type="button"
                  className="upload-button"
                  onClick={openFileSelector}
                >
                  Choose Image
                </button>


                <small>
                  JPG, PNG or WEBP
                  <br />
                  Maximum 10MB
                </small>


                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  hidden
                />


                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleCameraCapture}
                  hidden
                />

              </div>

            </div>

          )}


          {/* =================================================
              UPLOAD OPTIONS MODAL
          ================================================= */}

          {showUploadOptions && !image && (

            <div
              className="upload-options-overlay"
              onClick={() =>
                setShowUploadOptions(false)
              }
            >

              <div
                className="upload-options-card"
                onClick={(event) =>
                  event.stopPropagation()
                }
              >

                <button
                  type="button"
                  className="upload-options-close"
                  onClick={() =>
                    setShowUploadOptions(false)
                  }
                  aria-label="Close"
                >
                  ×
                </button>


                <div className="upload-options-symbol">
                  <CameraIcon />
                </div>


                <span className="upload-options-label">
                  AYURVISION
                </span>


                <h3>
                  Add Your Skin Photo
                </h3>


                <p>
                  Choose how you would like
                  to provide your photo.
                </p>


                <div className="upload-options-buttons">

                  {/* CAMERA */}

                  <button
                    type="button"
                    className="upload-option-button"
                    onClick={openCamera}
                  >

                    <span className="option-icon">
                      <CameraIcon />
                    </span>

                    <span className="option-text">

                      <strong>
                        Take a Photo
                      </strong>

                      <small>
                        Use your camera
                      </small>

                    </span>

                    <span className="option-arrow">
                      →
                    </span>

                  </button>


                  {/* FILE */}

                  <button
                    type="button"
                    className="upload-option-button"
                    onClick={openFileSelector}
                  >

                    <span className="option-icon">

                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >

                        <path
                          d="M4 5.5C4 4.67 4.67 4 5.5 4H14L20 10V18.5C20 19.33 19.33 20 18.5 20H5.5C4.67 20 4 19.33 4 18.5V5.5Z"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        <path
                          d="M14 4V10H20"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        <circle
                          cx="9"
                          cy="14"
                          r="1.5"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        />

                        <path
                          d="M6.5 18L11 14L14 16.5L16 15L19.5 18"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                      </svg>

                    </span>

                    <span className="option-text">

                      <strong>
                        Upload from Device
                      </strong>

                      <small>
                        Choose an existing image
                      </small>

                    </span>

                    <span className="option-arrow">
                      →
                    </span>

                  </button>

                </div>


                <button
                  type="button"
                  className="upload-options-cancel"
                  onClick={() =>
                    setShowUploadOptions(false)
                  }
                >
                  Cancel
                </button>

              </div>

            </div>

          )}


          {/* =================================================
              IMAGE PREVIEW
          ================================================= */}

          {image && (

            <div className="image-preview-container">

              <div
                className={`image-preview ${
                  analyzing
                    ? "is-scanning"
                    : ""
                }`}
              >

                <img
                  src={image}
                  alt="Uploaded skin"
                />


                {/* =================================================
                    AI SCANNING
                ================================================= */}

                {analyzing && (

                  <div className="ai-scan-overlay">

                    <div className="scan-glow"></div>

                    <div className="face-scan-frame"></div>

                    <div className="scan-corner top-left"></div>

                    <div className="scan-corner top-right"></div>

                    <div className="scan-corner bottom-left"></div>

                    <div className="scan-corner bottom-right"></div>

                    <div className="face-point point-one"></div>

                    <div className="face-point point-two"></div>

                    <div className="face-point point-three"></div>

                    <div className="face-point point-four"></div>

                    <div className="face-point point-five"></div>

                    <div className="photo-scan-line"></div>


                    <div className="scan-status">

                      <span className="scan-pulse"></span>

                      AYURVISION AI SCANNING

                    </div>


                    <div className="scan-detection">

                      <span>
                        ◈
                      </span>

                      {analysisSteps[analysisStep]}

                    </div>


                    <div className="scan-progress">

                      <div
                        className="scan-progress-bar"
                        style={{
                          width:
                            `${
                              (
                                (analysisStep + 1) /
                                analysisSteps.length
                              ) * 100
                            }%`
                        }}
                      />

                    </div>

                  </div>

                )}


                {/* =================================================
                    READY
                ================================================= */}

                {!analyzing && !analysis && (

                  <div className="image-status">

                    <span className="status-dot"></span>

                    IMAGE READY

                  </div>

                )}

              </div>


              {!analyzing && !analysis && (

                <button
                  type="button"
                  className="change-photo-small"
                  onClick={handleChangePhoto}
                >
                  Change Photo
                </button>

              )}

            </div>

          )}

        </div>

      </div>


      {/* =================================================
          ANALYZE BUTTON
      ================================================= */}

      {image &&
        !analysis &&
        !analyzing && (

          <div className="analysis-action">

            <button
              type="button"
              className="analyze-button"
              onClick={handleAnalyze}
            >

              <span className="analyze-icon">
                ✦
              </span>

              <span>
                Analyze My Skin
              </span>

              <span className="arrow">
                →
              </span>

            </button>

            <p>
              Your photo is ready for AyurAI analysis.
            </p>

          </div>

        )}


      {/* =================================================
          RESULT
      ================================================= */}

      {analysis && (

        <div className="analysis-result">

          {/* =================================================
              RESULT HEADING
          ================================================= */}

          <div className="result-heading">

            <span className="section-label">
              AYURVISION AI RESULT
            </span>

            <h2>
              Your Skin Analysis Is Ready
            </h2>

            <p>
              AyurAI has identified visible skin
              characteristics from your uploaded photo.
            </p>

          </div>


          {/* =================================================
              DOSHA PROFILE
          ================================================= */}

          {dosha ? (

            <div className="dosha-result-banner">

              <div className="dosha-result-icon">
                ☯
              </div>

              <div className="dosha-result-content">

                <span>
                  YOUR AYURVEDIC PROFILE
                </span>

                <strong>
                  {dosha}
                </strong>

                <p>
                  Your Dosha and skin analysis are
                  now ready to be combined into your
                  personalized AyurAI profile.
                </p>

              </div>

            </div>

          ) : (

            <div className="dosha-result-banner dosha-missing">

              <div className="dosha-result-icon">
                ☯
              </div>

              <div className="dosha-result-content">

                <span>
                  AYURVEDIC PROFILE
                </span>

                <strong>
                  Dosha Test Not Completed
                </strong>

                <p>
                  Complete the Dosha Test to create
                  your complete AyurAI profile.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/dosha-test")
                }
              >
                Take Test →
              </button>

            </div>

          )}


          {/* =================================================
              RESULT GRID
          ================================================= */}

          <div className="result-grid">

            {/* =================================================
                SKIN TYPE
            ================================================= */}

            <div className="result-card result-skin">

              <span className="result-number">
                01
              </span>

              <div className="result-icon">
                ◈
              </div>

              <span className="result-label">
                SKIN TYPE
              </span>

              <strong>
                {analysis.skinType}
              </strong>

            </div>


            {/* =================================================
                HYDRATION
            ================================================= */}

            <div className="result-card result-hydration">

              <span className="result-number">
                02
              </span>

              <div className="result-icon">
                ◌
              </div>

              <span className="result-label">
                HYDRATION APPEARANCE
              </span>

              <strong>
                {analysis.hydration.level}
              </strong>

              <div className="hydration-meter">

                <div
                  className="hydration-meter-fill"
                  style={{
                    width:
                      `${analysis.hydration.percentage}%`
                  }}
                />

              </div>

              <small>
                {analysis.hydration.percentage}%
              </small>

            </div>


            {/* =================================================
                CONFIDENCE
            ================================================= */}

            <div className="result-card result-confidence">

              <span className="result-number">
                03
              </span>

              <div className="result-icon">
                ✓
              </div>

              <span className="result-label">
                AI ANALYSIS CONFIDENCE
              </span>

              <strong>
                {analysis.confidence}%
              </strong>

            </div>


            {/* =================================================
                CONCERNS
            ================================================= */}

            <div className="result-card result-concerns">

              <span className="result-number">
                04
              </span>

              <div className="result-icon">
                ⌘
              </div>

              <span className="result-label">
                VISIBLE CONCERNS
              </span>

              <div className="concern-list">

                {analysis.concerns.map(
                  (concern, index) => (

                    <span
                      key={index}
                      className="concern-tag"
                    >
                      {concern}
                    </span>

                  )
                )}

              </div>

            </div>

          </div>


          {/* =================================================
              BASIC CARE RECOMMENDATION
          ================================================= */}

          <div className="care-recommendation">

            <div className="care-icon">
              ⌘
            </div>

            <div>

              <span>
                AYURVEDIC-INSPIRED CARE
              </span>

              <p>
                {analysis.recommendation}
              </p>

              <ul className="care-tips">

                {analysis.careTips.map(
                  (tip, index) => (

                    <li key={index}>

                      <span>
                        ✓
                      </span>

                      {tip}

                    </li>

                  )
                )}

              </ul>

            </div>

          </div>


          {/* =================================================
              OVERALL ANALYSIS BUTTON
          ================================================= */}

          {dosha && (

            <div className="overall-analysis-action">

              <div>

                <span>
                  NEXT STEP
                </span>

                <h3>
                  Discover Your Complete Ayurvedic Profile
                </h3>

                <p>
                  Combine your Dosha and skin analysis
                  to receive personalized skincare,
                  home remedies and wellness suggestions.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/overall-result")
                }
              >
                View My Overall Analysis →
              </button>

            </div>

          )}


          {/* =================================================
              DOSHA MISSING ACTION
          ================================================= */}

          {!dosha && (

            <div className="overall-analysis-action">

              <div>

                <span>
                  COMPLETE YOUR PROFILE
                </span>

                <h3>
                  Take Your Dosha Test
                </h3>

                <p>
                  Complete your Dosha Test so AyurAI
                  can combine both assessments.
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  navigate("/dosha-test")
                }
              >
                Take Dosha Test →
              </button>

            </div>

          )}


          {/* =================================================
              DISCLAIMER
          ================================================= */}

          <p className="analysis-disclaimer">
            AyurAI provides educational and
            Ayurvedic-inspired skincare guidance.
            Visible characteristics from an image
            may not represent your actual skin condition.
            This analysis is not a medical diagnosis
            and should not replace professional
            medical advice.
          </p>


          {/* =================================================
              ANALYZE ANOTHER
          ================================================= */}

          <button
  type="button"
  className="overall-result-button"
  onClick={() => {
    window.location.href = "/overall-result";
  }}
>
  View My Overall Result →
</button>

<button
  type="button"
  className="another-photo-button"
  onClick={handleChangePhoto}
>
  ↻ Analyze Another Photo
</button>

        </div>

      )}

    </section>

  );
};

export default SkinScanCard;