
import React, { useEffect, useMemo, useState } from "react";
import "./HomeRemedy.css";

import {
  getAssessmentStatus,
  getDoshaResult,
  getCurrentUserId,
} from "../utils/assessmentStatus";

import API_BASE_URL from "../utils/api";

/* =========================================================
   REMEDY DATA
========================================================= */

const remedies = [
  {
    id: 1,
    concern: "Acne",
    icon: "🫚",
    title: "Turmeric & Honey Care",
    subtitle: "A simple traditional-inspired skin ritual.",
    time: "10–15 min",
    difficulty: "Easy",
    dosha: "Pitta",
    ingredients: [
      "1/2 teaspoon turmeric",
      "1 teaspoon honey",
    ],
    steps: [
      "Mix the turmeric and honey into a smooth paste.",
      "Apply a thin layer to clean skin.",
      "Leave for 10–15 minutes.",
      "Rinse gently with lukewarm water.",
      "Apply a gentle moisturizer.",
    ],
    benefits: [
      "Simple home-care ritual",
      "Leaves skin feeling refreshed",
      "Easy to prepare",
    ],
    note:
      "Patch test first. Turmeric can temporarily stain the skin.",
  },

  {
    id: 2,
    concern: "Dryness",
    icon: "🌿",
    title: "Aloe & Honey Hydration",
    subtitle: "A gentle routine for dry-feeling skin.",
    time: "10 min",
    difficulty: "Easy",
    dosha: "Vata",
    ingredients: [
      "1 tablespoon pure aloe vera gel",
      "1/2 teaspoon honey",
    ],
    steps: [
      "Mix aloe vera gel and honey.",
      "Apply a thin layer to clean skin.",
      "Leave for about 10 minutes.",
      "Rinse gently.",
      "Follow with moisturizer.",
    ],
    benefits: [
      "Leaves skin feeling hydrated",
      "Soothing self-care ritual",
      "Simple ingredients",
    ],
    note:
      "Use clean ingredients and stop if irritation occurs.",
  },

  {
    id: 3,
    concern: "Dullness",
    icon: "🌾",
    title: "Oat & Yogurt Care",
    subtitle: "A gentle skin-refreshing ritual.",
    time: "8–10 min",
    difficulty: "Easy",
    dosha: "Kapha",
    ingredients: [
      "1 tablespoon finely ground oats",
      "1 tablespoon plain yogurt",
      "A small amount of honey",
    ],
    steps: [
      "Mix the oats and yogurt into a soft paste.",
      "Apply gently to the skin.",
      "Leave for 8–10 minutes.",
      "Rinse with lukewarm water.",
      "Apply moisturizer.",
    ],
    benefits: [
      "Leaves skin feeling smoother",
      "Refreshing self-care routine",
      "Easy to prepare",
    ],
    note:
      "Do not scrub aggressively.",
  },

  {
    id: 4,
    concern: "Oiliness",
    icon: "🍃",
    title: "Aloe & Green Tea Refresh",
    subtitle: "A lightweight refreshing skin ritual.",
    time: "10 min",
    difficulty: "Easy",
    dosha: "Kapha",
    ingredients: [
      "1 tablespoon pure aloe vera gel",
      "1 tablespoon cooled green tea",
    ],
    steps: [
      "Prepare green tea and let it cool completely.",
      "Mix the cooled tea with aloe vera gel.",
      "Apply a thin layer to clean skin.",
      "Leave for around 10 minutes.",
      "Rinse and moisturize lightly.",
    ],
    benefits: [
      "Lightweight feeling",
      "Refreshing routine",
      "Simple self-care",
    ],
    note:
      "Never apply hot green tea to your skin.",
  },

  {
    id: 5,
    concern: "Sensitive Skin",
    icon: "🌿",
    title: "Oat & Aloe Soothing Care",
    subtitle: "A minimal routine for sensitive-feeling skin.",
    time: "10 min",
    difficulty: "Very Easy",
    dosha: "Vata",
    ingredients: [
      "1 tablespoon finely ground oats",
      "1 tablespoon pure aloe vera gel",
    ],
    steps: [
      "Mix oats and aloe vera into a smooth paste.",
      "Apply gently to clean skin.",
      "Leave for approximately 10 minutes.",
      "Rinse without rubbing.",
      "Apply a fragrance-free moisturizer.",
    ],
    benefits: [
      "Gentle-feeling routine",
      "Minimal ingredients",
      "Comfort-focused self-care",
    ],
    note:
      "Patch test first and avoid irritated or broken skin.",
  },

  {
    id: 6,
    concern: "Uneven Texture",
    icon: "🍯",
    title: "Honey & Oat Care",
    subtitle: "A simple skin-smoothing inspired ritual.",
    time: "10 min",
    difficulty: "Easy",
    dosha: "Vata",
    ingredients: [
      "1 tablespoon finely ground oats",
      "1 teaspoon honey",
    ],
    steps: [
      "Mix the oats and honey into a soft paste.",
      "Apply gently to the skin.",
      "Do not scrub aggressively.",
      "Leave for approximately 10 minutes.",
      "Rinse and moisturize.",
    ],
    benefits: [
      "Leaves skin feeling softer",
      "Simple home routine",
      "Gentle self-care approach",
    ],
    note:
      "Avoid harsh physical exfoliation.",
  },
];

const concerns = [
  "All",
  "Acne",
  "Dryness",
  "Dullness",
  "Oiliness",
  "Sensitive Skin",
  "Uneven Texture",
];

/* =========================================================
   DOSHA CONFIG
========================================================= */

const doshaConfig = {
  Vata: {
    label: "VATA",
    className: "dosha-vata",
    description:
      "Light, dry and delicate-inspired care rituals.",
  },

  Pitta: {
    label: "PITTA",
    className: "dosha-pitta",
    description:
      "Cooling, gentle and soothing-inspired care rituals.",
  },

  Kapha: {
    label: "KAPHA",
    className: "dosha-kapha",
    description:
      "Light, refreshing and balancing-inspired care rituals.",
  },
};

/* =========================================================
   STORAGE HELPERS
========================================================= */

const getStorageKey = (userId, type) => {
  const safeUserId = userId || "guest";
  return `ayurai_${type}_${safeUserId}`;
};

const readStorageArray = (key) => {
  try {
    const stored = localStorage.getItem(key);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(
      "Unable to read AyurAI remedy storage:",
      error
    );

    return [];
  }
};

/* =========================================================
   COMPONENT
========================================================= */

function HomeRemedy() {
  const [selectedConcern, setSelectedConcern] =
    useState("All");

  const [search, setSearch] = useState("");

  const [selectedRemedy, setSelectedRemedy] =
    useState(null);

  const [step, setStep] = useState(0);

  /* =======================================================
     EXTRA USER FEATURES
  ======================================================= */

  const [currentUserId, setCurrentUserId] =
    useState("guest");

  const [favoriteRemedies, setFavoriteRemedies] =
    useState([]);

  const [completedRemedies, setCompletedRemedies] =
    useState([]);

  const [showSavedOnly, setShowSavedOnly] =
    useState(false);

  /* =======================================================
     LOAD USER ID + SAVED DATA
  ======================================================= */

  useEffect(() => {
    let userId = "guest";

    try {
      const storedUserId = getCurrentUserId();

      if (
        storedUserId !== null &&
        storedUserId !== undefined &&
        String(storedUserId).trim() !== ""
      ) {
        userId = String(storedUserId);
      }
    } catch (error) {
      console.warn(
        "Unable to retrieve current AyurAI user ID. Using guest storage.",
        error
      );
    }

    setCurrentUserId(userId);

    const favoriteKey = getStorageKey(
      userId,
      "favorite_remedies"
    );

    const completedKey = getStorageKey(
      userId,
      "completed_remedies"
    );

    setFavoriteRemedies(
      readStorageArray(favoriteKey)
    );

    setCompletedRemedies(
      readStorageArray(completedKey)
    );
  }, []);

  /* =======================================================
     SAVE FAVORITES
  ======================================================= */

  useEffect(() => {
    try {
      const key = getStorageKey(
        currentUserId,
        "favorite_remedies"
      );

      localStorage.setItem(
        key,
        JSON.stringify(favoriteRemedies)
      );
    } catch (error) {
      console.error(
        "Unable to save AyurAI favorite remedies:",
        error
      );
    }
  }, [favoriteRemedies, currentUserId]);

  /* =======================================================
     SAVE COMPLETED REMEDIES
  ======================================================= */

  useEffect(() => {
    try {
      const key = getStorageKey(
        currentUserId,
        "completed_remedies"
      );

      localStorage.setItem(
        key,
        JSON.stringify(completedRemedies)
      );
    } catch (error) {
      console.error(
        "Unable to save AyurAI completed remedies:",
        error
      );
    }
  }, [completedRemedies, currentUserId]);

  /* =======================================================
     MODAL KEYBOARD + BODY SCROLL
  ======================================================= */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedRemedy(null);
        setStep(0);
      }
    };

    if (selectedRemedy) {
      document.addEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "";
    };
  }, [selectedRemedy]);

  /* =======================================================
     LOAD ASSESSMENT
  ======================================================= */

  const assessment = useMemo(() => {
    try {
      const status = getAssessmentStatus();
      const doshaResult = getDoshaResult();

      const dominantDosha =
        doshaResult?.dominantDosha || null;

      return {
        doshaCompleted: Boolean(
          status?.doshaCompleted
        ),
        dominantDosha,
      };
    } catch (error) {
      console.error(
        "Unable to load AyurAI remedy personalization:",
        error
      );

      return {
        doshaCompleted: false,
        dominantDosha: null,
      };
    }
  }, []);

  const currentDosha =
    assessment.dominantDosha &&
    doshaConfig[assessment.dominantDosha]
      ? doshaConfig[assessment.dominantDosha]
      : null;

  /* =======================================================
     PERSONALIZED REMEDIES
  ======================================================= */

  const recommendedRemedies = useMemo(() => {
    if (!assessment.dominantDosha) {
      return [];
    }

    return remedies.filter(
      (remedy) =>
        remedy.dosha.toLowerCase() ===
        assessment.dominantDosha.toLowerCase()
    );
  }, [assessment.dominantDosha]);

  /* =======================================================
     FILTERED LIBRARY
  ======================================================= */

  const filteredRemedies = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    const filtered = remedies.filter((remedy) => {
      const concernMatch =
        selectedConcern === "All" ||
        remedy.concern === selectedConcern;

      const searchMatch =
        !searchValue ||
        remedy.title
          .toLowerCase()
          .includes(searchValue) ||
        remedy.concern
          .toLowerCase()
          .includes(searchValue) ||
        remedy.subtitle
          .toLowerCase()
          .includes(searchValue) ||
        remedy.dosha
          .toLowerCase()
          .includes(searchValue);

      const savedMatch =
        !showSavedOnly ||
        favoriteRemedies.includes(remedy.id);

      return (
        concernMatch &&
        searchMatch &&
        savedMatch
      );
    });

    /* Put user's Dosha remedies first */

    if (assessment.dominantDosha) {
      return [...filtered].sort((a, b) => {
        const aMatch =
          a.dosha === assessment.dominantDosha;

        const bMatch =
          b.dosha === assessment.dominantDosha;

        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;

        return a.id - b.id;
      });
    }

    return filtered;
  }, [
    selectedConcern,
    search,
    assessment.dominantDosha,
    showSavedOnly,
    favoriteRemedies,
  ]);

  /* =======================================================
     FAVORITE TOGGLE
  ======================================================= */

  const toggleFavorite = (remedyId) => {
    setFavoriteRemedies((current) => {
      if (current.includes(remedyId)) {
        return current.filter(
          (id) => id !== remedyId
        );
      }

      return [...current, remedyId];
    });
  };

  const isFavorite = (remedyId) =>
    favoriteRemedies.includes(remedyId);

  /* =======================================================
     COMPLETED TOGGLE
  ======================================================= */

  const toggleCompleted = (remedyId) => {
    setCompletedRemedies((current) => {
      if (current.includes(remedyId)) {
        return current.filter(
          (id) => id !== remedyId
        );
      }

      return [...current, remedyId];
    });
  };

  const isCompleted = (remedyId) =>
    completedRemedies.includes(remedyId);

  /* =======================================================
     MODAL
  ======================================================= */

  const openRemedy = (remedy) => {
    setSelectedRemedy(remedy);
    setStep(0);

    setTimeout(() => {
      const modal =
        document.querySelector(
          ".remedy-modal"
        );

      if (modal) {
        modal.scrollTop = 0;
      }
    }, 0);
  };

  const closeRemedy = () => {
    setSelectedRemedy(null);
    setStep(0);
  };

  const previousStep = () => {
    setStep((current) =>
      Math.max(current - 1, 0)
    );
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

  const resetFilters = () => {
    setSearch("");
    setSelectedConcern("All");
    setShowSavedOnly(false);
  };

  /* =======================================================
     API REFERENCE
     =======================================================

     API_BASE_URL is intentionally kept available for the
     future backend integration.

     Your current UI continues to use the existing local
     remedy data so nothing visually changes.
  ======================================================= */

  void API_BASE_URL;

  return (
    <main className="home-remedy-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="remedy-hero compact-remedy-hero">

        <div className="hero-content">

          <span className="remedy-eyebrow">
            AYURAI • HOME WELLNESS
          </span>

          <h1>
            Simple Care,
            <span> Inspired by Nature.</span>
          </h1>

          <p>
            Explore gentle Ayurvedic-inspired home care
            ideas for your everyday skin concerns.
          </p>

        </div>

      </section>


      {/* =====================================================
          PERSONALIZED DOSHA
      ===================================================== */}

      {assessment.doshaCompleted &&
        assessment.dominantDosha &&
        recommendedRemedies.length > 0 && (

        <section
          className={`personalized-remedy-section ${
            currentDosha?.className || ""
          }`}
        >

          <div className="personalized-remedy-header">

            <div>

              <span className="remedy-section-label">
                PERSONALIZED FOR YOU
              </span>

              <h2>
                Explore your{" "}
                <span>
                  {assessment.dominantDosha}
                </span>{" "}
                inspired care
              </h2>

              <p>
                Based on your saved Ayurvedic assessment,
                these remedies match your AI-estimated
                dominant Dosha pattern.
              </p>

            </div>

            <div
              className={`personalized-dosha-badge ${
                currentDosha?.className || ""
              }`}
            >

              <span>YOUR DOSHA</span>

              <strong>
                {assessment.dominantDosha}
              </strong>

            </div>

          </div>


          {/* DOSHA CHARACTER */}

          {currentDosha && (

            <div className="dosha-guidance-line">

              <span>✦</span>

              <p>
                {currentDosha.description}
              </p>

            </div>

          )}


          <div className="personalized-remedy-grid">

            {recommendedRemedies.map((remedy) => (

              <article
                className="personalized-remedy-card"
                key={remedy.id}
              >

                <div className="personalized-remedy-icon">
                  {remedy.icon}
                </div>

                <div className="personalized-remedy-content">

                  <span>
                    {remedy.concern}
                  </span>

                  <h3>
                    {remedy.title}
                  </h3>

                  <p>
                    {remedy.subtitle}
                  </p>

                  <div className="personalized-remedy-meta">

                    <span>
                      ◷ {remedy.time}
                    </span>

                    <span>
                      ♧ {remedy.difficulty}
                    </span>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      openRemedy(remedy)
                    }
                  >
                    Explore Recommended Care →
                  </button>

                </div>

              </article>

            ))}

          </div>

        </section>
      )}


      {/* =====================================================
          LIBRARY
      ===================================================== */}

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
                aria-label="Clear search"
              >
                ×
              </button>

            )}

          </div>

        </div>


        {/* ===================================================
            CONCERNS
        =================================================== */}

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


        {/* ===================================================
            EXTRA REMEDY CONTROLS
        =================================================== */}

        <div
          className="remedy-extra-controls"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "18px",
            marginBottom: "12px",
          }}
        >

          <button
            type="button"
            onClick={() =>
              setShowSavedOnly(
                (current) => !current
              )
            }
            style={{
              border: "1px solid rgba(120, 100, 60, 0.2)",
              background: showSavedOnly
                ? "rgba(180, 150, 80, 0.12)"
                : "transparent",
              borderRadius: "999px",
              padding: "9px 15px",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            {showSavedOnly
              ? "♥ Showing Saved"
              : "♡ Saved Remedies"}
          </button>

          <div
            style={{
              display: "flex",
              gap: "14px",
              alignItems: "center",
              fontSize: "0.82rem",
              opacity: 0.75,
            }}
          >
            <span>
              ♥ {favoriteRemedies.length} saved
            </span>

            <span>
              ✓ {completedRemedies.length} completed
            </span>
          </div>

        </div>


        {/* ===================================================
            RESULT COUNT
        =================================================== */}

        <div className="remedy-results-info">

          <span>
            {filteredRemedies.length}{" "}
            {filteredRemedies.length === 1
              ? "ritual"
              : "rituals"}{" "}
            available
          </span>

          {assessment.dominantDosha && (
            <span className="library-dosha-note">
              ✦ {assessment.dominantDosha}-informed
              recommendations appear first
            </span>
          )}

        </div>


        {/* ===================================================
            CARDS
        =================================================== */}

        {filteredRemedies.length > 0 ? (

          <div className="remedy-grid">

            {filteredRemedies.map((remedy) => {

              const isRecommended =
                assessment.dominantDosha &&
                remedy.dosha.toLowerCase() ===
                assessment.dominantDosha.toLowerCase();

              const remedyDosha =
                doshaConfig[remedy.dosha];

              return (

                <article
                  className={`remedy-card ${
                    isRecommended
                      ? "recommended-remedy"
                      : ""
                  } ${
                    remedyDosha?.className || ""
                  }`}
                  key={remedy.id}
                >

                  {isRecommended && (

                    <span className="recommended-badge">
                      ✦ Recommended for you
                    </span>

                  )}


                  <div className="remedy-card-header">

                    <div className="remedy-card-icon">
                      {remedy.icon}
                    </div>

                    <span
                      className="remedy-dosha"
                      data-dosha={remedy.dosha}
                    >
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


                  {/* =================================================
                      EXTRA SAVE BUTTON
                  ================================================= */}

                  <button
                    type="button"
                    onClick={() =>
                      toggleFavorite(remedy.id)
                    }
                    aria-label={
                      isFavorite(remedy.id)
                        ? `Remove ${remedy.title} from saved remedies`
                        : `Save ${remedy.title}`
                    }
                    style={{
                      marginTop: "10px",
                      width: "100%",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                      padding: "6px",
                      opacity: 0.85,
                    }}
                  >
                    {isFavorite(remedy.id)
                      ? "♥ Saved to My Remedies"
                      : "♡ Save for Later"}
                  </button>

                  {isCompleted(remedy.id) && (
                    <div
                      style={{
                        textAlign: "center",
                        fontSize: "0.75rem",
                        marginTop: "3px",
                        opacity: 0.65,
                      }}
                    >
                      ✓ Ritual completed
                    </div>
                  )}

                </article>

              );
            })}

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
              onClick={resetFilters}
            >
              Reset Filters
            </button>

          </div>

        )}

      </section>


      {/* =====================================================
          GUIDANCE
      ===================================================== */}

      <section className="remedy-guidance">

        <div className="guidance-icon">
          ✦
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


      {/* =====================================================
          DETAIL MODAL
      ===================================================== */}

      {selectedRemedy && (

        <div
          className="remedy-modal-backdrop"
          onClick={closeRemedy}
        >

          <div
            className={`remedy-modal ${
              doshaConfig[selectedRemedy.dosha]
                ?.className || ""
            }`}
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              type="button"
              className="remedy-modal-close"
              onClick={closeRemedy}
              aria-label="Close remedy"
            >
              ×
            </button>


            {/* =================================================
                MODAL TOP
            ================================================= */}

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


            {/* =================================================
                QUICK INFO
            ================================================= */}

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


            {/* =================================================
                PERSONALIZED MESSAGE
            ================================================= */}

            {assessment.dominantDosha &&
              selectedRemedy.dosha.toLowerCase() ===
                assessment.dominantDosha.toLowerCase() && (

              <div className="modal-personalized-note">

                <span>✦</span>

                <p>
                  This remedy is aligned with your
                  AI-estimated{" "}
                  {assessment.dominantDosha} Dosha
                  pattern from your AyurAI assessment.
                </p>

              </div>

            )}


            {/* =================================================
                EXTRA SAVE / COMPLETE ACTIONS
            ================================================= */}

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                margin: "18px 0",
              }}
            >

              <button
                type="button"
                onClick={() =>
                  toggleFavorite(
                    selectedRemedy.id
                  )
                }
                style={{
                  flex: "1 1 180px",
                  padding: "11px 15px",
                  borderRadius: "10px",
                  border:
                    "1px solid rgba(120, 100, 60, 0.2)",
                  background:
                    isFavorite(selectedRemedy.id)
                      ? "rgba(180, 150, 80, 0.12)"
                      : "transparent",
                  cursor: "pointer",
                }}
              >
                {isFavorite(
                  selectedRemedy.id
                )
                  ? "♥ Saved Remedy"
                  : "♡ Save Remedy"}
              </button>

              <button
                type="button"
                onClick={() =>
                  toggleCompleted(
                    selectedRemedy.id
                  )
                }
                style={{
                  flex: "1 1 180px",
                  padding: "11px 15px",
                  borderRadius: "10px",
                  border:
                    "1px solid rgba(120, 100, 60, 0.2)",
                  background:
                    isCompleted(
                      selectedRemedy.id
                    )
                      ? "rgba(120, 150, 100, 0.12)"
                      : "transparent",
                  cursor: "pointer",
                }}
              >
                {isCompleted(
                  selectedRemedy.id
                )
                  ? "✓ Ritual Completed"
                  : "○ Mark as Completed"}
              </button>

            </div>


            {/* =================================================
                INGREDIENTS
            ================================================= */}

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


            {/* =================================================
                BENEFITS
            ================================================= */}

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


            {/* =================================================
                STEPS
            ================================================= */}

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
                  STEP{" "}
                  {String(step + 1).padStart(2, "0")}
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
                  {step + 1} /{" "}
                  {selectedRemedy.steps.length}
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


            {/* =================================================
                SAFETY NOTE
            ================================================= */}

            <div className="remedy-safety-note">

              <span>✦</span>

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
