import React from "react";
import { useNavigate } from "react-router-dom";
import "./HowItWorks.css";

const steps = [
  {
    number: "01",
    icon: "◈",
    title: "Skin Scan",
    description:
      "Upload a clear face photo for an educational acne-severity estimate.",
    action: "/skin-scan",
    button: "Start Skin Scan",
  },
  {
    number: "02",
    icon: "☯",
    title: "Dosha Test",
    description:
      "Answer a short questionnaire to learn your Ayurvedic wellness pattern.",
    action: "/dosha-test",
    button: "Take Dosha Test",
  },
  {
    number: "03",
    icon: "→",
    title: "Review Your Results",
    description:
      "Review your two independent results, then explore optional wellness ideas.",
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
          Use the AI Skin Scan for an acne-like severity estimate and the
          separate Dosha Test for educational Ayurvedic wellness guidance.
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
