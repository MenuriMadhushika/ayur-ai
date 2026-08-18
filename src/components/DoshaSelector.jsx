import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./DoshaSelector.css";

const DoshaSelector = () => {

  const [selectedDosha, setSelectedDosha] = useState(null);

  const doshas = [
    {
      id: "vata",
      name: "VATA",
      icon: "🌬️",
      element: "AIR & SPACE",
      type: "Dry & Delicate",
      description:
        "Vata skin tends to feel dry, delicate and dehydrated.",
      care: "Hydration • Nourishment • Gentle Care",
    },
    {
      id: "pitta",
      name: "PITTA",
      icon: "🔥",
      element: "FIRE & WATER",
      type: "Sensitive & Reactive",
      description:
        "Pitta skin can be warm, sensitive and prone to redness.",
      care: "Cooling • Soothing • Calming Care",
    },
    {
      id: "kapha",
      name: "KAPHA",
      icon: "🌿",
      element: "EARTH & WATER",
      type: "Oily & Congested",
      description:
        "Kapha skin often produces more oil and may become congested.",
      care: "Balancing • Clarifying • Lightweight Care",
    },
  ];

  return (
    <div className="dosha-wrapper">

      <div className="dosha-grid">

        {doshas.map((dosha) => {

          const selected = selectedDosha === dosha.id;

          return (
            <div
              key={dosha.id}
              className={`dosha-card ${
                selected ? "selected" : ""
              }`}
              onClick={() => setSelectedDosha(dosha.id)}
            >

              <div className="dosha-card-top">
                <span className="dosha-icon">
                  {dosha.icon}
                </span>

                <span className="dosha-element">
                  {dosha.element}
                </span>
              </div>

              <div className="dosha-name">
                {dosha.name}
              </div>

              <div className="dosha-type">
                {dosha.type}
              </div>

              <p>
                {dosha.description}
              </p>

              <div className="dosha-care">
                {dosha.care}
              </div>

              <button className="dosha-explore">
                {selected ? "Selected ✓" : "Explore →"}
              </button>

            </div>
          );
        })}

      </div>

      {selectedDosha && (
        <div className="dosha-result">

          <div>

            <span className="result-label">
              YOUR CURRENT SELECTION
            </span>

            <h3>
              {doshas.find(
                (d) => d.id === selectedDosha
              )?.name}
            </h3>

            <p>
              Ready to discover your personalized
              Ayurvedic skin profile?
            </p>

          </div>

          <Link
            to="/dosha-test"
            className="result-button"
          >
            Take Full Dosha Test →
          </Link>

        </div>
      )}

    </div>
  );
};

export default DoshaSelector;