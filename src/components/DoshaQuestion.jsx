import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DoshaQuestion.css";

const questions = [
  {
    question: "How does your skin usually feel?",
    subtitle: "Think about your skin on a normal day.",
    options: [
      { text: "Dry and sometimes tight", dosha: "vata" },
      { text: "Warm or easily sensitive", dosha: "pitta" },
      { text: "Smooth but often oily", dosha: "kapha" },
    ],
  },
  {
    question: "What happens to your skin during the day?",
    subtitle: "Choose what feels most familiar.",
    options: [
      { text: "It becomes dry and needs moisture", dosha: "vata" },
      { text: "It can become red or irritated", dosha: "pitta" },
      { text: "It becomes shiny or oily", dosha: "kapha" },
    ],
  },
  {
    question: "How does your skin react to the sun?",
    subtitle: "Consider your usual experience outdoors.",
    options: [
      { text: "It feels dry or dehydrated", dosha: "vata" },
      { text: "It becomes red or sensitive", dosha: "pitta" },
      { text: "It becomes oily or heavy", dosha: "kapha" },
    ],
  },
  {
    question: "What is your most noticeable skin concern?",
    subtitle: "Choose the concern you notice most often.",
    options: [
      { text: "Dryness or fine lines", dosha: "vata" },
      { text: "Redness or sensitivity", dosha: "pitta" },
      { text: "Oiliness or clogged pores", dosha: "kapha" },
    ],
  },
  {
    question: "How does your skin feel after cleansing?",
    subtitle: "Think about the first few minutes after washing.",
    options: [
      { text: "Tight or slightly rough", dosha: "vata" },
      { text: "Warm or sensitive", dosha: "pitta" },
      { text: "Comfortable, then oily later", dosha: "kapha" },
    ],
  },
  {
    question: "Which skin texture sounds most like yours?",
    subtitle: "Choose the description that feels closest.",
    options: [
      { text: "Fine, delicate or uneven", dosha: "vata" },
      { text: "Soft and easily reactive", dosha: "pitta" },
      { text: "Smooth, thick or firm", dosha: "kapha" },
    ],
  },
  {
    question: "What does your skin need most?",
    subtitle: "Choose the type of care you naturally reach for.",
    options: [
      { text: "Deep hydration and nourishment", dosha: "vata" },
      { text: "Cooling and calming care", dosha: "pitta" },
      { text: "Light cleansing and balancing", dosha: "kapha" },
    ],
  },
  {
    question: "Which description best represents your skin journey?",
    subtitle: "Choose the one that feels most like you.",
    options: [
      {
        text: "I am always trying to keep my skin hydrated",
        dosha: "vata",
      },
      {
        text: "I am always trying to keep my skin calm",
        dosha: "pitta",
      },
      {
        text: "I am always trying to keep my skin balanced",
        dosha: "kapha",
      },
    ],
  },
];

const doshaInfo = {
  vata: {
    name: "Vata",
    descriptor: "Dry & Delicate",
    focus: [
      "Deep hydration",
      "Gentle cleansing",
      "Moisture-locking care",
    ],
    description:
      "Your responses appear most aligned with Vata characteristics, which may suggest that hydration and gentle moisture support could be helpful areas to explore.",
  },

  pitta: {
    name: "Pitta",
    descriptor: "Sensitive & Warm",
    focus: [
      "Calming ingredients",
      "Gentle skincare",
      "Cooling hydration",
    ],
    description:
      "Your responses appear most aligned with Pitta characteristics, which may suggest that calming, gentle and cooling skincare could be helpful areas to explore.",
  },

  kapha: {
    name: "Kapha",
    descriptor: "Oily & Balanced",
    focus: [
      "Light hydration",
      "Gentle cleansing",
      "Balancing skincare",
    ],
    description:
      "Your responses appear most aligned with Kapha characteristics, which may suggest that lightweight, balancing and gentle cleansing approaches could be helpful areas to explore.",
  },
};

function DoshaQuestion() {
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const question = questions[current];

  // =====================================================
  // SELECT ANSWER
  // =====================================================

  const selectAnswer = (dosha) => {
    const updatedAnswers = [...answers, dosha];

    setAnswers(updatedAnswers);

    if (current < questions.length - 1) {
      setTimeout(() => {
        setCurrent((prev) => prev + 1);
      }, 250);
    } else {
      calculateResult(updatedAnswers);
    }
  };

  // =====================================================
  // CALCULATE RESULT
  // =====================================================

  const calculateResult = (answerList) => {
    const scores = {
      vata: 0,
      pitta: 0,
      kapha: 0,
    };

    answerList.forEach((answer) => {
      if (scores[answer] !== undefined) {
        scores[answer] += 1;
      }
    });

    const total = answerList.length;

    const percentages = {
      vata: Math.round((scores.vata / total) * 100),
      pitta: Math.round((scores.pitta / total) * 100),
      kapha: Math.round((scores.kapha / total) * 100),
    };

    const dominant = Object.keys(scores).reduce((a, b) =>
      scores[a] >= scores[b] ? a : b
    );

    const finalResult = {
      dominant,
      percentages,
      scores,
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "ayuraiDoshaResult",
      JSON.stringify(finalResult)
    );

    setResult(finalResult);
  };

  // =====================================================
  // RESTART TEST
  // =====================================================

  const restartTest = () => {
    setCurrent(0);
    setAnswers([]);
    setResult(null);
  };

  // =====================================================
  // RESULT PAGE
  // =====================================================

  if (result) {
    const info = doshaInfo[result.dominant];

    return (
      <div className="dosha-page">
        <div className="result-container">

          {/* =================================================
              RESULT HEADER
          ================================================= */}

          <div className="result-top">

            <span className="result-label">
              AYURAI • YOUR RESULT
            </span>

            <h1>
              Your Ayurvedic
              <br />
              Skin Balance
            </h1>

            <p>
              Based on your answers, this is the Dosha
              pattern your responses appear most aligned with.
            </p>

          </div>


          {/* =================================================
              DOSHA BALANCE
          ================================================= */}

          <div className="percentage-section">

            <div className="percentage-title">

              <span>
                DOSHA BALANCE
              </span>

              <small>
                An indication based on your responses
              </small>

            </div>


            <div className="dosha-balance-wrapper">

              {/* =================================================
                  DOSHA CIRCLE
              ================================================= */}

              <div
                className="dosha-donut"
                style={{
                  "--vata": `${result.percentages.vata}%`,
                  "--pitta": `${result.percentages.pitta}%`,
                  "--kapha": `${result.percentages.kapha}%`,
                }}
              >

                <div className="dosha-donut-center">

                  <span>
                    APPEARS MOST ALIGNED
                  </span>

                  <strong>
                    {info.name}
                  </strong>

                  <small>
                    {result.percentages[result.dominant]}%
                  </small>

                </div>

              </div>


              {/* =================================================
                  LEGEND
              ================================================= */}

              <div className="dosha-legend">

                <div className="legend-item">

                  <span className="legend-dot vata-dot"></span>

                  <div>
                    <strong>
                      Vata
                    </strong>

                    <span>
                      Dry & Delicate • {result.percentages.vata}%
                    </span>
                  </div>

                </div>


                <div className="legend-item">

                  <span className="legend-dot pitta-dot"></span>

                  <div>
                    <strong>
                      Pitta
                    </strong>

                    <span>
                      Sensitive & Warm • {result.percentages.pitta}%
                    </span>
                  </div>

                </div>


                <div className="legend-item">

                  <span className="legend-dot kapha-dot"></span>

                  <div>
                    <strong>
                      Kapha
                    </strong>

                    <span>
                      Oily & Balanced • {result.percentages.kapha}%
                    </span>
                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              RESULT INTERPRETATION
          ================================================= */}

          <div className="dominant-dosha">

          
            <p>
              Your responses appear most aligned with{" "}
              <strong>
                {info.name}
              </strong>{" "}
              at approximately{" "}
              <strong>
                {result.percentages[result.dominant]}%
              </strong>
              .
            </p>

            <div className="interpretation-box">

              <span className="interpretation-icon">
                ⌘
              </span>

              <p>
                {info.description}
              </p>

            </div>

          </div>


          {/* =================================================
              PERSONALIZED CARE
          ================================================= */}

          <div className="care-section">

            <span className="result-small-label">
              PERSONALIZED CARE
            </span>

            <h2>
              What You May Want to Explore
            </h2>

            <p className="care-intro">
              Based on your result, these Ayurvedic-inspired
              skincare approaches may be worth exploring.
            </p>


            <div className="care-grid">

              {info.focus.map((item, index) => (

                <div
                  className="care-card"
                  key={item}
                >

                  <span>
                    0{index + 1}
                  </span>

                  <h3>
                    {item}
                  </h3>

                  <p>
                    A gentle approach that may complement
                    your {info.name}-aligned skin balance.
                  </p>

                </div>

              ))}

            </div>

          </div>


          {/* =================================================
              RESULT CONFIDENCE NOTE
          ================================================= */}

          <div className="result-disclaimer-card">

            <span>
              ⌘ AI-ASSISTED INSIGHT
            </span>

            <p>
              This result is an indication based on the
              information you provided. Skin characteristics
              can change over time, and this assessment
              should not be considered a medical diagnosis
              or a definitive determination of your skin type.
            </p>

          </div>


          {/* =================================================
              ACTION BUTTONS
          ================================================= */}

          <div className="result-actions">

            <button
              className="primary-result-button"
              onClick={() => navigate("/profile")}
            >
              View My Profile →
            </button>

            <button
              className="secondary-result-button"
              onClick={restartTest}
            >
              Retake Test
            </button>

          </div>


          {/* =================================================
              DISCLAIMER
          ================================================= */}

          <p className="result-note">
            AyurAI provides Ayurvedic-inspired wellness
            guidance for informational purposes only.
          </p>

        </div>
      </div>
    );
  }


  // =====================================================
  // QUIZ PAGE
  // =====================================================

  return (
    <div className="dosha-page">

      <div className="quiz-container">

        {/* =================================================
            QUIZ HEADER
        ================================================= */}

        <div className="quiz-top">

          <span className="quiz-label">
            AYURAI • AYURVEDIC DISCOVERY
          </span>

          <h1>
            Discover Your
            <br />

            <span>
              Skin Balance
            </span>
          </h1>

          <p>
            Answer a few thoughtful questions and explore
            which Ayurvedic Dosha pattern your skin responses
            may be most aligned with.
          </p>

        </div>


        {/* =================================================
            PROGRESS
        ================================================= */}

        <div className="progress-area">

          <div className="progress-info">

            <span>
              QUESTION {current + 1}
            </span>

            <span>
              {questions.length} QUESTIONS
            </span>

          </div>

          <div className="progress-track">

            <div
              className="progress-fill"
              style={{
                width: `${((current + 1) / questions.length) * 100}%`,
              }}
            />

          </div>

        </div>


        {/* =================================================
            QUESTION CARD
        ================================================= */}

        <div className="question-card">

          <div className="question-number">
            {String(current + 1).padStart(2, "0")}
          </div>


          <div className="question-content">

            <span className="question-label">
              YOUR SKIN • QUESTION {current + 1}
            </span>

            <h2>
              {question.question}
            </h2>

            <p>
              {question.subtitle}
            </p>

          </div>


          {/* =================================================
              ANSWERS
          ================================================= */}

          <div className="answer-list">

            {question.options.map((option, index) => (

              <button
                className="answer-button"
                key={option.dosha}
                onClick={() => selectAnswer(option.dosha)}
              >

                <span className="answer-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="answer-text">
                  {option.text}
                </span>

                <span className="answer-arrow">
                  →
                </span>

              </button>

            ))}

          </div>

        </div>


        {/* =================================================
            QUIZ FOOTER
        ================================================= */}

        <div className="quiz-footer">

          <span>
            ⌘ Take your time
          </span>

          <span>
            AyurAI • Inspired by Ayurveda
          </span>

        </div>

      </div>

    </div>
  );
}

export default DoshaQuestion;