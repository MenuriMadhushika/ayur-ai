import React, { useMemo, useState } from "react";
import "./HomeRemedy.css";

const remedies = [
  {
    id: 1,
    concern: "Acne",
    icon: "⌘",
    title: "Turmeric & Honey Care",
    subtitle: "A simple traditional-inspired skin ritual.",
    time: "10–15 min",
    difficulty: "Easy",
    dosha: "Pitta",
    ingredients: [
      "1/2 teaspoon turmeric",
      "1 teaspoon honey"
    ],
    steps: [
      "Mix the turmeric and honey into a smooth paste.",
      "Apply a thin layer to clean skin.",
      "Leave for 10–15 minutes.",
      "Rinse gently with lukewarm water.",
      "Apply a gentle moisturizer."
    ],
    benefits: [
      "Simple home-care ritual",
      "Leaves skin feeling refreshed",
      "Easy to prepare"
    ],
    note: "Patch test first. Turmeric can temporarily stain the skin."
  },

  {
    id: 2,
    concern: "Dryness",
    icon: "◌",
    title: "Aloe & Honey Hydration",
    subtitle: "A gentle routine for dry-feeling skin.",
    time: "10 min",
    difficulty: "Easy",
    dosha: "Vata",
    ingredients: [
      "1 tablespoon pure aloe vera gel",
      "1/2 teaspoon honey"
    ],
    steps: [
      "Mix aloe vera gel and honey.",
      "Apply a thin layer to clean skin.",
      "Leave for about 10 minutes.",
      "Rinse gently.",
      "Follow with moisturizer."
    ],
    benefits: [
      "Leaves skin feeling hydrated",
      "Soothing self-care ritual",
      "Simple ingredients"
    ],
    note: "Use clean ingredients and stop if irritation occurs."
  },

  {
    id: 3,
    concern: "Dullness",
    icon: "✧",
    title: "Oat & Yogurt Care",
    subtitle: "A gentle skin-refreshing ritual.",
    time: "8–10 min",
    difficulty: "Easy",
    dosha: "Kapha",
    ingredients: [
      "1 tablespoon finely ground oats",
      "1 tablespoon plain yogurt",
      "A small amount of honey"
    ],
    steps: [
      "Mix the oats and yogurt into a soft paste.",
      "Apply gently to the skin.",
      "Leave for 8–10 minutes.",
      "Rinse with lukewarm water.",
      "Apply moisturizer."
    ],
    benefits: [
      "Leaves skin feeling smoother",
      "Refreshing self-care routine",
      "Easy to prepare"
    ],
    note: "Do not scrub aggressively."
  },

  {
    id: 4,
    concern: "Oiliness",
    icon: "◇",
    title: "Aloe & Green Tea Refresh",
    subtitle: "A lightweight refreshing skin ritual.",
    time: "10 min",
    difficulty: "Easy",
    dosha: "Kapha",
    ingredients: [
      "1 tablespoon pure aloe vera gel",
      "1 tablespoon cooled green tea"
    ],
    steps: [
      "Prepare green tea and let it cool completely.",
      "Mix the cooled tea with aloe vera gel.",
      "Apply a thin layer to clean skin.",
      "Leave for around 10 minutes.",
      "Rinse and moisturize lightly."
    ],
    benefits: [
      "Lightweight feeling",
      "Refreshing routine",
      "Simple self-care"
    ],
    note: "Never apply hot green tea to your skin."
  },

  {
    id: 5,
    concern: "Sensitive Skin",
    icon: "♡",
    title: "Oat & Aloe Soothing Care",
    subtitle: "A minimal routine for sensitive-feeling skin.",
    time: "10 min",
    difficulty: "Very Easy",
    dosha: "Vata",
    ingredients: [
      "1 tablespoon finely ground oats",
      "1 tablespoon pure aloe vera gel"
    ],
    steps: [
      "Mix oats and aloe vera into a smooth paste.",
      "Apply gently to clean skin.",
      "Leave for approximately 10 minutes.",
      "Rinse without rubbing.",
      "Apply a fragrance-free moisturizer."
    ],
    benefits: [
      "Gentle-feeling routine",
      "Minimal ingredients",
      "Comfort-focused self-care"
    ],
    note: "Patch test first and avoid irritated or broken skin."
  },

  {
    id: 6,
    concern: "Uneven Texture",
    icon: "◎",
    title: "Honey & Oat Care",
    subtitle: "A simple skin-smoothing inspired ritual.",
    time: "10 min",
    difficulty: "Easy",
    dosha: "Vata",
    ingredients: [
      "1 tablespoon finely ground oats",
      "1 teaspoon honey"
    ],
    steps: [
      "Mix the oats and honey into a soft paste.",
      "Apply gently to the skin.",
      "Do not scrub aggressively.",
      "Leave for approximately 10 minutes.",
      "Rinse and moisturize."
    ],
    benefits: [
      "Leaves skin feeling softer",
      "Simple home routine",
      "Gentle self-care approach"
    ],
    note: "Avoid harsh physical exfoliation."
  }
];

const concerns = [
  "All",
  "Acne",
  "Dryness",
  "Dullness",
  "Oiliness",
  "Sensitive Skin",
  "Uneven Texture"
];

function HomeRemedy() {

  const [selectedConcern, setSelectedConcern] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedRemedy, setSelectedRemedy] = useState(null);
  const [step, setStep] = useState(0);
  

  const filteredRemedies = useMemo(() => {

    const searchValue = search.trim().toLowerCase();

    return remedies.filter((remedy) => {

      const concernMatch =
        selectedConcern === "All" ||
        remedy.concern === selectedConcern;

      const searchMatch =
        !searchValue ||
        remedy.title.toLowerCase().includes(searchValue) ||
        remedy.concern.toLowerCase().includes(searchValue) ||
        remedy.subtitle.toLowerCase().includes(searchValue);

      return concernMatch && searchMatch;
    });

  }, [selectedConcern, search]);

  const openRemedy = (remedy) => {
    setSelectedRemedy(remedy);
    setStep(0);
  };

  const closeRemedy = () => {
    setSelectedRemedy(null);
    setStep(0);
  };

  const previousStep = () => {
    setStep((current) => Math.max(current - 1, 0));
  };

  const nextStep = () => {
    if (!selectedRemedy) return;

    setStep((current) =>
      Math.min(
        current + 1,
        selectedRemedy.steps.length - 1
      )
    );
  };

  return (
    <main className="home-remedy-page">

      {/* HERO */}

      <section className="remedy-hero">

        <div className="remedy-hero-content">

          <span className="remedy-eyebrow">
            AYURAI • HOME WELLNESS
          </span>

          <h1>
            Simple Care,
            <span> Inspired by Nature.</span>
          </h1>

          <p>
            Explore gentle Ayurvedic-inspired home
            care ideas based on common skin concerns.
          </p>

        </div>

        <div className="hero-orbit">
          ⌘
        </div>

      </section>


      {/* LIBRARY */}

      <section className="remedy-library">

        <div className="remedy-library-header">

          <div>

            <span className="remedy-section-label">
              REMEDY LIBRARY
            </span>

            <h2>
              What does your skin need?
            </h2>

            <p>
              Choose a concern and discover a simple
              self-care ritual.
            </p>

          </div>

          <div className="remedy-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search remedies"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
              >
                ×
              </button>
            )}

          </div>

        </div>


        {/* CONCERNS */}

        <div className="remedy-filters">

          {concerns.map((concern) => (

            <button
              key={concern}
              type="button"
              className={
                selectedConcern === concern
                  ? "active"
                  : ""
              }
              onClick={() =>
                setSelectedConcern(concern)
              }
            >
              {concern}
            </button>

          ))}

        </div>


        {/* CARDS */}

        {filteredRemedies.length > 0 ? (

          <div className="remedy-grid">

            {filteredRemedies.map((remedy) => (

              <article
                className="remedy-card"
                key={remedy.id}
              >

                <div className="remedy-card-header">

                  <div className="remedy-card-icon">
                    {remedy.icon}
                  </div>

                  <span className="remedy-dosha">
                    {remedy.dosha}
                  </span>

                </div>

                <span className="remedy-concern">
                  {remedy.concern}
                </span>

                <h3>
                  {remedy.title}
                </h3>

                <p>
                  {remedy.subtitle}
                </p>

                <div className="remedy-meta">

                  <span>
                    ◷ {remedy.time}
                  </span>

                  <span>
                    ♧ {remedy.difficulty}
                  </span>

                </div>

                <button
                  type="button"
                  className="remedy-view-button"
                  onClick={() =>
                    openRemedy(remedy)
                  }
                >
                  Explore Remedy
                  <span>→</span>
                </button>

              </article>

            ))}

          </div>

        ) : (

          <div className="remedy-empty">

            <span>◌</span>

            <h3>
              No remedies found
            </h3>

            <p>
              Try another concern or search term.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedConcern("All");
              }}
            >
              Reset Filters
            </button>

          </div>

        )}

      </section>


      {/* GUIDANCE */}

      <section className="remedy-guidance">

        <div className="guidance-icon">
          ⌘
        </div>

        <div>

          <span>
            AYURAI REMINDER
          </span>

          <h2>
            Keep your skincare ritual simple.
          </h2>

          <p>
            These are Ayurvedic-inspired self-care
            ideas, not medical treatments. Patch test
            new ingredients and stop if irritation occurs.
          </p>

        </div>

      </section>


      {/* DETAIL PANEL */}

      {selectedRemedy && (

        <div
          className="remedy-modal-backdrop"
          onClick={closeRemedy}
        >

          <div
            className="remedy-modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="remedy-modal-close"
              onClick={closeRemedy}
              aria-label="Close"
            >
              ×
            </button>


            <div className="modal-top">

              <div className="modal-icon">
                {selectedRemedy.icon}
              </div>

              <div>

                <span>
                  {selectedRemedy.concern}
                </span>

                <h2>
                  {selectedRemedy.title}
                </h2>

                <p>
                  {selectedRemedy.subtitle}
                </p>

              </div>

            </div>


            {/* QUICK INFO */}

            <div className="modal-details">

              <div>
                <span>TIME</span>
                <strong>
                  {selectedRemedy.time}
                </strong>
              </div>

              <div>
                <span>DIFFICULTY</span>
                <strong>
                  {selectedRemedy.difficulty}
                </strong>
              </div>

              <div>
                <span>DOSHA</span>
                <strong>
                  {selectedRemedy.dosha}
                </strong>
              </div>

            </div>


            {/* INGREDIENTS */}

            <section className="modal-content-section">

              <span className="modal-label">
                01 • INGREDIENTS
              </span>

              <ul className="ingredient-list">

                {selectedRemedy.ingredients.map(
                  (ingredient, index) => (

                    <li key={index}>

                      <span>
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {ingredient}

                    </li>

                  )
                )}

              </ul>

            </section>


            {/* BENEFITS */}

            <section className="modal-content-section">

              <span className="modal-label">
                02 • BENEFITS
              </span>

              <div className="benefit-list">

                {selectedRemedy.benefits.map(
                  (benefit, index) => (

                    <div key={index}>

                      <span>✓</span>

                      {benefit}

                    </div>

                  )
                )}

              </div>

            </section>


            {/* STEPS */}

            <section className="modal-content-section">

              <span className="modal-label">
                03 • STEP-BY-STEP RITUAL
              </span>

              <div className="step-indicators">

                {selectedRemedy.steps.map(
                  (_, index) => (

                    <button
                      key={index}
                      type="button"
                      className={
                        index === step
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        setStep(index)
                      }
                    >
                      {index + 1}
                    </button>

                  )
                )}

              </div>

              <div className="active-step">

                <span>
                  STEP {String(step + 1).padStart(2, "0")}
                </span>

                <p>
                  {selectedRemedy.steps[step]}
                </p>

              </div>

              <div className="step-navigation">

                <button
                  type="button"
                  disabled={step === 0}
                  onClick={previousStep}
                >
                  ← Previous
                </button>

                <span>
                  {step + 1} / {selectedRemedy.steps.length}
                </span>

                <button
                  type="button"
                  disabled={
                    step ===
                    selectedRemedy.steps.length - 1
                  }
                  onClick={nextStep}
                >
                  Next →
                </button>

              </div>

            </section>


            {/* NOTE */}

            <div className="remedy-safety-note">

              <span>⌘</span>

              <p>
                {selectedRemedy.note}
              </p>

            </div>


            <button
              type="button"
              className="modal-back-button"
              onClick={closeRemedy}
            >
              Back to Remedies
            </button>

          </div>

        </div>

      )}

    </main>
  );
}

export default HomeRemedy;
