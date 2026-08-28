import React from "react";
import { useNavigate } from "react-router-dom";
import "./HowItWorks.css";

const steps = [
  {
    number: "01",
    icon: "🌿",
    title: "Discover",
    description:
      "Begin your AyurAI journey by understanding your skin and natural Ayurvedic balance.",
    action: "/dosha-test",
    button: "Discover Dosha",
  },
  {
    number: "02",
    icon: "✨",
    title: "AI Skin Scan",
    description:
      "Upload your skin image and let AyurAI analyze visible skin characteristics.",
    action: "/skin-scan",
    button: "Start Skin Scan",
  },
  {
    number: "03",
    icon: "🧘",
    title: "Find Your Balance",
    description:
      "Understand your dominant Dosha and how it may relate to your skin needs.",
    action: "/dosha-test",
    button: "Take Dosha Test",
  },
  {
    number: "04",
    icon: "🍯",
    title: "Personalized Care",
    description:
      "Explore Ayurvedic home remedies and care suggestions suited to your results.",
    action: "/home-remedies",
    button: "View Remedies",
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