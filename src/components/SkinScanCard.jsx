import React, { useEffect, useRef, useState } from "react";
import "./SkinScanCard.css";

const SkinScanCard = () => {

  // =====================================================
  // STATE
  // =====================================================

  const [image, setImage] = useState(null);

  const [imageFile, setImageFile] = useState(null);

  const [analyzing, setAnalyzing] =
    useState(false);

  const [analysis, setAnalysis] =
    useState(null);

  const [dragActive, setDragActive] =
    useState(false);

  const [error, setError] =
    useState("");

  const [analysisStep, setAnalysisStep] =
    useState(0);

  const [dosha, setDosha] =
    useState(
      localStorage.getItem("ayuraiDosha") || null
    );

  const fileInputRef =
    useRef(null);


  // =====================================================
  // ANALYSIS STEPS
  // =====================================================

  const analysisSteps = [
    "Preparing your image...",
    "Checking image quality...",
    "Detecting visible skin patterns...",
    "Assessing skin characteristics...",
    "Preparing your skincare profile..."
  ];


  // =====================================================
  // DOSHA REFRESH
  // =====================================================

  useEffect(() => {

    const savedDosha =
      localStorage.getItem("ayuraiDosha");

    setDosha(savedDosha || null);

  }, []);


  // =====================================================
  // CLEAN IMAGE URL
  // =====================================================

  useEffect(() => {

    return () => {

      if (image) {
        URL.revokeObjectURL(image);
      }

    };

  }, [image]);


  // =====================================================
  // PROCESS IMAGE
  // =====================================================

  const processImage = (file) => {

    setError("");

    if (!file) {
      return;
    }


    // FILE TYPE

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


    // FILE SIZE

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {

      setError(
        "Please upload an image smaller than 10MB."
      );

      return;
    }


    // CREATE PREVIEW

    const imageUrl =
      URL.createObjectURL(file);


    setImage(imageUrl);

    setImageFile(file);

    setAnalysis(null);

    setAnalyzing(false);

    setAnalysisStep(0);
  };


  // =====================================================
  // FILE UPLOAD
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
  // OPEN FILE SELECTOR
  // =====================================================

  const openFileSelector = () => {

    fileInputRef.current?.click();

  };


  // =====================================================
  // DRAG OVER
  // =====================================================

  const handleDragOver = (event) => {

    event.preventDefault();

    event.stopPropagation();

    setDragActive(true);

  };


  // =====================================================
  // DRAG LEAVE
  // =====================================================

  const handleDragLeave = (event) => {

    event.preventDefault();

    event.stopPropagation();

    setDragActive(false);

  };


  // =====================================================
  // DROP
  // =====================================================

  const handleDrop = (event) => {

    event.preventDefault();

    event.stopPropagation();

    setDragActive(false);

    const file =
      event.dataTransfer.files?.[0];

    if (file) {
      processImage(file);
    }

  };


  // =====================================================
  // ANALYZE
  // =====================================================

  const handleAnalyze = () => {

    if (
      !image ||
      !imageFile ||
      analyzing
    ) {
      return;
    }


    setError("");

    setAnalysis(null);

    setAnalyzing(true);

    setAnalysisStep(0);


    // GET CURRENT DOSHA

    const currentDosha =
      localStorage.getItem(
        "ayuraiDosha"
      ) || null;

    setDosha(currentDosha);


    // =================================================
    // SIMULATED AI PROCESS
    // =================================================

    let currentStep = 0;

    const stepInterval =
      setInterval(() => {

        currentStep += 1;

        if (
          currentStep <
          analysisSteps.length
        ) {

          setAnalysisStep(
            currentStep
          );

        }

      }, 700);


    // =================================================
    // TEMPORARY DEMO RESULT
    // =================================================

    setTimeout(() => {

      clearInterval(stepInterval);


      setAnalysis({

        skinType:
          "Combination",


        hydration: {
          level: "Medium",
          percentage: 68
        },


        concerns: [
          "Mild dryness",
          "Blemish-prone areas"
        ],


        confidence: 86,


        dosha:
          currentDosha,


        recommendation:
          "Your skin may benefit from gentle cleansing, lightweight hydration, and calming skincare practices.",


        careTips: [
          "Use a gentle cleanser",
          "Maintain consistent hydration",
          "Avoid excessive cleansing",
          "Choose calming skincare ingredients"
        ]

      });


      setAnalyzing(false);

      setAnalysisStep(
        analysisSteps.length - 1
      );

    }, 4000);

  };


  // =====================================================
  // CHANGE PHOTO
  // =====================================================

  const handleChangePhoto = () => {

    if (image) {
      URL.revokeObjectURL(image);
    }

    setImage(null);

    setImageFile(null);

    setAnalysis(null);

    setAnalyzing(false);

    setDragActive(false);

    setError("");

    setAnalysisStep(0);

  };


  // =====================================================
  // HYDRATION
  // =====================================================

  const hydrationWidth =
    analysis?.hydration?.percentage || 0;


  // =====================================================
  // RENDER
  // =====================================================

  return (

    <section
      className="skin-scan-section"
      id="skin-scan"
    >


      {/* =================================================
          HEADING
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
          analyse visible skin patterns and
          create an Ayurvedic-inspired skincare
          profile.
        </p>

      </div>


      {/* =================================================
          MAIN SCANNER
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
            Understand your skin before choosing
            skincare products. AyurAI combines
            intelligent visual analysis with
            Ayurvedic-inspired skincare guidance.
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
              ✦
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


          {/* ERROR */}

          {error && (

            <div
              className="upload-error"
              role="alert"
            >

              <span>
                !
              </span>

              {error}

            </div>

          )}


          {/* =================================================
              UPLOAD
          ================================================= */}

          {!image && (

            <div
              className={`upload-area ${
                dragActive
                  ? "drag-active"
                  : ""
              }`}
              onDragOver={
                handleDragOver
              }
              onDragLeave={
                handleDragLeave
              }
              onDrop={
                handleDrop
              }
            >

              <div className="upload-content">


                <div className="upload-icon">
                  ✦
                </div>


                <h3>
                  Upload Your Skin Photo
                </h3>


                <p>
                  Drag & drop your photo here
                </p>


                <div className="or-divider">
                  <span>
                    OR
                  </span>
                </div>


                <button
                  type="button"
                  className="upload-button"
                  onClick={
                    openFileSelector
                  }
                >
                  Choose Image
                </button>


                <small>
                  JPG, PNG or WEBP
                  <br />
                  Maximum 10MB
                  <br />
                  Clear, well-lit face photo recommended
                </small>


                <input
                  ref={fileInputRef}
                  id="skin-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    handleImageUpload
                  }
                  hidden
                />

              </div>

            </div>

          )}


          {/* =================================================
              IMAGE
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
                  alt="Uploaded skin for analysis"
                />


                {/* SCANNING */}

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

                      {
                        analysisSteps[
                          analysisStep
                        ]
                      }

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


                {/* IMAGE READY */}

                {!analyzing &&
                  !analysis && (

                    <div className="image-status">

                      <span className="status-dot"></span>

                      IMAGE READY

                    </div>

                  )}

              </div>


              {!analyzing &&
                !analysis && (

                  <button
                    type="button"
                    className="change-photo-small"
                    onClick={
                      handleChangePhoto
                    }
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
              onClick={
                handleAnalyze
              }
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
              Your photo is ready for
              AyurAI analysis
            </p>

          </div>

        )}


      {/* =================================================
          RESULT
      ================================================= */}

      {analysis && (

        <div className="analysis-result">


          {/* RESULT HEADING */}

          <div className="result-heading">

            <span className="section-label">
              AYURVISION AI RESULT
            </span>


            <h2>
              Your Skin Profile
            </h2>


            <p>
              This demonstration shows how your
              AyurAI skin analysis results will be
              presented.
            </p>

          </div>


          {/* =================================================
              DOSHA CONNECTION
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
                  Your Dosha Test result is being
                  used alongside your skin analysis
                  to create a more personalized
                  recommendation.
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
                  Complete the Dosha Test to
                  receive Ayurvedic personalization.
                </p>

              </div>


              <button
                type="button"
                onClick={() => {
                  window.location.href =
                    "/dosha-test";
                }}
              >
                Take Test →
              </button>

            </div>

          )}


          {/* =================================================
              RESULT GRID
          ================================================= */}

          <div className="result-grid">


            {/* SKIN TYPE */}

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


            {/* HYDRATION */}

            <div className="result-card result-hydration">

              <span className="result-number">
                02
              </span>


              <div className="result-icon">
                ◌
              </div>


              <span className="result-label">
                HYDRATION
              </span>


              <strong>
                {analysis.hydration.level}
              </strong>


              <div className="hydration-meter">

                <div
                  className="hydration-meter-fill"
                  style={{
                    width:
                      `${hydrationWidth}%`
                  }}
                />

              </div>


              <small>
                {
                  analysis.hydration
                    .percentage
                }%
                {" "}
                estimated
              </small>

            </div>


            {/* CONFIDENCE */}

            <div className="result-card result-confidence">

              <span className="result-number">
                03
              </span>


              <div className="result-icon">
                ✓
              </div>


              <span className="result-label">
                ANALYSIS CONFIDENCE
              </span>


              <strong>
                {analysis.confidence}%
              </strong>

            </div>


            {/* CONCERNS */}

            <div className="result-card result-concern">

              <span className="result-number">
                04
              </span>


              <div className="result-icon">
                ✧
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
              CARE
          ================================================= */}

          <div className="care-recommendation">

            <div className="care-icon">
              ✦
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
              DOSHA TEST CONNECTION
          ================================================= */}

          <div className="dosha-connection">

            <div className="dosha-connection-icon">
              ☯
            </div>


            <div>

              <strong>
                Want a more personalized
                Ayurvedic profile?
              </strong>


              <p>
                Your Dosha result can be combined
                with your skin analysis to create
                more personalized recommendations.
              </p>

            </div>


            <button
              type="button"
              className="dosha-test-button"
              onClick={() => {
                window.location.href =
                  "/dosha-test";
              }}
            >
              {dosha
                ? "Retake Dosha Test →"
                : "Take Dosha Test →"}
            </button>

          </div>


          {/* =================================================
              DISCLAIMER
          ================================================= */}

          <p className="analysis-disclaimer">

            AyurAI provides educational and
            Ayurvedic-inspired skincare guidance.
            This analysis is not a medical diagnosis
            and should not replace professional
            medical advice.

          </p>


          {/* =================================================
              ANOTHER PHOTO
          ================================================= */}

          <button
            type="button"
            className="another-photo-button"
            onClick={
              handleChangePhoto
            }
          >

            <span>
              ↻
            </span>

            Analyze Another Photo

          </button>

        </div>

      )}

    </section>

  );
};

export default SkinScanCard;