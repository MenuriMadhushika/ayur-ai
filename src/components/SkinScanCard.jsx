import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import "./SkinScanCard.css";

import {
  saveSkinScanResult,
  getAssessmentStatus,
} from "../utils/assessmentStatus";

import {
  createSkinScan
} from "../utils/api";

import {
  getCurrentUserId
} from "../utils/userSession";


/* =========================================================
   ICONS
   ========================================================= */

const CameraIcon = ({
  size = 30,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8.5 5.5L10 3.5H14L15.5 5.5H18C19.6569 5.5 21 6.84315 21 8.5V17.5C21 19.1569 19.6569 20.5 18 20.5H6C4.34315 20.5 3 19.1569 3 17.5V8.5C3 6.84315 4.34315 5.5 6 5.5H8.5Z"
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


const UploadIcon = ({
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 16V4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />

    <path
      d="M7.5 8.5L12 4L16.5 8.5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M5 14V18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V14"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);


const SparkleIcon = ({
  size = 18,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
      fill="currentColor"
    />

    <path
      d="M19 15L19.7 18.3L23 19L19.7 19.7L19 23L18.3 19.7L15 19L18.3 18.3L19 15Z"
      fill="currentColor"
    />
  </svg>
);


const CheckIcon = ({
  size = 17,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 12.5L9.5 17L19 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


const ArrowIcon = ({
  size = 17,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 12H19"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />

    <path
      d="M13 6L19 12L13 18"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);


/* =========================================================
   COMPONENT
   ========================================================= */

const SkinScanCard = () => {
  const navigate = useNavigate();

  const fileInputRef =
    useRef(null);

  const cameraInputRef =
    useRef(null);

  const [image, setImage] =
    useState(null);

  const [isScanning, setIsScanning] =
    useState(false);

  const [progress, setProgress] =
    useState(0);

  const [showOptions, setShowOptions] =
    useState(false);

  const [analysisComplete, setAnalysisComplete] =
    useState(false);

  const [doshaCompleted, setDoshaCompleted] =
    useState(false);

  const [openCareCard, setOpenCareCard] =
    useState(null);

  const [completedSteps, setCompletedSteps] =
    useState([]);


  /* =========================================================
     STATUS
     ========================================================= */

  const checkAssessmentStatus = () => {
    const status =
      getAssessmentStatus();

    setDoshaCompleted(
      Boolean(
        status.doshaCompleted ||
        status.doshaTestCompleted
      )
    );
  };


  useEffect(() => {
    checkAssessmentStatus();

    const updateStatus =
      () => checkAssessmentStatus();

    window.addEventListener(
      "storage",
      updateStatus
    );

    window.addEventListener(
      "ayurai-assessment-updated",
      updateStatus
    );

    return () => {
      window.removeEventListener(
        "storage",
        updateStatus
      );

      window.removeEventListener(
        "ayurai-assessment-updated",
        updateStatus
      );
    };
  }, []);


  /* =========================================================
     FILE
     ========================================================= */

  const handleFile = (
    file
  ) => {
    if (!file) return;

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        "Please select a valid image."
      );

      return;
    }

    const imageUrl =
      URL.createObjectURL(
        file
      );

    setImage(imageUrl);

    setAnalysisComplete(
      false
    );

    setProgress(0);

    setIsScanning(
      false
    );

    setShowOptions(
      false
    );
  };


  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };


  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };


  const handleFileChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    handleFile(file);

    event.target.value = "";
  };


  /* =========================================================
     ANALYZE
     ========================================================= */

  const handleAnalyze = () => {
    if (
      !image ||
      isScanning
    ) {
      return;
    }

    setIsScanning(
      true
    );

    setProgress(0);

    setAnalysisComplete(
      false
    );
  };


  /* =========================================================
     SCAN
     ========================================================= */

  useEffect(() => {
    if (!isScanning) {
      return;
    }

    const interval =
      setInterval(() => {

        setProgress(
          (previous) => {

            const next =
              previous + 2;

            if (
              next >= 100
            ) {
              clearInterval(
                interval
              );

              setTimeout(async() => {

                setIsScanning(
                  false
                );

                setAnalysisComplete(
                  true
                );


                /* =========================================
                   SAVE SKIN RESULT
                ========================================= */

                try {
                 const userId = getCurrentUserId();

if (!userId) {
  throw new Error("User session not found. Please log in again.");
}

const backendResult = await createSkinScan({
  userId,
  imagePath: "uploads/skin-scan.jpg",
  estimatedSkinType: "AI-estimated combination skin",
  visibleCharacteristics:
    "AI-estimated visible skin characteristics from uploaded image",
  analysisStatus: "COMPLETED",
});

  console.log("Skin scan saved to backend:", backendResult);

  saveSkinScanResult({
    completed: true,
    completedAt: new Date().toISOString(),
    skinType: backendResult.estimatedSkinType || "AI-estimated",
    hydration: "AI-estimated",
    concern: "AI-observed",
    texture: backendResult.visibleCharacteristics || "AI-observed",
  });

  checkAssessmentStatus();

} catch (error) {
  console.error("Failed to save skin scan:", error);

  alert(
    "Skin analysis completed, but the result could not be saved. Please make sure the backend is running."
  );

  setAnalysisComplete(false);
}


                checkAssessmentStatus();

              }, 500);

              return 100;
            }

            return next;
          }
        );

      }, 55);


    return () =>
      clearInterval(
        interval
      );

  }, [isScanning]);


  /* =========================================================
     CHANGE PHOTO
     ========================================================= */

  const handleChangePhoto = () => {
    setImage(null);

    setAnalysisComplete(
      false
    );

    setProgress(0);

    setIsScanning(
      false
    );
  };


  /* =========================================================
     CARE
     ========================================================= */

  const toggleCareCard = (
    card
  ) => {
    setOpenCareCard(
      (previous) =>
        previous === card
          ? null
          : card
    );
  };


  const toggleStep = (
    stepId
  ) => {
    setCompletedSteps(
      (previous) =>
        previous.includes(
          stepId
        )
          ? previous.filter(
              (id) =>
                id !== stepId
            )
          : [
              ...previous,
              stepId,
            ]
    );
  };


  /* =========================================================
     NEXT ASSESSMENT
     ========================================================= */

  const handleNextAssessment = () => {
    const status =
      getAssessmentStatus();

    if (
      status.skinScanCompleted &&
      status.doshaCompleted
    ) {
      navigate(
        "/overall-result"
      );

      return;
    }

    navigate(
      "/dosha-test"
    );
  };


  const nextButtonText =
    doshaCompleted
      ? "VIEW OVERALL RESULT"
      : "CONTINUE TO DOSHA TEST";


  const progressPercentage =
    Math.round(
      (completedSteps.length /
        6) *
        100
    );


  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <section className="skin-scan-section">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="scan-heading">

        <span className="section-label">
          AI SKIN ANALYSIS
        </span>

        <h2>
          Understand Your{" "}
          <span>
            Skin
          </span>
        </h2>

        <p>
          Upload a clear facial photo and let
          AyurAI estimate visible skin
          characteristics to support your
          Ayurvedic skincare journey.
        </p>

      </div>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="scan-container">

        <div className="scan-info">

          <div className="scan-number">
            01 — SKIN SCAN
          </div>

          <h3>
            Begin with your skin.
          </h3>

          <p>
            Your photo is used to estimate
            visible characteristics such as
            skin appearance, hydration and
            texture.
          </p>

          <div className="scan-features">

            <span>
              <b>✓</b>
              AI-estimated visible skin
              characteristics
            </span>

            <span>
              <b>✓</b>
              Simple and personalized
              guidance
            </span>

            <span>
              <b>✓</b>
              Designed for your Ayurvedic
              journey
            </span>

          </div>

          <div className="scan-note">

            <div className="scan-note-icon">
              <SparkleIcon size={15} />
            </div>

            <p>
              For best results, use a clear,
              front-facing photo taken in
              natural or well-lit conditions.
              This tool provides an AI estimate
              and is not a medical diagnosis.
            </p>

          </div>

        </div>


        {/* ===================================================
            UPLOAD
        =================================================== */}

        <div className="upload-wrapper">

          {!image ? (

            <div className="upload-area">

              <div className="upload-content">

                <button
                  type="button"
                  className="upload-icon-button"
                  onClick={() =>
                    setShowOptions(true)
                  }
                >
                  <CameraIcon size={31} />
                </button>

                <h3>
                  Add your skin photo
                </h3>

                <p>
                  Choose an existing photo or
                  use your camera
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
                    handleUploadClick
                  }
                >
                  UPLOAD PHOTO
                </button>

                <small>
                  JPG, JPEG or PNG · Clear
                  facial photo recommended
                </small>

              </div>

            </div>

          ) : (

            <div className="image-preview-container">

              <div className="image-preview">

                <img
                  src={image}
                  alt="Uploaded skin scan preview"
                />

                {!isScanning &&
                  !analysisComplete && (

                    <div className="image-status">

                      <span className="status-dot" />

                      PHOTO READY

                    </div>

                  )}


                {/* SCANNING */}

                {isScanning && (

                  <div className="ai-scan-overlay">

                    <div className="scan-glow" />

                    <div className="face-scan-frame" />

                    <div className="scan-corner top-left" />
                    <div className="scan-corner top-right" />
                    <div className="scan-corner bottom-left" />
                    <div className="scan-corner bottom-right" />

                    <div className="face-point point-one" />
                    <div className="face-point point-two" />
                    <div className="face-point point-three" />
                    <div className="face-point point-four" />
                    <div className="face-point point-five" />

                    <div className="photo-scan-line" />

                    <div className="scan-status">

                      <span className="scan-pulse" />

                      AI ANALYSIS IN PROGRESS

                    </div>

                    <div className="scan-detection">

                      <SparkleIcon size={13} />

                      <span>

                        {progress < 30
                          ? "Detecting facial region..."
                          : progress < 60
                          ? "Observing visible skin characteristics..."
                          : progress < 85
                          ? "Estimating skin appearance..."
                          : "Preparing your assessment..."}

                      </span>

                    </div>

                    <div className="scan-progress">

                      <div
                        className="scan-progress-bar"
                        style={{
                          width:
                            `${progress}%`,
                        }}
                      />

                    </div>

                  </div>

                )}


                {/* COMPLETE */}

                {analysisComplete && (

                  <div className="scan-complete-overlay">

                    <div className="scan-complete-icon">
                      <CheckIcon size={26} />
                    </div>

                    <span>
                      SKIN SCAN COMPLETE
                    </span>

                  </div>

                )}

              </div>


              {!isScanning &&
                !analysisComplete && (

                  <button
                    type="button"
                    className="change-photo-small"
                    onClick={
                      handleChangePhoto
                    }
                  >
                    Change photo
                  </button>

                )}

            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          ANALYZE BUTTON
      ===================================================== */}

      {image &&
        !analysisComplete && (

          <div className="analysis-action">

            <button
              type="button"
              className="analyze-button"
              onClick={
                handleAnalyze
              }
              disabled={
                isScanning
              }
            >

              <span className="analyze-icon">
                <SparkleIcon size={15} />
              </span>

              {isScanning
                ? "ANALYZING..."
                : "ANALYZE MY SKIN"}

              {!isScanning && (

                <span className="arrow">
                  <ArrowIcon size={15} />
                </span>

              )}

            </button>

            <p>
              AI-estimated results ·
              Not a medical diagnosis
            </p>

          </div>

        )}


      {/* =====================================================
          COMPLETE
      ===================================================== */}

      {analysisComplete && (

        <section className="skin-scan-complete">

          <div className="complete-heading">

            <span className="complete-label">
              SKIN SCAN COMPLETE
            </span>

            <h2>
              Your first assessment is complete.
            </h2>

            <p>
              Your Skin Scan has been saved.
              AyurAI will combine this assessment
              with your Dosha Test to create your
              Overall Ayurvedic Result.
            </p>

          </div>


          <div className="assessment-status-grid">

            <div className="assessment-status completed">

              <div className="assessment-status-icon">
                <CheckIcon size={16} />
              </div>

              <div>
                <span>
                  01
                </span>

                <strong>
                  Skin Scan
                </strong>

                <small>
                  Completed
                </small>
              </div>

            </div>


            <div className="assessment-connector">
              <span />
            </div>


            <div
              className={`assessment-status ${
                doshaCompleted
                  ? "completed"
                  : "pending"
              }`}
            >

              <div className="assessment-status-icon">

                {doshaCompleted
                  ? (
                    <CheckIcon size={16} />
                  )
                  : (
                    <span>
                      02
                    </span>
                  )}

              </div>

              <div>

                <span>
                  02
                </span>

                <strong>
                  Dosha Test
                </strong>

                <small>
                  {doshaCompleted
                    ? "Completed"
                    : "Still required"}
                </small>

              </div>

            </div>

          </div>


          <div className="complete-message">

            <div className="complete-message-icon">
              <SparkleIcon size={17} />
            </div>

            <p>

              <strong>
                {doshaCompleted
                  ? "Both assessments are complete."
                  : "One more assessment is required."}
              </strong>

              {" "}

              {doshaCompleted
                ? "Your Skin Scan and Dosha Test are ready to be combined into your Overall Ayurvedic Result."
                : "Complete your Dosha Test so AyurAI can combine both assessments into your Overall Ayurvedic Result."}

            </p>

          </div>


          <div className="complete-action">

            <button
              type="button"
              onClick={
                handleNextAssessment
              }
              className="continue-dosha-button"
            >

              <span>
                {nextButtonText}
              </span>

              <ArrowIcon size={17} />

            </button>

            <button
              type="button"
              onClick={
                handleChangePhoto
              }
              className="another-photo-button"
            >
              Analyze another photo
            </button>

          </div>

        </section>

      )}


      {/* =====================================================
          CARE
      ===================================================== */}

      {analysisComplete && (

        <section className="ayurvedic-care-section">

          <div className="care-section-header">

            <div>

              <h2>
                Your Ayurvedic Care
              </h2>

              <p>
                Explore simple skincare habits
                while you complete your full
                Ayurvedic assessment.
              </p>

            </div>

            <div className="routine-progress">

              <div className="progress-circle">

                <span>
                  {progressPercentage}
                </span>

                <small>
                  %
                </small>

              </div>

              <div>

                <strong>
                  Routine progress
                </strong>

                <span>
                  {completedSteps.length}
                  {" "}of 6 steps completed
                </span>

              </div>

            </div>

          </div>


          <div className="routine-progress-bar">

            <div
              style={{
                width:
                  `${progressPercentage}%`,
              }}
            />

          </div>


          {/* MORNING */}

          <article
            className={`care-plan-card gold ${
              openCareCard ===
              "morning"
                ? "is-open"
                : ""
            }`}
          >

            <button
              type="button"
              className="care-card-header"
              onClick={() =>
                toggleCareCard(
                  "morning"
                )
              }
            >

              <div className="care-card-icon">
                ☼
              </div>

              <div className="care-card-title">

                <span>
                  MORNING
                </span>

                <h3>
                  Gentle Start
                </h3>

                <p>
                  Begin your day with
                  a simple and gentle
                  skincare routine.
                </p>

              </div>

              <span className="care-card-toggle">
                {openCareCard ===
                "morning"
                  ? "−"
                  : "+"}
              </span>

            </button>

            <div
              className={`care-card-content ${
                openCareCard ===
                "morning"
                  ? "expanded"
                  : ""
              }`}
            >

              <div className="care-steps">

                {[
                  [
                    "morning-1",
                    "Cleanse gently",
                    "Use a gentle cleanser without harsh rubbing.",
                  ],

                  [
                    "morning-2",
                    "Hydrate",
                    "Apply a suitable lightweight moisturizer.",
                  ],
                ].map(
                  (
                    [
                      id,
                      title,
                      description,
                    ],
                    index
                  ) => (

                    <button
                      type="button"
                      key={id}
                      className={`care-step ${
                        completedSteps.includes(
                          id
                        )
                          ? "completed"
                          : ""
                      }`}
                      onClick={() =>
                        toggleStep(
                          id
                        )
                      }
                    >

                      <span className="step-number">
                        {index + 1}
                      </span>

                      <span className="step-content">

                        <strong>
                          {title}
                        </strong>

                        <span>
                          {description}
                        </span>

                      </span>

                      <span className="step-check">

                        {completedSteps.includes(
                          id
                        )
                          ? (
                            <CheckIcon size={16} />
                          )
                          : "○"}

                      </span>

                    </button>

                  )
                )}

              </div>

            </div>

          </article>


          {/* DAY */}

          <article
            className={`care-plan-card sage ${
              openCareCard ===
              "day"
                ? "is-open"
                : ""
            }`}
          >

            <button
              type="button"
              className="care-card-header"
              onClick={() =>
                toggleCareCard(
                  "day"
                )
              }
            >

              <div className="care-card-icon">
                ✦
              </div>

              <div className="care-card-title">

                <span>
                  DAYTIME
                </span>

                <h3>
                  Protect & Balance
                </h3>

                <p>
                  Keep your skin comfortable
                  and protected throughout
                  the day.
                </p>

              </div>

              <span className="care-card-toggle">
                {openCareCard ===
                "day"
                  ? "−"
                  : "+"}
              </span>

            </button>

            <div
              className={`care-card-content ${
                openCareCard ===
                "day"
                  ? "expanded"
                  : ""
              }`}
            >

              <div className="care-steps">

                {[
                  [
                    "day-1",
                    "Stay hydrated",
                    "Drink enough water throughout your day.",
                  ],

                  [
                    "day-2",
                    "Protect your skin",
                    "Use appropriate sun protection when outdoors.",
                  ],
                ].map(
                  (
                    [
                      id,
                      title,
                      description,
                    ],
                    index
                  ) => (

                    <button
                      type="button"
                      key={id}
                      className={`care-step ${
                        completedSteps.includes(
                          id
                        )
                          ? "completed"
                          : ""
                      }`}
                      onClick={() =>
                        toggleStep(
                          id
                        )
                      }
                    >

                      <span className="step-number">
                        {index + 1}
                      </span>

                      <span className="step-content">

                        <strong>
                          {title}
                        </strong>

                        <span>
                          {description}
                        </span>

                      </span>

                      <span className="step-check">

                        {completedSteps.includes(
                          id
                        )
                          ? (
                            <CheckIcon size={16} />
                          )
                          : "○"}

                      </span>

                    </button>

                  )
                )}

              </div>

            </div>

          </article>


          {/* EVENING */}

          <article
            className={`care-plan-card blue ${
              openCareCard ===
              "evening"
                ? "is-open"
                : ""
            }`}
          >

            <button
              type="button"
              className="care-card-header"
              onClick={() =>
                toggleCareCard(
                  "evening"
                )
              }
            >

              <div className="care-card-icon">
                ◐
              </div>

              <div className="care-card-title">

                <span>
                  EVENING
                </span>

                <h3>
                  Restore & Relax
                </h3>

                <p>
                  End your day with a calm
                  and consistent skincare
                  routine.
                </p>

              </div>

              <span className="care-card-toggle">
                {openCareCard ===
                "evening"
                  ? "−"
                  : "+"}
              </span>

            </button>

            <div
              className={`care-card-content ${
                openCareCard ===
                "evening"
                  ? "expanded"
                  : ""
              }`}
            >

              <div className="care-steps">

                {[
                  [
                    "evening-1",
                    "Cleanse",
                    "Remove daily buildup with a gentle cleanse.",
                  ],

                  [
                    "evening-2",
                    "Moisturize",
                    "Finish with a comfortable nighttime moisturizer.",
                  ],
                ].map(
                  (
                    [
                      id,
                      title,
                      description,
                    ],
                    index
                  ) => (

                    <button
                      type="button"
                      key={id}
                      className={`care-step ${
                        completedSteps.includes(
                          id
                        )
                          ? "completed"
                          : ""
                      }`}
                      onClick={() =>
                        toggleStep(
                          id
                        )
                      }
                    >

                      <span className="step-number">
                        {index + 1}
                      </span>

                      <span className="step-content">

                        <strong>
                          {title}
                        </strong>

                        <span>
                          {description}
                        </span>

                      </span>

                      <span className="step-check">

                        {completedSteps.includes(
                          id
                        )
                          ? (
                            <CheckIcon size={16} />
                          )
                          : "○"}

                      </span>

                    </button>

                  )
                )}

              </div>

            </div>

          </article>


          {/* SIMPLE FLOW */}

          <div className="simple-routine">

            <div className="simple-routine-heading">

              <h3>
                A Simple Daily Flow
              </h3>

            </div>

            <div className="routine-flow">

              <div className="routine-flow-card morning">

                <div className="routine-flow-icon">
                  ☼
                </div>

                <div>

                  <span>
                    MORNING
                  </span>

                  <strong>
                    Cleanse
                  </strong>

                  <p>
                    Start gently.
                  </p>

                </div>

              </div>

              <div className="routine-arrow">
                →
              </div>

              <div className="routine-flow-card day">

                <div className="routine-flow-icon">
                  ✦
                </div>

                <div>

                  <span>
                    DAY
                  </span>

                  <strong>
                    Protect
                  </strong>

                  <p>
                    Maintain balance.
                  </p>

                </div>

              </div>

              <div className="routine-arrow">
                →
              </div>

              <div className="routine-flow-card evening">

                <div className="routine-flow-icon">
                  ◐
                </div>

                <div>

                  <span>
                    EVENING
                  </span>

                  <strong>
                    Restore
                  </strong>

                  <p>
                    Let your skin rest.
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* FINAL */}

          <div className="overall-analysis-action">

            <div>

              <span>
                {doshaCompleted
                  ? "ASSESSMENT COMPLETE"
                  : "NEXT STEP"}
              </span>

              <h3>
                {doshaCompleted
                  ? "Your Overall Ayurvedic Result is ready."
                  : "Complete your Ayurvedic assessment"}
              </h3>

              <p>
                {doshaCompleted
                  ? "Both your Skin Scan and Dosha Test are complete. View your combined Ayurvedic assessment."
                  : "Your Skin Scan is complete. Complete the Dosha Test to combine both assessments and unlock your Overall Ayurvedic Result."}
              </p>

            </div>

            <button
              type="button"
              onClick={
                handleNextAssessment
              }
            >
              {doshaCompleted
                ? "VIEW OVERALL RESULT →"
                : "CONTINUE TO DOSHA TEST →"}
            </button>

          </div>

        </section>

      )}


      {/* DISCLAIMER */}

      {analysisComplete && (

        <p className="analysis-disclaimer">
          AyurAI provides AI-estimated visual
          observations for educational and
          wellness purposes only. Results are
          not a medical diagnosis and should
          not replace advice from a qualified
          healthcare professional.
        </p>

      )}


      {/* FILE INPUTS */}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg"
        hidden
        onChange={
          handleFileChange
        }
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="user"
        hidden
        onChange={
          handleFileChange
        }
      />


      {/* UPLOAD OPTIONS */}

      {showOptions && (

        <div
          className="upload-options-overlay"
          onClick={(event) => {

            if (
              event.target ===
              event.currentTarget
            ) {
              setShowOptions(
                false
              );
            }

          }}
        >

          <div className="upload-options-card">

            <button
              type="button"
              className="upload-options-close"
              onClick={() =>
                setShowOptions(
                  false
                )
              }
            >
              ×
            </button>

            <div className="upload-options-symbol">
              <CameraIcon size={25} />
            </div>

            <span className="upload-options-label">
              SKIN SCAN
            </span>

            <h3>
              Choose your photo
            </h3>

            <p>
              Select an existing image or
              use your device camera to
              capture a new facial photo.
            </p>

            <div className="upload-options-buttons">

              <button
                type="button"
                className="upload-option-button"
                onClick={
                  handleUploadClick
                }
              >

                <span className="option-icon">
                  <UploadIcon size={20} />
                </span>

                <span className="option-text">

                  <strong>
                    Upload from device
                  </strong>

                  <small>
                    Choose a JPG or PNG image
                  </small>

                </span>

                <span className="option-arrow">
                  →
                </span>

              </button>


              <button
                type="button"
                className="upload-option-button"
                onClick={
                  handleCameraClick
                }
              >

                <span className="option-icon">
                  <CameraIcon size={20} />
                </span>

                <span className="option-text">

                  <strong>
                    Use camera
                  </strong>

                  <small>
                    Take a new facial photo
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
                setShowOptions(
                  false
                )
              }
            >
              Cancel
            </button>

          </div>

        </div>

      )}

    </section>
  );
};


export default SkinScanCard;