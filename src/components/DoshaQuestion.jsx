import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DoshaQuestion.css";

import {
  saveDoshaResult,
  getAssessmentStatus,
} from "../utils/assessmentStatus";

import API_BASE_URL from "../utils/api";

/* =========================================================
   QUESTIONS
   ========================================================= */

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

/* =========================================================
   DOSHA QUESTION COMPONENT
   ========================================================= */

const DoshaQuestion = () => {

  const navigate = useNavigate();

  /*
   * Temporary user ID.
   * We will replace this with the authenticated
   * user's ID when login/JWT is implemented.
   */
  const userId = 5;

  /* =====================================================
     STATE
     ===================================================== */

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] =
    useState([]);

  const [finished, setFinished] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const [submitting, setSubmitting] =
    useState(false);

  /* =====================================================
     ANSWER QUESTION
     ===================================================== */

  const handleAnswer = (dosha) => {

    /*
     * Prevent another click while the
     * final answer is being submitted.
     */
    if (submitting) {
      return;
    }

    const updatedAnswers = [
      ...answers,
    ];

    updatedAnswers[currentQuestion] =
      dosha;

    setAnswers(updatedAnswers);

    /* Move to next question */

    if (
      currentQuestion <
      questions.length - 1
    ) {

      setCurrentQuestion(
        (previous) =>
          previous + 1
      );

      return;
    }

    /* Last question */

    calculateResult(
      updatedAnswers
    );
  };

  /* =====================================================
     SEND RESULT TO BACKEND
     ===================================================== */

  const calculateResult = async (
    finalAnswers
  ) => {

    /*
     * Make sure all 8 questions
     * have been answered.
     */
    if (
      finalAnswers.length !==
      questions.length
    ) {

      alert(
        "Please answer all questions before completing the assessment."
      );

      return;
    }

    /*
     * Make sure there are no empty answers.
     */
    if (
      finalAnswers.some(
        (answer) => !answer
      )
    ) {

      alert(
        "Please answer all questions before completing the assessment."
      );

      return;
    }

    setSubmitting(true);

    try {

      /* =================================================
         SEND ANSWERS TO SPRING BOOT
         ================================================= */

      const response = await fetch(
        `${API_BASE_URL}/dosha-assessments`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId: userId,
            answers: finalAnswers,
          }),
        }
      );

      /* =================================================
         HANDLE HTTP ERROR
         ================================================= */

      if (!response.ok) {

        let errorMessage =
          "Failed to save Dosha assessment.";

        try {

          const errorData =
            await response.json();

          if (
            errorData.message
          ) {

            errorMessage =
              errorData.message;

          }

        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(
          errorMessage
        );
      }

      /* =================================================
         READ BACKEND RESPONSE
         ================================================= */

      const backendResult =
        await response.json();

      console.log(
        "Dosha backend result:",
        backendResult
      );

      /* =================================================
         CONVERT BACKEND RESULT TO
         EXISTING FRONTEND FORMAT
         ================================================= */

      const doshaResult = {

        dominantDosha:
          backendResult.dominantDosha,

        scores: {

          Vata:
            backendResult.vataScore,

          Pitta:
            backendResult.pittaScore,

          Kapha:
            backendResult.kaphaScore,

        },

        percentages: {

          Vata:
            backendResult.vataPercentage,

          Pitta:
            backendResult.pittaPercentage,

          Kapha:
            backendResult.kaphaPercentage,

        },

        answers:
          finalAnswers,

        completed: true,

        completedAt:
          new Date().toISOString(),

      };

      /* =================================================
         KEEP FRONTEND ASSESSMENT STATUS
         ================================================= */

      saveDoshaResult(
        doshaResult
      );

      /* =================================================
         DISPLAY RESULT
         ================================================= */

      setResult(
        doshaResult
      );

      setFinished(true);

    } catch (error) {

      console.error(
        "Dosha assessment error:",
        error
      );

      alert(
        error.message ||
        "Unable to save your Dosha assessment. Please try again."
      );

    } finally {

      setSubmitting(false);

    }
  };

  /* =====================================================
     CONTINUE AFTER RESULT
     ===================================================== */

  const handleContinue = () => {

    const status =
      getAssessmentStatus();

    /* Both complete */

    if (
      status.skinScanCompleted &&
      status.doshaCompleted
    ) {

      navigate(
        "/overall-result"
      );

      return;
    }

    /* Skin Scan missing */

    if (
      !status.skinScanCompleted
    ) {

      navigate(
        "/skin-scan"
      );

      return;
    }

    /* Safety fallback */

    navigate(
      "/overall-result"
    );
  };

  /* =====================================================
     PREVIOUS QUESTION
     ===================================================== */

  const handleBack = () => {

    if (
      currentQuestion > 0 &&
      !submitting
    ) {

      setCurrentQuestion(
        (previous) =>
          previous - 1
      );

    }
  };

  /* =====================================================
     COMPLETED RESULT SCREEN
     ===================================================== */

  if (
    finished &&
    result
  ) {

    const status =
      getAssessmentStatus();

    const skinScanDone =
      Boolean(
        status.skinScanCompleted
      );

    const doshaDone =
      Boolean(
        status.doshaCompleted
      );

    const bothDone =
      skinScanDone &&
      doshaDone;

    return (

      <section className="dosha-result-page">

        <div className="dosha-result-card">

          <span className="dosha-result-label">
            DOSHA TEST COMPLETE
          </span>

          <h1>
            Your AI-estimated Dosha Profile
          </h1>

          <p className="dosha-result-intro">
            Your responses suggest the following
            dominant Dosha pattern. This is an
            educational Ayurvedic assessment,
            not a medical diagnosis.
          </p>

          {/* DOMINANT DOSHA */}

          <div className="dominant-dosha">

            <span>
              DOMINANT DOSHA
            </span>

            <strong>
              {result.dominantDosha}
            </strong>

          </div>

          {/* SCORES */}

          <div className="dosha-score-grid">

            <div className="dosha-score-card">

              <span>
                VATA
              </span>

              <strong>
                {result.percentages.Vata}%
              </strong>

            </div>

            <div className="dosha-score-card">

              <span>
                PITTA
              </span>

              <strong>
                {result.percentages.Pitta}%
              </strong>

            </div>

            <div className="dosha-score-card">

              <span>
                KAPHA
              </span>

              <strong>
                {result.percentages.Kapha}%
              </strong>

            </div>

          </div>

          {/* ASSESSMENT STATUS */}

          <div className="dosha-assessment-status">

            {/* DOSHA */}

            <div className="dosha-status-item completed">

              <span className="status-check">
                ✓
              </span>

              <div>

                <strong>
                  Dosha Test
                </strong>

                <small>
                  Completed
                </small>

              </div>

            </div>

            {/* SKIN */}

            <div
              className={`dosha-status-item ${
                skinScanDone
                  ? "completed"
                  : "required"
              }`}
            >

              <span className="status-check">

                {skinScanDone
                  ? "✓"
                  : "02"}

              </span>

              <div>

                <strong>
                  Skin Scan
                </strong>

                <small>

                  {skinScanDone
                    ? "Completed"
                    : "Still required"}

                </small>

              </div>

            </div>

          </div>

          {/* MESSAGE */}

          <div className="dosha-complete-message">

            <strong>

              {bothDone
                ? "Your Ayurvedic assessment is complete."
                : "Your Dosha Test has been saved."}

            </strong>

            <p>

              {bothDone

                ? "Your Skin Scan and Dosha Test are both complete. You can now view your Overall Result."

                : "Complete your Skin Scan to combine both assessments and unlock your Overall Result."}

            </p>

          </div>

          {/* ACTIONS */}

          <div className="dosha-result-actions">

            <button
              type="button"
              onClick={
                handleContinue
              }
              className="dosha-primary-button"
            >

              {bothDone
                ? "VIEW OVERALL RESULT →"
                : "CONTINUE TO SKIN SCAN →"}

            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/")
              }
              className="dosha-secondary-button"
            >
              BACK TO HOME
            </button>

          </div>

        </div>

      </section>

    );
  }

  /* =====================================================
     QUESTION SCREEN
     ===================================================== */

  const question =
    questions[currentQuestion];

  const progress =
    ((currentQuestion + 1) /
      questions.length) *
    100;

  return (

    <section className="dosha-question-page">

      {/* HEADER */}

      <div className="dosha-question-header">

        <span>
          AYURVEDIC DOSHA ASSESSMENT
        </span>

        <h1>
          Understand Your Dosha
        </h1>

        <p>
          Answer each question based on what feels
          most representative of you.
        </p>

      </div>

      {/* PROGRESS */}

      <div className="dosha-progress-wrapper">

        <div className="dosha-progress-info">

          <span>
            QUESTION {currentQuestion + 1}
          </span>

          <span>
            {questions.length} QUESTIONS
          </span>

        </div>

        <div className="dosha-progress">

          <div
            style={{
              width:
                `${progress}%`,
            }}
          />

        </div>

      </div>

      {/* QUESTION CARD */}

      <div className="dosha-question-card">

        <span className="question-number">

          {String(
            currentQuestion + 1
          ).padStart(2, "0")}

        </span>

        <h2>
          {question.question}
        </h2>

        <div className="dosha-options">

          {question.options.map(
            (option, index) => (

              <button
                type="button"
                key={index}
                className="dosha-option"
                onClick={() =>
                  handleAnswer(
                    option.dosha
                  )
                }
                disabled={submitting}
              >

                <span className="option-number">

                  {String(
                    index + 1
                  ).padStart(2, "0")}

                </span>

                <span className="option-text">

                  {option.text}

                </span>

                <span className="option-arrow">
                  →
                </span>

              </button>

            )
          )}

        </div>

        {/* PREVIOUS */}

        {currentQuestion > 0 && (

          <button
            type="button"
            className="question-back-button"
            onClick={
              handleBack
            }
            disabled={submitting}
          >

            ← Previous question

          </button>

        )}

      </div>

      {/* DISCLAIMER */}

      <p className="dosha-disclaimer">

        AyurAI provides an educational Ayurvedic
        assessment and does not provide medical
        diagnosis or treatment.

      </p>

    </section>

  );
};

/* =========================================================
   DEFAULT EXPORT
   ========================================================= */

export default DoshaQuestion;