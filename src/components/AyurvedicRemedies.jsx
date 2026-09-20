import React, { useState } from "react";

import "./AyurvedicRemedies.css";


const remedies = [

  {
    icon: "🌿",
    title: "Aloe Vera Soothing Care",
    concern: "Dryness & irritation",

    description:
      "Apply a thin layer of pure aloe vera gel to clean skin for a gentle, cooling feel.",

    tip:
      "Use fresh, pure aloe vera gel and patch-test before applying.",
  },


  {
    icon: "🍯",
    title: "Honey Hydration",
    concern: "Dry & dull skin",

    description:
      "A small amount of plain honey can be used as a short wash-off mask for a soft, hydrated feeling.",

    tip:
      "Leave on briefly and rinse gently with lukewarm water.",
  },


  {
    icon: "🌱",
    title: "Neem Care",
    concern: "Oily & blemish-prone skin",

    description:
      "Neem is traditionally used in Ayurvedic skincare for skin that tends to become oily or blemish-prone.",

    tip:
      "Avoid harsh neem preparations and patch-test first.",
  },


  {
    icon: "🌼",
    title: "Turmeric Care",
    concern: "Dull-looking skin",

    description:
      "Turmeric has a long history in traditional Ayurvedic beauty practices.",

    tip:
      "Use only a small amount because turmeric can temporarily stain skin.",
  },


  {
    icon: "🥥",
    title: "Coconut Oil Moisture",
    concern: "Very dry skin",

    description:
      "A small amount of coconut oil can help reduce moisture loss on suitable dry areas.",

    tip:
      "Avoid using it on acne-prone facial skin if it tends to clog your pores.",
  },


  {
    icon: "🌹",
    title: "Rose Water Refresh",
    concern: "Refreshing skincare",

    description:
      "A simple rose-water mist can provide a refreshing step in a gentle skincare routine.",

    tip:
      "Choose a simple product without added fragrance or irritating ingredients.",
  },

];


function AyurvedicRemedies() {

  const [selectedRemedy, setSelectedRemedy] =
    useState(null);


  return (

    <section className="remedies-section">


      {/* HEADER */}

      <div className="remedies-header">

        <span className="section-label">
          AYURVEDIC WELLNESS
        </span>


        <h2>
          Ayurvedic Home Remedies
        </h2>


        <p>
          Discover simple traditional-inspired
          skincare practices designed to complement
          your personalized AyurAI journey.
        </p>

      </div>


      {/* REMEDIES */}

      <div className="remedies-grid">


        {remedies.map(
          (remedy, index) => (

            <article
              className="remedy-card"
              key={index}
            >


              <div className="remedy-icon">
                {remedy.icon}
              </div>


              <span className="remedy-concern">
                {remedy.concern}
              </span>


              <h3>
                {remedy.title}
              </h3>


              <p>
                {remedy.description}
              </p>


              <div className="remedy-tip">

                <strong>
                  AyurAI Tip
                </strong>

                <span>
                  {remedy.tip}
                </span>

              </div>


              <button
                className="remedy-explore-button"
                type="button"
                onClick={() =>
                  setSelectedRemedy(remedy)
                }
              >
                Explore Remedy →
              </button>

            </article>

          )
        )}

      </div>


      {/* NOTE */}

      <div className="remedies-note">

        <span>
          ⌘
        </span>


        <p>
          Home remedies are traditional wellness
          suggestions and are not a substitute for
          professional medical advice.
        </p>

      </div>


      {/* MODAL */}

      {selectedRemedy && (

        <div
          className="remedy-modal-overlay"
          onClick={() =>
            setSelectedRemedy(null)
          }
        >

          <div
            className="remedy-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            <button
              className="remedy-modal-close"
              type="button"
              onClick={() =>
                setSelectedRemedy(null)
              }
            >
              ×
            </button>


            <div className="remedy-modal-icon">
              {selectedRemedy.icon}
            </div>


            <span className="remedy-modal-label">
              {selectedRemedy.concern}
            </span>


            <h2>
              {selectedRemedy.title}
            </h2>


            <p>
              {selectedRemedy.description}
            </p>


            <div className="remedy-modal-tip">

              <strong>
                AYURAI TIP
              </strong>

              <span>
                {selectedRemedy.tip}
              </span>

            </div>


            <button
              className="remedy-modal-done"
              type="button"
              onClick={() =>
                setSelectedRemedy(null)
              }
            >
              Got It
            </button>

          </div>

        </div>

      )}

    </section>

  );
}


export default AyurvedicRemedies;