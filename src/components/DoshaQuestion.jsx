import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./DoshaQuestion.css";

import {
  saveDoshaResult,
  getAssessmentStatus,
} from "../utils/assessmentStatus";

import API_BASE_URL from "../utils/api";
import { getCurrentUserId } from "../utils/userSession";
import { getDoshaInfo } from "../utils/doshaInfo";

// =========================================================
// DOSHA QUESTIONS
// Every answer saves Vata, Pitta, or Kapha for the backend.
// =========================================================

const questions = [
  {
    question: "How would you describe your skin?",
    options: [
      {
        text: "Dry, thin or easily dehydrated",
        dosha: "Vata",
      },
      {
        text: "Sensitive, warm or prone to redness",
        dosha: "Pitta",
      },
      {
        text: "Soft, thick or naturally oily",
        dosha: "Kapha",
      },
    ],
  },
  {
    question: "How does your skin usually feel?",
    options: [
      {
        text: "Dry and sometimes rough",
        dosha: "Vata",
      },
      {
        text: "Warm and sensitive",
        dosha: "Pitta",
      },
      {
        text: "Smooth and moisturized",
        dosha: "Kapha",
      },
    ],
  },
  {
    question: "How does your skin react to the environment?",
    options: [
      {
        text: "Becomes dry in cold or windy weather",
        dosha: "Vata",
      },
      {
        text: "Becomes irritated in heat or sun",
        dosha: "Pitta",
      },
      {
        text: "Feels comfortable but can become oily",
        dosha: "Kapha",
      },
    ],
  },
  {
    question: "What is your usual skin texture?",
    options: [
      {
        text: "Fine and uneven",
        dosha: "Vata",
      },
      {
        text: "Soft with occasional sensitivity",
        dosha: "Pitta",
      },
      {
        text: "Thick and smooth",
        dosha: "Kapha",
      },
    ],
  },
  {
    question: "How does your skin usually look?",
    options: [
      {
        text: "Dull or slightly dry",
        dosha: "Vata",
      },
      {
        text: "Bright but sometimes flushed",
        dosha: "Pitta",
      },
      {
        text: "Smooth and naturally glowing",
        dosha: "Kapha",
      },
    ],
  },
  {
    question: "What is your common skin concern?",
    options: [
      {
        text: "Dryness or flaky areas",
        dosha: "Vata",
      },
      {
        text: "Redness or sensitivity",
        dosha: "Pitta",
      },
      {
        text: "Oiliness or clogged pores",
        dosha: "Kapha",
      },
    ],
  },
  {
    question: "How does your skin respond to products?",
    options: [
      {
        text: "Needs extra moisture",
        dosha: "Vata",
      },
      {
        text: "Can react easily to strong products",
        dosha: "Pitta",
      },
      {
        text: "Usually tolerates products well",
        dosha: "Kapha",
      },
    ],
  },
  {
    question: "Which description feels closest to your skin?",
    options: [
      {
        text: "Dry and delicate",
        dosha: "Vata",
      },
      {
        text: "Sensitive and warm",
        dosha: "Pitta",
      },
      {
        text: "Smooth and balanced",
        dosha: "Kapha",
      },
    ],
  },
];

// =========================================================
// DOSHA QUESTION PAGE
// =========================================================

const DoshaQuestion = () => {
  const navigate = useNavigate();
  const userId = getCurrentUserId();

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // =======================================================
  // ANSWER A QUESTION
  // =======================================================

  const handleAnswer = (dosha) => {
    if (submitting) return;

    const updatedAnswers = [...answers];

    updatedAnswers[currentQuestion] = dosha;

    setAnswers(updatedAnswers);

    // Move to the next question.
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((previous) => previous + 1);
      return;
    }

    // Last answer: save the full assessment.
    calculateResult(updatedAnswers);
  };

  // =======================================================
  // SAVE DOSHA RESULT IN SPRING BOOT + MYSQL
  // =======================================================

  const calculateResult = async (finalAnswers) => {
    if (
      finalAnswers.length !== questions.length ||
      finalAnswers.some((answer) => !answer)
    ) {
      alert(
        "Please answer all questions before completing the assessment."
      );
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/dosha-assessments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            answers: finalAnswers,
          }),
        }
      );

      if (!response.ok) {
        let errorMessage =
          "Failed to save your Dosha assessment.";

        try {
          const errorData = await response.json();

          errorMessage =
            errorData.message || errorMessage;
        } catch {
          // Keep the default error message.
        }

        throw new Error(errorMessage);
      }

      const backendResult = await response.json();

      // Keep the format used by the existing frontend status system.
      const doshaResult = {
        dominantDosha: backendResult.dominantDosha,

        scores: {
          Vata: backendResult.vataScore,
          Pitta: backendResult.pittaScore,
          Kapha: backendResult.kaphaScore,
        },

        percentages: {
          Vata: backendResult.vataPercentage,
          Pitta: backendResult.pittaPercentage,
          Kapha: backendResult.kaphaPercentage,
        },

        answers: finalAnswers,
        completed: true,
        completedAt: new Date().toISOString(),
      };

      saveDoshaResult(doshaResult);
      setResult(doshaResult);
      setFinished(true);
    } catch (error) {
      console.error("Dosha assessment error:", error);

      alert(
        error.message ||
          "Unable to save your Dosha assessment. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =======================================================
  // CONTINUE AFTER COMPLETING THE DOSHA TEST
  // =======================================================

  const handleContinue = () => {
    const status = getAssessmentStatus();

    if (status.skinScanCompleted && status.doshaCompleted) {
      navigate("/overall-result");
      return;
    }

    if (!status.skinScanCompleted) {
      navigate("/skin-scan");
      return;
    }

    navigate("/overall-result");
  };

  // =======================================================
  // PREVIOUS QUESTION
  // =======================================================

  const handleBack = () => {
    if (currentQuestion > 0 && !submitting) {
      setCurrentQuestion((previous) => previous - 1);
    }
  };

  // =======================================================
  // COMPLETED DOSHA RESULT
  // =======================================================

  if (finished && result) {
    const status = getAssessmentStatus();

    const skinScanDone = Boolean(
      status.skinScanCompleted
    );

    const bothDone =
      skinScanDone && Boolean(status.doshaCompleted);

    // Friendly labels:
    // Vata · Dry / Pitta · Sensitive / Kapha · Oily
    const dominantInfo = getDoshaInfo(
      result.dominantDosha
    );

    const vataInfo = getDoshaInfo("Vata");
    const pittaInfo = getDoshaInfo("Pitta");
    const kaphaInfo = getDoshaInfo("Kapha");

    const resultTheme =
      result.dominantDosha.toLowerCase();

    const scoreCards = [
      {
        info: vataInfo,
        percentage: result.percentages.Vata,
        className: "vata",
      },
      {
        info: pittaInfo,
        percentage: result.percentages.Pitta,
        className: "pitta",
      },
      {
        info: kaphaInfo,
        percentage: result.percentages.Kapha,
        className: "kapha",
      },
    ];

    return (
      <section
        className={`dosha-result-page dosha-${resultTheme}`}
      >
        <div className="dosha-result-card">
          <span className="dosha-result-label">
            DOSHA TEST COMPLETE
          </span>

          <h1>Your skin balance is ready</h1>

          <p className="dosha-result-intro">
            This is an educational Ayurvedic wellness
            assessment based on your answers. It is not a
            medical diagnosis.
          </p>

          {/* PRIMARY DOSHA RESULT */}

          <div className="dominant-dosha">
            <span>YOUR PRIMARY SKIN PATTERN</span>

            <strong>{dominantInfo.label}</strong>

            <p>{dominantInfo.description}</p>
          </div>

          {/* DOSHA SCORE CARDS */}

          <div className="dosha-score-grid">
            {scoreCards.map((score) => (
              <div
                className={`dosha-score-card ${score.className}`}
                key={score.info.label}
              >
                <span>{score.info.label}</span>

                <small>{score.info.shortLabel}</small>

                <strong>{score.percentage}%</strong>
              </div>
            ))}
          </div>

          {/* ASSESSMENT STATUS */}

                    {/* Shows the two completed steps clearly. */}
          <div className="dosha-assessment-status">
            <div className="dosha-status-item">
              <span className="status-check">✓</span>
              <strong>Dosha Test</strong>
              <span>Completed</span>
            </div>

            <div className="dosha-status-item">
              <span className="status-check">✓</span>
              <strong>Skin Scan</strong>
              <span>Completed</span>
            </div>
          </div>

          {/* NEXT STEP */}

          <div className="dosha-complete-message">
            <strong>
              {bothDone
                ? "Your personalized result is ready."
                : "Your Dosha Test has been saved."}
            </strong>

            <p>
              {bothDone
                ? "Your Skin Scan and Dosha Test are complete. View your personalized Overall Result next."
                : "Complete your Skin Scan next to unlock your personalized Overall Result."}
            </p>
          </div>

          {/* ACTIONS */}

          <div className="dosha-result-actions">
            <button
              type="button"
              onClick={handleContinue}
              className="dosha-primary-button"
            >
              {bothDone
                ? "VIEW OVERALL RESULT →"
                : "CONTINUE TO SKIN SCAN →"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="dosha-secondary-button"
            >
              BACK TO HOME
            </button>
          </div>
        </div>
      </section>
    );
  }

  // =======================================================
  // QUESTION SCREEN
  // =======================================================

  const question = questions[currentQuestion];

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  return (
    <section className="dosha-question-page">
      <div className="dosha-question-header">
        <span>AYURVEDIC DOSHA ASSESSMENT</span>

        <h1>Understand Your Dosha</h1>

        <p>
          Answer each question based on what feels most
          representative of you.
        </p>
      </div>

      <div className="dosha-progress-wrapper">
        <div className="dosha-progress-info">
          <span>QUESTION {currentQuestion + 1}</span>
          <span>{questions.length} QUESTIONS</span>
        </div>

        <div className="dosha-progress">
          <div style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="dosha-question-card">
        <span className="question-number">
          {String(currentQuestion + 1).padStart(2, "0")}
        </span>

        <h2>{question.question}</h2>

        <div className="dosha-options">
          {question.options.map((option, index) => (
            <button
              type="button"
              key={option.text}
              className="dosha-option"
              onClick={() => handleAnswer(option.dosha)}
              disabled={submitting}
            >
              <span className="option-number">
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="option-text">
                {option.text}
              </span>

              <span className="option-arrow">→</span>
            </button>
          ))}
        </div>

        {currentQuestion > 0 && (
          <button
            type="button"
            className="question-back-button"
            onClick={handleBack}
            disabled={submitting}
          >
            ← Previous question
          </button>
        )}
      </div>

      <p className="dosha-disclaimer">
        AyurAI provides an educational Ayurvedic assessment
        and does not provide medical diagnosis or treatment.
      </p>
    </section>
  );
};

export default DoshaQuestion;