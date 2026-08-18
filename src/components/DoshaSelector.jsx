import React, { useState } from "react";
import { Link } from "react-router-dom";


const DoshaSelector = () => {
  const [selectedDosha, setSelectedDosha] = useState(null);

  const doshas = [
    {
      id: "vata",
      name: "VATA",
      icon: "🌬️",
      short: "Dry",
      element: "Air & Space",
      description:
        "Vata skin often feels dry, delicate, rough, or dehydrated. It benefits from gentle, nourishing and hydrating skincare.",
      care: "Hydration • Nourishment • Gentle care",
    },
    {
      id: "pitta",
      name: "PITTA",
      icon: "🔥",
      short: "Sensitive",
      element: "Fire & Water",
      description:
        "Pitta skin can feel sensitive, warm, or reactive and may be prone to redness. It benefits from calming and gentle skincare.",
      care: "Calming • Cooling • Gentle care",
    },
    {
      id: "kapha",
      name: "KAPHA",
      icon: "🌿",
      short: "Oily",
      element: "Earth & Water",
      description:
        "Kapha skin may feel oily or heavy and can be prone to congestion. It benefits from lightweight and balancing skincare.",
      care: "Balancing • Lightweight • Refreshing care",
    },
  ];

  return (
    <section className="dosha-section">

      <div className="dosha-heading">
        <span>AYURVEDIC SKINCARE</span>

        <h2>What is your Ayurvedic type?</h2>

        <p>
          <p>
  Ayurveda describes three natural mind-body energies called Doshas.
  Explore each one to understand your skin better.
</p>
        </p>
      </div>

      <div className="dosha-cards">
        {doshas.map((dosha) => (
          <button
            key={dosha.id}
            className={`dosha-card ${
              selectedDosha === dosha.id ? "selected" : ""
            }`}
            onClick={() => setSelectedDosha(dosha.id)}
          >
            <div className="dosha-icon">{dosha.icon}</div>

            <h3>{dosha.name}</h3>

            <p>{dosha.short}</p>

            <span className="dosha-explore">
              {selectedDosha === dosha.id
                ? "Selected ✓"
                : "Explore →"}
            </span>
          </button>
        ))}
      </div>

      {selectedDosha && (
        <div className="dosha-info">

          {doshas
            .filter((dosha) => dosha.id === selectedDosha)
            .map((dosha) => (
              <div key={dosha.id} className="dosha-info-content">

                <div className="info-icon">
                  {dosha.icon}
                </div>

                <div>
                  <p className="info-label">
                    ABOUT THIS DOSHA
                  </p>

                  <h3>
                    {dosha.name} — {dosha.element}
                  </h3>

                  <p className="info-description">
                    {dosha.description}
                  </p>

                  <p className="care-text">
                    <strong>AyurAI Care:</strong>{" "}
                    {dosha.care}
                  </p>

                  <Link
                    to="/dosha-test"
                    className="btn-outline-link"
                  > <a href="#dosha-test" className="btn-primary-link">
  Take the Dosha Test →
</a>
                    
                  </Link>
                </div>

              </div>
            ))}

        </div>
      )}

    </section>
  );
};

export default DoshaSelector;