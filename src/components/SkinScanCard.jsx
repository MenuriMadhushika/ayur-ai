import React, { useEffect, useRef, useState } from "react";
import "./SkinScanCard.css";

import {
  analyzeSkinPhoto,
  getUserSkinScans,
} from "../utils/api";

import { saveSkinScanResult } from "../utils/assessmentStatus";
import { getCurrentUserId } from "../utils/userSession";

import SkinTypeResult from "./SkinTypeResult";
import SensitivityQuestions from "./SensitivityQuestions";

import {
  skinTypeLabel,
  confidenceLabel,
  sensitivityLabel,
} from "../utils/skinTypeInfo";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const SkinScanCard = () => {
  const inputRef = useRef(null);

  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [stage, setStage] = useState("photo");
  const [result, setResult] = useState(null);

  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");

  const [consent, setConsent] = useState(false);

  const [sensitivityAnswers, setSensitivityAnswers] = useState([
    "",
    "",
    "",
    "",
  ]);

  /* =====================================================
     LOAD SCAN HISTORY
  ===================================================== */

  const loadHistory = async () => {
    const userId = getCurrentUserId();

    if (!userId) {
      setHistoryLoading(false);
      return;
    }

    setHistoryError("");

    try {
      const scans = await getUserSkinScans(userId);
      setHistory(scans);
    } catch (loadError) {
      setHistoryError(
        loadError.message ||
          "Unable to load your scan history."
      );
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  /* =====================================================
     PHOTO PREVIEW
  ===================================================== */

  useEffect(() => {
    if (!photo) {
      setPreviewUrl("");
      return undefined;
    }

    const nextPreviewUrl = URL.createObjectURL(photo);

    setPreviewUrl(nextPreviewUrl);

    return () => {
      URL.revokeObjectURL(nextPreviewUrl);
    };
  }, [photo]);

  /* =====================================================
     CHOOSE PHOTO
  ===================================================== */

  const choosePhoto = (file) => {
    setError("");
    setNotice("");

    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Please choose a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Please choose an image smaller than 5 MB.");
      return;
    }

    setPhoto(file);
    setResult(null);
    setConsent(false);
    setStage("review");
  };

  const openPhotoPicker = () => {
    if (!inputRef.current) return;

    inputRef.current.value = "";
    inputRef.current.click();
  };

  /* =====================================================
     ANALYZE PHOTO
  ===================================================== */

  const handleAnalyze = async () => {
    if (!photo) {
      setError(
        "Add a clear photo before starting the scan."
      );
      return;
    }

    if (!consent) {
      setError(
        "Confirm that you understand this is an educational, non-diagnostic estimate."
      );
      return;
    }

    setError("");
    setNotice("");

    if (
      sensitivityAnswers.some(Boolean) &&
      !sensitivityAnswers.every(Boolean)
    ) {
      setError(
        "Answer all four sensitivity questions, or skip the section."
      );
      return;
    }

    setStage("analyzing");

    try {
      const userId = getCurrentUserId();

      if (!userId) {
        throw new Error(
          "Your session has expired. Please sign in again."
        );
      }

      const prediction = await analyzeSkinPhoto(
        userId,
        photo,
        sensitivityAnswers.every(Boolean)
          ? sensitivityAnswers.join("")
          : null
      );

      setResult(prediction);

      saveSkinScanResult({
        completed: true,

        completedAt:
          prediction.createdAt ||
          new Date().toISOString(),

        /*
         * Keep this legacy cache field unchanged for now
         * because other parts of AyurAI may depend on it.
         */
        skinType: prediction.estimatedCategory,

        skinTypePrediction: prediction.skinType,

        sensitivityScore:
          prediction.sensitivityScore,

        acneSeverity:
          prediction.estimatedCategory,

        concern:
          prediction.estimatedCategory ||
          "Uncertain",

        texture:
          prediction.message,

        confidence:
          prediction.modelScore,

        modelVersion:
          prediction.modelVersion,
      });

      await loadHistory();

      setStage("result");
    } catch (analysisError) {
      setError(
        analysisError.message ||
          "Skin analysis is unavailable. Make sure all three services are running."
      );

      setStage("review");
    }
  };

  /* =====================================================
     ACNE RESULT EXPLANATION
  ===================================================== */

  const acneExplanation = (severity) => {
    switch (severity?.toLowerCase()) {
      case "mild":
        return "The AI noticed only a few visible acne-like features in this photo.";

      case "moderate":
        return "The AI noticed a noticeable amount of acne-like features in this photo.";

      case "severe":
        return "The AI noticed many or more pronounced acne-like features in this photo.";

      case "very severe":
        return "The AI noticed extensive visible acne-like features in this photo.";

      default:
        return "The AI could not confidently estimate the level of acne-like features in this photo.";
    }
  };

  return (
    <section
      className="skin-scan-section"
      aria-labelledby="skin-scan-title"
    >

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="skin-scan-header">

        <div>
          <span className="skin-scan-eyebrow">
            AI-ASSISTED SKIN CHECK
          </span>

          <h1 id="skin-scan-title">
            Understand what your skin{" "}
            <em>may be showing.</em>
          </h1>

          <p>
            Upload one clear, unfiltered photo. AyurAI will
            check for a small set of visible characteristics
            and provide educational guidance.
          </p>
        </div>

        <div
          className="scan-progress"
          aria-label="Skin scan progress"
        >

          <div className="progress-step active">
            <span>1</span>
            <small>Photo</small>
          </div>

          <i />

          <div
            className={`progress-step ${
              photo ? "active" : ""
            }`}
          >
            <span>2</span>
            <small>Review</small>
          </div>

          <i />

          <div
            className={`progress-step ${
              stage === "result"
                ? "active"
                : ""
            }`}
          >
            <span>3</span>
            <small>Result</small>
          </div>

        </div>

      </header>

      {/* =====================================================
          WORKSPACE
      ===================================================== */}

      <div className="skin-scan-workspace">

        {/* ===================================================
            LEFT PANEL
        =================================================== */}

        <div className="photo-panel">

          {stage === "analyzing" ? (

            /* ===============================================
               ANALYZING
            =============================================== */

            <div
              className="analysis-state"
              role="status"
            >

              <div className="analysis-orbit">
                <span />
              </div>

              <span className="drop-kicker">
                PREPARING ANALYSIS
              </span>

              <h2>Checking your photo.</h2>

              <p>
                Preparing your photo for the independent
                acne and skin-type estimates.
              </p>

            </div>

          ) : stage === "result" ? (

            /* ===============================================
               RESULT
            =============================================== */

            <div className="result-state">

              <div
                className="result-symbol"
                aria-hidden="true"
              >
                ⌘
              </div>

              <span className="drop-kicker">
                YOUR SKIN ANALYSIS
              </span>

              <h2>
                Your skin analysis is ready.
              </h2>

              <p className="result-intro">
                Your skin type and additional visible skin
                observations are shown separately below.
              </p>

              {/* =============================================
                  PRIMARY RESULT — SKIN TYPE
              ============================================= */}

              <SkinTypeResult
                prediction={result?.skinType}
              />

              {/* =============================================
                  ACNE OBSERVATION
              ============================================= */}

              <div className="acne-observation">

                <div className="result-section-heading">

                  <span className="result-section-label">
                    ADDITIONAL SKIN OBSERVATION
                  </span>

                  <h3>
                    Acne-like Appearance
                  </h3>

                  <p>
                    An additional AI estimate based on
                    visible acne-like features in your photo.
                  </p>

                </div>

                <div className="future-result-grid">

                  <div>
                    <small>
                      ESTIMATED LEVEL
                    </small>

                    <strong>
                      {result?.estimatedCategory ||
                        "Uncertain"}
                    </strong>
                  </div>

                  <div>
                    <small>
                      AI CONFIDENCE
                    </small>

                    <strong>
                      {result?.modelScore == null
                        ? "Not available"
                        : `${Math.round(
                            result.modelScore * 100
                          )}%`}
                    </strong>
                  </div>

                </div>

                {/* ===========================================
                    CURRENT ACNE RESULT — GREEN
                =========================================== */}

                <div className="acne-current-explanation">

                  <strong>
                    What does{" "}
                    {result?.estimatedCategory ||
                      "this result"}{" "}
                    mean?
                  </strong>

                  <p>
                    {acneExplanation(
                      result?.estimatedCategory
                    )}
                  </p>

                </div>

                {/* ===========================================
                    UNDERSTAND ACNE
                =========================================== */}

                <details className="acne-level-guide">

                  <summary>
                    Understand Your Acne-Like Appearance
                  </summary>

                  <div className="acne-guide-content">

                    <p className="acne-guide-intro">
                      These levels describe how many visible
                      acne-like features the AI noticed in
                      your photo.
                    </p>

                    <div className="acne-level-list">

                      <div>
                        <strong>Mild</strong>

                        <span>
                          Few visible acne-like features.
                        </span>
                      </div>

                      <div>
                        <strong>Moderate</strong>

                        <span>
                          A noticeable amount of acne-like
                          features.
                        </span>
                      </div>

                      <div>
                        <strong>Severe</strong>

                        <span>
                          Many or more pronounced acne-like
                          features.
                        </span>
                      </div>

                      <div>
                        <strong>
                          Very Severe
                        </strong>

                        <span>
                          Extensive visible acne-like
                          features.
                        </span>
                      </div>

                    </div>

                    <p className="acne-guide-note">
                      These are AI-estimated visual categories
                      and are not a medical acne diagnosis.
                    </p>

                  </div>

                </details>

                {/* ===========================================
                    AI CONFIDENCE — SOFT RED
                =========================================== */}

                {result?.modelScore != null && (

                  <div className="confidence-explanation">

                    <span aria-hidden="true">
                      ⓘ
                    </span>

                    <p>

                      <strong>
                        What does AI Confidence mean?
                      </strong>{" "}

                      {Math.round(
                        result.modelScore * 100
                      )}% confidence means the AI was{" "}

                      {Math.round(
                        result.modelScore * 100
                      )}% confident when estimating this
                      acne-like appearance category.

                      <strong>
                        {" "}It does not mean your acne is{" "}
                        {Math.round(
                          result.modelScore * 100
                        )}% severe.
                      </strong>

                    </p>

                  </div>

                )}

              </div>

              {/* =============================================
                  SENSITIVITY
              ============================================= */}

              <div className="sensitivity-result">

                <span className="result-section-label">
                  SENSITIVITY
                </span>

                <strong className="sensitivity-result-value">
                  {sensitivityLabel(
                    result?.sensitivityScore
                  )}
                </strong>

                {result?.sensitivityScore != null ? (

                  <p>
                    Based on your sensitivity questionnaire
                    responses. Assessment score:{" "}
                    <strong>
                      {result.sensitivityScore}/4
                    </strong>.
                  </p>

                ) : (

                  <p>
                    Sensitivity was not assessed. Complete
                    the sensitivity questions during a scan
                    to include this result.
                  </p>

                )}

              </div>

              {/* =============================================
                  DISCLAIMER
              ============================================= */}

              <div className="result-disclaimer">

                <span aria-hidden="true">
                  ⌘
                </span>

                <p>
                  This AI analysis provides educational
                  wellness information only. It is not a
                  medical diagnosis.
                </p>

              </div>

              <button
                type="button"
                className="retake-button"
                onClick={openPhotoPicker}
              >
                Use another photo
              </button>

            </div>

          ) : !previewUrl ? (

            /* ===============================================
               PHOTO UPLOAD
            =============================================== */

            <div
              className="photo-drop-zone"

              onDragOver={(event) =>
                event.preventDefault()
              }

              onDrop={(event) => {
                event.preventDefault();

                choosePhoto(
                  event.dataTransfer.files?.[0]
                );
              }}
            >

              <div
                className="camera-mark"
                aria-hidden="true"
              >
                <span />
              </div>

              <span className="drop-kicker">
                ADD YOUR PHOTO
              </span>

              <h2>
                Face the camera in natural light.
              </h2>

              <p>
                Use a front-facing photo without makeup,
                filters, or harsh shadows.
              </p>

              <button
                type="button"
                onClick={openPhotoPicker}
              >
                Choose photo
              </button>

              <small>
                JPG, PNG or WebP · Maximum 5 MB
              </small>

            </div>

          ) : (

            /* ===============================================
               PHOTO PREVIEW
            =============================================== */

            <div className="photo-preview">

              <img
                src={previewUrl}
                alt="Selected skin scan preview"
              />

              <div className="preview-bar">

                <div>
                  <span>
                    PHOTO READY
                  </span>

                  <strong>
                    {photo.name}
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={openPhotoPicker}
                >
                  Change
                </button>

              </div>

            </div>

          )}

          <input
            ref={inputRef}
            className="visually-hidden-file"
            type="file"

            accept="image/jpeg,image/png,image/webp"

            capture="user"

            onChange={(event) =>
              choosePhoto(
                event.target.files?.[0]
              )
            }
          />

        </div>

        {/* ===================================================
            RIGHT GUIDANCE PANEL
        =================================================== */}

        <aside className="scan-guidance">

          <span className="guidance-label">
            {stage === "result"
              ? "ABOUT YOUR RESULT"
              : "BEFORE YOU SCAN"}
          </span>

          <h2>
            {stage === "result"
              ? "Read your AI-assisted result with care."
              : "A better photo gives a more reliable result."}
          </h2>

          {/* ===============================================
              RESULT GUIDANCE
          =============================================== */}

          {stage === "result" ? (

            <div className="result-guidance-list">

              <div>
                <span>01</span>

                <p>
                  <strong>
                    Skin Type is your primary result.
                  </strong>

                  It estimates visible skin characteristics
                  from your uploaded photo.
                </p>
              </div>

              <div>
                <span>02</span>

                <p>
                  <strong>
                    Acne-like appearance is an additional
                    observation.
                  </strong>

                  It describes visible acne-like features
                  and is not a medical diagnosis.
                </p>
              </div>

              <div>
                <span>03</span>

                <p>
                  <strong>
                    AI Confidence is not severity.
                  </strong>

                  A higher percentage means the model is
                  more confident in its prediction.
                </p>
              </div>

              <div>
                <span>04</span>

                <p>
                  <strong>
                    Sensitivity comes from your answers.
                  </strong>

                  It is assessed using the sensitivity
                  questions, not from the photo alone.
                </p>
              </div>

            </div>

          ) : (

            /* ===============================================
                BEFORE SCAN GUIDANCE
            =============================================== */

            <ul className="photo-checklist">

              <li>

                <span>01</span>

                <div>
                  <strong>
                    Natural light
                  </strong>

                  <p>
                    Stand near a window and avoid strong
                    yellow or blue lighting.
                  </p>
                </div>

              </li>

              <li>

                <span>02</span>

                <div>
                  <strong>
                    Clear, bare skin
                  </strong>

                  <p>
                    Remove makeup, glasses, and beauty
                    filters before taking the photo.
                  </p>
                </div>

              </li>

              <li>

                <span>03</span>

                <div>
                  <strong>
                    Look straight ahead
                  </strong>

                  <p>
                    Keep your face centered, close enough,
                    and fully visible.
                  </p>
                </div>

              </li>

            </ul>

          )}

          {/* ===============================================
              PRIVACY
          =============================================== */}

          <div className="privacy-note">

            <span aria-hidden="true">
              ⌘
            </span>

            <p>
              <strong>
                Your privacy matters.
              </strong>{" "}

              Your photo is processed only to generate
              this result and is not permanently stored.
            </p>

          </div>

          {error && (

            <p
              className="scan-message error"
              role="alert"
            >
              {error}
            </p>

          )}

          {notice && (

            <p
              className="scan-message notice"
              role="status"
            >
              {notice}
            </p>

          )}

          {/* ===============================================
              QUESTIONS + CONSENT + ANALYZE
          =============================================== */}

          {stage !== "result" && (

            <>

              {photo && (

                <SensitivityQuestions
                  answers={sensitivityAnswers}
                  onChange={setSensitivityAnswers}
                  disabled={
                    stage === "analyzing"
                  }
                />

              )}

              {photo && (

                <label className="scan-consent">

                  <input
                    type="checkbox"

                    checked={consent}

                    onChange={(event) =>
                      setConsent(
                        event.target.checked
                      )
                    }
                  />

                  <span>
                    I understand this result is educational,
                    not a diagnosis, and the photo is
                    processed without being saved.
                  </span>

                </label>

              )}

              <button
                type="button"
                className="analyze-button"

                disabled={
                  !photo ||
                  !consent ||
                  stage === "analyzing"
                }

                onClick={handleAnalyze}
              >

                {stage === "analyzing"
                  ? "Preparing scan..."
                  : photo
                  ? "Analyze my photo"
                  : "Add a photo to continue"}

                <span aria-hidden="true">
                  →
                </span>

              </button>

            </>

          )}

          <p className="medical-disclaimer">
            AyurAI does not diagnose medical conditions.
            Seek professional care for painful, changing,
            persistent, or worrying symptoms.
          </p>

        </aside>

      </div>

      {/* =====================================================
          RECENT SCAN HISTORY
      ===================================================== */}

      <section
        className="scan-history"
        aria-labelledby="scan-history-title"
      >

        <div className="scan-history-heading">

          <div>

            <span className="skin-scan-eyebrow">
              YOUR PROGRESS
            </span>

            <h2 id="scan-history-title">
              Recent Skin Scans
            </h2>

          </div>

          <p>
            Your photos are not stored. Only the
            educational result and scan date appear here.
          </p>

        </div>

        {historyLoading ? (

          <p className="history-empty">
            Loading your scan history…
          </p>

        ) : historyError ? (

          <p
            className="scan-message error"
            role="alert"
          >
            {historyError}
          </p>

        ) : history.length === 0 ? (

          <p className="history-empty">
            Your completed scans will appear here.
          </p>

        ) : (

          <div className="history-list">

            {history
              .slice(0, 6)
              .map((scan) => (

                <article
                  className="history-card"
                  key={scan.id}
                >

                  <div>

                    <small>
                      {new Date(
                        scan.createdAt
                      ).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </small>

                    {/* Primary history result = Skin Type */}

                    <strong>
                      {skinTypeLabel(
                        scan.skinType,
                        scan.skinTypeRequiresReview
                      )}
                    </strong>

                  </div>

                  <span>
                    SKIN TYPE
                  </span>

                  <p className="history-confidence">
                    AI Confidence:{" "}

                    <strong>
                      {confidenceLabel(
                        scan.skinTypeConfidence
                      )}
                    </strong>
                  </p>

                  <div className="history-details">

                    <p>
                      <strong>
                        Acne-like appearance:
                      </strong>{" "}

                      {scan.estimatedSkinType ||
                        "Uncertain"}
                    </p>

                    <p>
                      <strong>
                        Sensitivity:
                      </strong>{" "}

                      {sensitivityLabel(
                        scan.sensitivityScore
                      )}
                    </p>

                  </div>

                </article>

              ))}

          </div>

        )}

      </section>

    </section>
  );
};

export default SkinScanCard;