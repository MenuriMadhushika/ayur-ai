import React, { useState } from "react";
import ProductRecommendations from "./ProductRecommendations";

// =====================================================
// ICONS
// =====================================================

const WindIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="#C9A24A" strokeWidth="1.5" strokeLinecap="round">
    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
    <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
    <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
  </svg>
);

const DropletIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="#C9A24A" strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
  </svg>
);

const DesertIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="#C9A24A" strokeWidth="1.5" strokeLinecap="round">
    <path d="M2 20h20" />
    <path d="M6 20c1-3 3-5 6-5s5 2 6 5" />
    <path d="M12 9v6" />
  </svg>
);

const LeafFallIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="#C9A24A" strokeWidth="1.5" strokeLinecap="round">
    <path d="M11 20A9 9 0 0 1 2 11C2 6 6 2 11 2c5 0 9 4 9 9 0 5-4 9-9 9z" />
    <path d="M2 2l18 18" />
  </svg>
);

const FeatherIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="#C9A24A" strokeWidth="1.5" strokeLinecap="round">
    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L3 13v5h5l9.88-9.88z" />
    <path d="M16 8L2 22" />
  </svg>
);

const FlameIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="#C9A24A" strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 2c1.5 3 2.5 5 2.5 7.5A4.5 4.5 0 0 1 10 14a4.5 4.5 0 0 1-4.5-4.5C5.5 7 6.5 5 8 2" />
    <path d="M12 22a9 9 0 0 0 9-9c0-4.5-3.5-7.5-6-10" />
  </svg>
);

const FlowerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="#C9A24A" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3a3 3 0 0 0-3 3v3h6V6a3 3 0 0 0-3-3z" />
    <path d="M12 21a3 3 0 0 0 3-3v-3H9v3a3 3 0 0 0 3 3z" />
    <path d="M3 12a3 3 0 0 0 3 3h3V9H6a3 3 0 0 0-3 3z" />
    <path d="M21 12a3 3 0 0 0-3-3h-3v6h3a3 3 0 0 0 3-3z" />
  </svg>
);

const SunIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="#C9A24A" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
  </svg>
);

const ShieldCalmIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="#C9A24A" strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const SproutIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="#C9A24A" strokeWidth="1.5" strokeLinecap="round">
    <path d="M7 20h10" />
    <path d="M12 20v-8" />
    <path d="M12 12a5 5 0 0 1 5-5c0 3-2 5-5 5z" />
    <path d="M12 12a5 5 0 0 0-5-5c0 3 2 5 5 5z" />
  </svg>
);

const WavesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="#C9A24A" strokeWidth="1.5" strokeLinecap="round">
    <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
    <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
  </svg>
);

const SparklesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="#C9A24A" strokeWidth="1.5" strokeLinecap="round">
    <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
  </svg>
);

const BalanceLeafIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="#C9A24A" strokeWidth="1.5" strokeLinecap="round">
    <path d="M11 20A9 9 0 0 1 2 11C2 6 6 2 11 2c5 0 9 4 9 9 0 5-4 9-9 9z" />
    <path d="M11 2v18" />
  </svg>
);

const GridIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="#C9A24A" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

// =====================================================
// QUESTIONS
// =====================================================

const doshaQuestions = [
  {
    id: 1,
    question: "How does your skin usually feel?",
    options: [
      {
        id: "vata",
        title: "Dry",
        description: "Rough, flaky or dehydrated",
        dosha: "vata",
        icon: <WindIcon />,
      },
      {
        id: "pitta",
        title: "Sensitive",
        description: "Warm, red or reactive",
        dosha: "pitta",
        icon: <FlameIcon />,
      },
      {
        id: "kapha",
        title: "Oily",
        description: "Smooth, shiny or congested",
        dosha: "kapha",
        icon: <WavesIcon />,
      },
    ],
  },

  {
    id: 2,
    question: "What is your main skin concern?",
    options: [
      {
        id: "vata",
        title: "Dehydration",
        description: "Dryness & fine lines",
        dosha: "vata",
        icon: <DropletIcon />,
      },
      {
        id: "pitta",
        title: "Redness",
        description: "Irritation & breakouts",
        dosha: "pitta",
        icon: <FlowerIcon />,
      },
      {
        id: "kapha",
        title: "Oil & Pores",
        description: "Shine & enlarged pores",
        dosha: "kapha",
        icon: <SparklesIcon />,
      },
    ],
  },

  {
    id: 3,
    question: "How does your skin react to sunlight?",
    options: [
      {
        id: "vata",
        title: "Gets Dry",
        description: "Feels dehydrated or dull",
        dosha: "vata",
        icon: <DesertIcon />,
      },
      {
        id: "pitta",
        title: "Gets Red",
        description: "Burns or becomes irritated",
        dosha: "pitta",
        icon: <SunIcon />,
      },
      {
        id: "kapha",
        title: "Gets Oily",
        description: "Produces more oil",
        dosha: "kapha",
        icon: <DropletIcon />,
      },
    ],
  },

  {
    id: 4,
    question: "How does your skin feel after washing?",
    options: [
      {
        id: "vata",
        title: "Tight",
        description: "Dry or rough feeling",
        dosha: "vata",
        icon: <LeafFallIcon />,
      },
      {
        id: "pitta",
        title: "Sensitive",
        description: "Warm or irritated",
        dosha: "pitta",
        icon: <ShieldCalmIcon />,
      },
      {
        id: "kapha",
        title: "Comfortable",
        description: "Becomes oily later",
        dosha: "kapha",
        icon: <BalanceLeafIcon />,
      },
    ],
  },

  {
    id: 5,
    question: "How does your skin behave during the day?",
    options: [
      {
        id: "vata",
        title: "Dry",
        description: "Needs more moisture",
        dosha: "vata",
        icon: <WindIcon />,
      },
      {
        id: "pitta",
        title: "Reactive",
        description: "Can become red easily",
        dosha: "pitta",
        icon: <FlameIcon />,
      },
      {
        id: "kapha",
        title: "Shiny",
        description: "Produces excess oil",
        dosha: "kapha",
        icon: <WavesIcon />,
      },
    ],
  },

  {
    id: 6,
    question: "What happens when you get a breakout?",
    options: [
      {
        id: "vata",
        title: "Dry & Flaky",
        description: "Skin around it feels dry",
        dosha: "vata",
        icon: <LeafFallIcon />,
      },
      {
        id: "pitta",
        title: "Red & Inflamed",
        description: "Sensitive or painful",
        dosha: "pitta",
        icon: <FlameIcon />,
      },
      {
        id: "kapha",
        title: "Clogged",
        description: "Blackheads or congestion",
        dosha: "kapha",
        icon: <GridIcon />,
      },
    ],
  },

  {
    id: 7,
    question: "Which skin texture describes you best?",
    options: [
      {
        id: "vata",
        title: "Delicate",
        description: "Thin and uneven",
        dosha: "vata",
        icon: <FeatherIcon />,
      },
      {
        id: "pitta",
        title: "Soft",
        description: "Sensitive and reactive",
        dosha: "pitta",
        icon: <FlowerIcon />,
      },
      {
        id: "kapha",
        title: "Smooth",
        description: "Thick and firm",
        dosha: "kapha",
        icon: <BalanceLeafIcon />,
      },
    ],
  },

  {
    id: 8,
    question: "What does your skin need most?",
    options: [
      {
        id: "vata",
        title: "Hydration",
        description: "Nourishing moisture",
        dosha: "vata",
        icon: <DropletIcon />,
      },
      {
        id: "pitta",
        title: "Calming",
        description: "Cooling & soothing care",
        dosha: "pitta",
        icon: <SproutIcon />,
      },
      {
        id: "kapha",
        title: "Balancing",
        description: "Light cleansing care",
        dosha: "kapha",
        icon: <BalanceLeafIcon />,
      },
    ],
  },
];

// =====================================================
// COMPONENT
// =====================================================

const DoshaQuestion = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const [scores, setScores] = useState({
    vata: 0,
    pitta: 0,
    kapha: 0,
  });

  const [result, setResult] = useState(null);

  // ===================================================
  // OPTION SELECT
  // ===================================================

  const handleOptionSelect = (dosha) => {
    const updatedScores = {
      ...scores,
      [dosha]: scores[dosha] + 1,
    };

    setScores(updatedScores);

    if (currentStep + 1 < doshaQuestions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      calculateResult(updatedScores);
    }
  };

  // ===================================================
  // CALCULATE RESULT
  // ===================================================

  const calculateResult = (finalScores) => {
    const total = doshaQuestions.length;

    const pittaPct = Math.round(
      (finalScores.pitta / total) * 100
    );

    const vataPct = Math.round(
      (finalScores.vata / total) * 100
    );

    const kaphaPct = Math.round(
      (finalScores.kapha / total) * 100
    );

    let dominant = "Pitta";

    let recommendation =
      "Your skin shows signs of Pitta imbalance. Focus on calming, hydrating and cooling skincare rituals.";

    if (
      vataPct >= pittaPct &&
      vataPct >= kaphaPct
    ) {
      dominant = "Vata";

      recommendation =
        "Your skin shows signs of Vata imbalance. Focus on rich, deeply nourishing and moisture-locking skincare rituals.";
    } else if (
      kaphaPct >= pittaPct &&
      kaphaPct >= vataPct
    ) {
      dominant = "Kapha";

      recommendation =
        "Your skin shows signs of Kapha imbalance. Focus on purifying, clarifying and balancing skincare rituals.";
    }

    // =================================================
    // SAVE RESULT
    // =================================================

    const doshaResult = {
      dominant,
      recommendation,

      percentages: {
        pitta: pittaPct,
        vata: vataPct,
        kapha: kaphaPct,
      },

      completedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "ayuraiDoshaResult",
      JSON.stringify(doshaResult)
    );

    setResult(doshaResult);
  };

  // ===================================================
  // RESET QUIZ
  // ===================================================

  const resetQuiz = () => {
    setScores({
      vata: 0,
      pitta: 0,
      kapha: 0,
    });

    setCurrentStep(0);

    setResult(null);
  };

  const currentQ = doshaQuestions[currentStep];

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="dosha-quiz-card">

      {!result ? (

        <div className="quiz-content">

          {/* HEADER */}

          <div className="quiz-header">

            <span className="step-indicator">
              Question {currentStep + 1} of{" "}
              {doshaQuestions.length}
            </span>

            <div className="quiz-progress">

              <div
                className="quiz-progress-bar"
                style={{
                  width: `${
                    ((currentStep + 1) /
                      doshaQuestions.length) *
                    100
                  }%`,
                }}
              />

            </div>

            <h2>
              {currentQ.question}
            </h2>

          </div>

          {/* OPTIONS */}

          <div className="options-grid">

            {currentQ.options.map((option) => (

              <button
                key={option.id}
                className="quiz-option-btn"
                onClick={() =>
                  handleOptionSelect(option.dosha)
                }
              >

                <div className="option-icon-wrapper">
                  {option.icon}
                </div>

                <div className="option-text">

                  <strong>
                    {option.title}
                  </strong>

                  <p>
                    {option.description}
                  </p>

                </div>

                <span className="option-arrow">
                  →
                </span>

              </button>

            ))}

          </div>

        </div>

      ) : (

        <div className="quiz-results">

          <span className="result-label">
            YOUR AYURVEDIC PROFILE
          </span>

          <h2>
            Your Primary Dosha:
            <span className="highlight-gold">
              {" "}
              {result.dominant}
            </span>
          </h2>

          {/* DOSHA BREAKDOWN */}

          <div className="dosha-breakdown">

            <div className="dosha-stat">

              <span className="dosha-name">
                Vata
              </span>

              <span className="dosha-pct">
                {result.percentages.vata}%
              </span>

              <div className="dosha-bar">
                <div
                  style={{
                    width: `${result.percentages.vata}%`,
                  }}
                />
              </div>

            </div>

            <div className="dosha-stat">

              <span className="dosha-name">
                Pitta
              </span>

              <span className="dosha-pct">
                {result.percentages.pitta}%
              </span>

              <div className="dosha-bar">
                <div
                  style={{
                    width: `${result.percentages.pitta}%`,
                  }}
                />
              </div>

            </div>

            <div className="dosha-stat">

              <span className="dosha-name">
                Kapha
              </span>

              <span className="dosha-pct">
                {result.percentages.kapha}%
              </span>

              <div className="dosha-bar">
                <div
                  style={{
                    width: `${result.percentages.kapha}%`,
                  }}
                />
              </div>

            </div>

          </div>

          {/* RECOMMENDATION */}

          <div className="recommendation-box">

            <span>
              ✦ PERSONALIZED GUIDANCE
            </span>

            <p>
              {result.recommendation}
            </p>

          </div>

          {/* PRODUCTS */}

          <ProductRecommendations
            dosha={result.dominant}
          />

          {/* RETAKE */}

          <button
            className="btn-primary"
            onClick={resetQuiz}
          >
            Retake Analysis
          </button>

        </div>

      )}

    </div>
  );
};

export default DoshaQuestion;