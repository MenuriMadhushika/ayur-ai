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
      type: "Ayurvedic wellness pattern",
      description:
        "Vata is traditionally associated with movement, lightness, and change. This wellness pattern is separate from the AI Skin Scan.",
      care: "Grounding • Nourishment • Gentle routines",
      accent: "vata",
    },
    {
      id: "pitta",
      name: "PITTA",
      icon: "🔥",
      element: "FIRE & WATER",
      type: "Ayurvedic wellness pattern",
      description:
        "Pitta is traditionally associated with warmth, focus, and transformation. This wellness pattern is separate from the AI Skin Scan.",
      care: "Cooling • Steady • Calming routines",
      accent: "pitta",
    },
    {
      id: "kapha",
      name: "KAPHA",
      icon: "🌿",
      element: "EARTH & WATER",
      type: "Ayurvedic wellness pattern",
      description:
        "Kapha is traditionally associated with steadiness, nourishment, and calm. This wellness pattern is separate from the AI Skin Scan.",
      care: "Refreshing • Balanced • Consistent routines",
      accent: "kapha",
    },
  ];

  const selectedData = doshas.find(
    (dosha) => dosha.id === selectedDosha
  );

  return (
    <div className="dosha-wrapper">

      {/* =========================================
          DOSHA CARDS
      ========================================= */}

      <div className="dosha-grid">

        {doshas.map((dosha) => {
          const selected = selectedDosha === dosha.id;

          return (
            <div
              key={dosha.id}
              className={`dosha-card ${dosha.accent} ${
                selected ? "selected" : ""
              }`}
              onClick={() => setSelectedDosha(dosha.id)}
            >

              {/* TOP */}
              <div className="dosha-card-top">

                <div className="dosha-icon">
                  {dosha.icon}
                </div>

                <span className="dosha-element">
                  {dosha.element}
                </span>

              </div>


              {/* DOSHA NAME */}

              <h3 className="dosha-name">
                {dosha.name}
              </h3>


              {/* TYPE */}

              <div className="dosha-type">
                {dosha.type}
              </div>


              {/* DESCRIPTION */}

              <p className="dosha-description">
                {dosha.description}
              </p>


              {/* CARE */}

              <div className="dosha-care">
                <span className="care-dot"></span>
                {dosha.care}
              </div>


              {/* EXPLORE */}

              <button
                type="button"
                className="dosha-explore"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedDosha(dosha.id);
                }}
              >
                {selected ? "Selected ✓" : "Explore →"}
              </button>

            </div>
          );
        })}

      </div>


      {/* =========================================
          SELECTED DOSHA
      ========================================= */}

      {selectedDosha && selectedData && (

        <div className="dosha-result">

          <div className="dosha-result-content">

            <span className="result-label">
              YOUR CURRENT SELECTION
            </span>

            <div className="selected-result-row">

              <span className="selected-result-icon">
                {selectedData.icon}
              </span>

              <div>
                <h3>
                  {selectedData.name}
                </h3>

                <p>
                  {selectedData.type} •{" "}
                  {selectedData.element}
                </p>
              </div>

            </div>

            <p className="result-description">
              Ready to discover your personalized
              Ayurvedic skin scan?
            </p>

          </div>


          <Link
            to="/dosha-test"
            className="result-button"
          >
            Take Full Dosha Test
            <span>→</span>
          </Link>

        </div>

      )}

    </div>
  );
};

export default DoshaSelector;
