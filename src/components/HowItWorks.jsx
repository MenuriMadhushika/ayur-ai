import React from "react";
import { useNavigate } from "react-router-dom";
import "./HowItWorks.css";

const steps = [
  {
    number: "01",
    icon: "💆‍♀️",
    title: "Skin Profile",
    description:
      "Choose the skin type that best describes how your skin feels on most days.",
    action: "/skin-scan",
    button: "Start Skin Profile",
  },
  {
    number: "02",
    icon: "🔮",
    title: "Dosha Test",
    description:
      "Answer a short questionnaire to learn your Ayurvedic wellness pattern.",
    action: "/dosha-test",
    button: "Take Dosha Test",
  },
  {
    number: "03",
    icon: "🎯",
    title: "Your Result & Remedies",
    description:
      "Complete both steps, then see your combined result and matched home remedies.",
    action: "/overall-result",
    button: "View My Result",
  },
];

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <section className="how-it-works">

      {/* =====================================
          SECTION HEADER
      ===================================== */}
      <div className="how-header">

        <span className="how-eyebrow">
          YOUR AYURVEDIC JOURNEY
        </span>

        <h2>
          How <span>AyurAI</span> Works
        </h2>

        <p>
          From understanding your skin to discovering personalized
          Ayurvedic care, AyurAI guides you through every step.
        </p>

      </div>


      {/* =====================================
          STEPS
      ===================================== */}
      <div className="how-steps">

        {steps.map((step, index) => (

          <React.Fragment key={step.number}>

            <button
              type="button"
              className="how-step"
              onClick={() => navigate(step.action)}
            >

              {/* Number */}
              <span className="how-number">
                {step.number}
              </span>


              {/* Icon */}
              <div className="how-icon">
                {step.icon}
              </div>


              {/* Content */}
              <div className="how-content">

                <h3>
                  {step.title}
                </h3>

                <p>
                  {step.description}
                </p>

                <span className="how-link">
                  {step.button}
                  <strong>→</strong>
                </span>

              </div>

            </button>


            {/* Connector */}
            {index < steps.length - 1 && (
              <div className="how-connector">
                <span>→</span>
              </div>
            )}

          </React.Fragment>

        ))}

      </div>

    </section>
  );
};

export default HowItWorks;
