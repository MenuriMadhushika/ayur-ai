import React, { useEffect, useMemo, useState } from "react";
import "./HomeRemedy.css";
import {
  getAssessmentStatus,
  getDoshaResult,
  getCurrentUserId,
} from "../utils/assessmentStatus";
import { getDoshaInfo, getPrimaryDosha } from "../utils/doshaInfo";
import {
  getAllHomeRemedies,
  getHomeRemediesByDosha,
  getLatestDoshaAssessment,
} from "../utils/api";

/* =========================================================
   AYURAI — HOME REMEDIES
   ========================================================= */

// Shown only if the API is temporarily unavailable. Normally all remedies
// are loaded from the admin-managed Spring Boot remedy library.
const FALLBACK_REMEDIES = [
  {
    id: 1,
    title: "Turmeric & Honey Care",
    concern: "Acne",
    dosha: "Pitta",
    icon: "🪷",
    time: "10–15 min",
    difficulty: "Easy",
    frequency: "Use 1–2 times per week",
    description: "A simple traditional-inspired skin ritual.",
    ingredients: ["1/2 teaspoon turmeric", "1 teaspoon honey"],
    benefits: ["Simple home-care ritual", "Leaves skin feeling refreshed", "Easy to prepare"],
    steps: [
      "Mix the turmeric and honey into a smooth paste.",
      "Apply a thin layer to clean skin.",
      "Leave it for 10 minutes and take a relaxing pause.",
      "Rinse gently with lukewarm water.",
      "Pat dry and follow with a gentle moisturizer.",
    ],
    important: "Patch test first. Turmeric can temporarily stain the skin.",
  },
  {
    id: 2,
    title: "Aloe & Honey Hydration",
    concern: "Dryness",
    dosha: "Vata",
    icon: "🌿",
    time: "10 min",
    difficulty: "Easy",
    frequency: "Use 1–2 times per week",
    description: "A gentle routine for dry-feeling skin.",
    ingredients: ["2 teaspoons aloe vera gel", "1 teaspoon honey"],
    benefits: ["Supports a hydrated feeling", "Comforting for dry-feeling skin", "Simple and gentle ritual"],
    steps: [
      "Mix aloe vera gel and honey in a clean bowl.",
      "Apply gently to clean skin.",
      "Leave it for 8–10 minutes.",
      "Rinse softly with cool or lukewarm water.",
      "Pat dry without rubbing the skin.",
    ],
    important: "Use pure aloe vera gel and stop if any discomfort appears.",
  },
  {
    id: 3,
    title: "Oat & Yogurt Care",
    concern: "Dullness",
    dosha: "Kapha",
    icon: "🌾",
    time: "8–10 min",
    difficulty: "Easy",
    frequency: "Use once per week",
    description: "A gentle skin-refreshing ritual.",
    ingredients: ["1 tablespoon finely ground oats", "1 tablespoon plain yogurt"],
    benefits: ["A soft, comforting ritual", "Helps skin feel refreshed", "Easy everyday preparation"],
    steps: [
      "Combine the oats and plain yogurt.",
      "Apply a comfortable thin layer to clean skin.",
      "Let the mixture rest for 8 minutes.",
      "Rinse slowly with lukewarm water.",
      "Finish with your usual gentle moisturizer.",
    ],
    important: "Avoid this remedy if you have a known sensitivity to dairy or oats.",
  },
  {
    id: 4,
    title: "Aloe & Green Tea Refresh",
    concern: "Oiliness",
    dosha: "Kapha",
    icon: "🍃",
    time: "10 min",
    difficulty: "Easy",
    frequency: "Use 1–2 times per week",
    description: "A lightweight refreshing skin ritual.",
    ingredients: ["2 teaspoons aloe vera gel", "1 teaspoon cooled green tea"],
    benefits: ["Lightweight and refreshing", "Simple ritual for oily-feeling skin", "Comforting everyday care"],
    steps: [
      "Mix aloe vera gel with cooled green tea.",
      "Apply lightly to freshly cleansed skin.",
      "Let it rest for 8–10 minutes.",
      "Rinse gently with cool water.",
      "Pat dry and avoid over-cleansing.",
    ],
    important: "Use cooled tea only. Do not apply hot liquid to the skin.",
  },
  {
    id: 5,
    title: "Oat & Aloe Soothing Care",
    concern: "Sensitive Skin",
    dosha: "Vata",
    icon: "🌿",
    time: "10 min",
    difficulty: "Very Easy",
    frequency: "Use 1–2 times per week",
    description: "A minimal routine for sensitive-feeling skin.",
    ingredients: ["1 tablespoon finely ground oats", "2 teaspoons aloe vera gel"],
    benefits: ["A calm and simple ritual", "Suitable for sensitive-feeling skin", "Easy to prepare at home"],
    steps: [
      "Mix the ground oats and aloe gel until soft.",
      "Apply gently without rubbing.",
      "Rest for 8–10 minutes.",
      "Rinse softly with lukewarm water.",
      "Pat dry and keep the rest of your routine minimal.",
    ],
    important: "Patch test first, especially if your skin is currently irritated.",
  },
  {
    id: 6,
    title: "Honey & Oat Care",
    concern: "Uneven Texture",
    dosha: "Vata",
    icon: "🍯",
    time: "10 min",
    difficulty: "Easy",
    frequency: "Use once per week",
    description: "A simple skin-smoothing inspired ritual.",
    ingredients: ["1 teaspoon honey", "1 tablespoon finely ground oats"],
    benefits: ["A soft skincare ritual", "Helps create a refreshed feeling", "Easy home preparation"],
    steps: [
      "Combine honey and finely ground oats.",
      "Apply very gently using clean fingertips.",
      "Leave it for up to 10 minutes.",
      "Rinse with lukewarm water without scrubbing.",
      "Finish with a gentle moisturizer.",
    ],
    important: "Do not scrub the skin. Gentle application is enough.",
  },
];

const CONCERNS = [
  "All",
  "Acne",
  "Dryness",
  "Dullness",
  "Oiliness",
  "Sensitive Skin",
  "Uneven Texture",
];

const RITUAL_SCENES = [
  { icon: "🥣", title: "Mix your ritual", description: "Prepare the ingredients slowly in a clean bowl." },
  { icon: "🌿", title: "Apply gently", description: "Use clean hands and apply a comfortable thin layer." },
  { icon: "⏳", title: "Let it rest", description: "Take a small pause while your ritual settles." },
  { icon: "💧", title: "Rinse softly", description: "Use lukewarm water and avoid rubbing your skin." },
  { icon: "✨", title: "Finish your ritual", description: "Pat dry gently and continue with moisturizer." },
];

const getThemeClass = (dosha) =>
  `dosha-${getPrimaryDosha(dosha).toLowerCase()}`;

const toList = (value, splitBy = /\r?\n/) =>
  String(value || "")
    .split(splitBy)
    .map((item) => item.trim())
    .filter(Boolean);

// Converts the database record into the interactive ritual format used here.
const mapApiRemedy = (remedy) => {
  const ingredients = toList(remedy.ingredients, /\r?\n|,/);
  const benefits = toList(remedy.benefits);
  const steps = toList(remedy.instructions);

  return {
    id: remedy.id,
    title: remedy.title || "Untitled ritual",
    concern: remedy.category || "General care",
    dosha: remedy.dosha || "Vata",
    skinType: remedy.skinType || "",
    icon: remedy.icon || "🌿",
    time: remedy.duration || "10 min",
    difficulty: remedy.difficulty || "Easy",
    frequency: remedy.frequency || "Use 1–2 times per week",
    description:
      remedy.description || "A gentle self-care ritual.",
    ingredients: ingredients.length
      ? ingredients
      : ["Ingredients will be added soon."],
    benefits: benefits.length
      ? benefits
      : ["A gentle, simple self-care ritual."],
    steps: steps.length
      ? steps
      : ["Follow the guidance from your AyurAI care routine."],
    important:
      remedy.importantNote ||
      "Patch test first. Do not use this ritual if you are allergic or sensitive to any listed ingredient. Stop if discomfort occurs.",
  };
};

const HomeRemedy = () => {
  const [assessment, setAssessment] = useState({});
  const [doshaResult, setDoshaResult] = useState({});
  const [remedies, setRemedies] = useState(FALLBACK_REMEDIES);
  const [remedyError, setRemedyError] = useState("");
  const [activeConcern, setActiveConcern] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [selectedRemedy, setSelectedRemedy] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [savedRemedyIds, setSavedRemedyIds] = useState([]);
  const [completedRemedyIds, setCompletedRemedyIds] = useState([]);
  const [backendRecommendation, setBackendRecommendation] = useState(null);

  const userId = getCurrentUserId();
  const storageKey = `ayurai-remedies-${userId || "session"}`;

  useEffect(() => {
    const loadResults = async () => {
      setAssessment(getAssessmentStatus() || {});
      setDoshaResult(getDoshaResult() || {});

      // Load the latest saved assessments as well. This keeps recommendations
      // available after a refresh, a new login, or a different device.
      if (!userId) return;

      const [doshaResponse] = await Promise.allSettled([
        getLatestDoshaAssessment(userId),
      ]);

      if (doshaResponse.status === "fulfilled") {
        setDoshaResult({
          ...doshaResponse.value,
          completed: true,
        });
      }

    };

    loadResults().catch(() => {
      // Saved browser data remains available if the backend is temporarily offline.
    });

    window.addEventListener("ayurai-assessment-updated", loadResults);
    window.addEventListener("ayuraiAssessmentUpdated", loadResults);

    return () => {
      window.removeEventListener("ayurai-assessment-updated", loadResults);
      window.removeEventListener("ayuraiAssessmentUpdated", loadResults);
    };
  }, [userId]);

  useEffect(() => {
    const loadRemedies = async () => {
      try {
        setRemedyError("");

        const response = await getAllHomeRemedies();
        const mappedRemedies = response.map(mapApiRemedy);

        setRemedies(
          mappedRemedies.length
            ? mappedRemedies
            : FALLBACK_REMEDIES
        );
      } catch {
        // The page remains usable with its local fallback if the API is offline.
        setRemedyError(
          "Showing the available rituals while the remedy library reconnects."
        );
      }
    };

    loadRemedies();
  }, []);

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem(storageKey) || "{}");
    setSavedRemedyIds(savedData.saved || []);
    setCompletedRemedyIds(savedData.completed || []);
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        saved: savedRemedyIds,
        completed: completedRemedyIds,
      })
    );
  }, [savedRemedyIds, completedRemedyIds, storageKey]);

  const dominantDosha =
    assessment?.dominantDosha ||
    assessment?.doshaResult?.dominantDosha ||
    assessment?.overallResult?.dominantDosha ||
    doshaResult?.dominantDosha ||
    doshaResult?.dominant ||
    null;

  const dominantInfo = getDoshaInfo(dominantDosha);
  const primaryDosha = getPrimaryDosha(dominantDosha);

  // Home remedies are optional wellness content. They are matched only to
  // the separate Dosha questionnaire, never to the acne model output.
  useEffect(() => {
    let cancelled = false;

    const loadBackendRecommendation = async () => {
      if (!primaryDosha) {
        setBackendRecommendation(null);
        return;
      }

      try {
        const response = await getHomeRemediesByDosha(primaryDosha);

        if (!cancelled) {
          setBackendRecommendation(
            response.length ? mapApiRemedy(response[0]) : null
          );
        }
      } catch {
        if (!cancelled) {
          setBackendRecommendation(null);
        }
      }
    };

    loadBackendRecommendation();

    return () => {
      cancelled = true;
    };
  }, [primaryDosha]);

  /* Prefer a general wellness idea matching the user's Dosha pattern. */
  const recommendedRemedy = useMemo(() => {
    if (!primaryDosha) return null;

    if (backendRecommendation) {
      return backendRecommendation;
    }

    const matchesPattern = (remedy) => remedy.dosha === primaryDosha;
    return remedies.find(matchesPattern) || null;
  }, [backendRecommendation, primaryDosha, remedies]);

  const filteredRemedies = useMemo(() => {
    const search = searchText.toLowerCase().trim();

    const matchingRemedies = remedies.filter((remedy) => {
      const matchesConcern =
        activeConcern === "All" || remedy.concern === activeConcern;

      const matchesSearch = `${remedy.title} ${remedy.concern} ${remedy.dosha}`
        .toLowerCase()
        .includes(search);

      return matchesConcern && matchesSearch;
    });

    /* This puts the one recommended ritual first. */
    return [...matchingRemedies].sort((first, second) => {
      if (first.id === recommendedRemedy?.id) return -1;
      if (second.id === recommendedRemedy?.id) return 1;
      return 0;
    });
  }, [activeConcern, searchText, recommendedRemedy, remedies]);

  const isSaved = (id) => savedRemedyIds.includes(id);
  const isCompleted = (id) => completedRemedyIds.includes(id);

  const toggleSaved = (id) => {
    setSavedRemedyIds((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id]
    );
  };

  const toggleCompleted = (id) => {
    setCompletedRemedyIds((current) =>
      current.includes(id)
        ? current.filter((completedId) => completedId !== id)
        : [...current, id]
    );
  };

  const openRemedy = (remedy) => {
    setSelectedRemedy(remedy);
    setCurrentStep(0);
  };

  const activeScene =
    RITUAL_SCENES[currentStep % RITUAL_SCENES.length];

  return (
    <main className="home-remedy-page">
      <section className="remedy-hero">
        <span className="eyebrow">AYURAI · HOME WELLNESS</span>

        <h1>
          Simple Care, <em>Inspired by Nature.</em>
        </h1>

        <p>Explore gentle self-care ideas for everyday skin concerns.</p>
      </section>

      {recommendedRemedy && (
        <section
          className={`compact-recommendation ${getThemeClass(dominantDosha)}`}
        >
          <div className="compact-recommendation-main">
            <span>✦ RECOMMENDED FOR YOU</span>
            <strong>{recommendedRemedy.title}</strong>

            <p>
              Suggested as optional wellness content for your{" "}
              {dominantInfo.label.toLowerCase()} pattern. It is not an acne treatment.
            </p>
          </div>

          <div className="compact-frequency">
            <span>GENTLE ROUTINE</span>
            <strong>{recommendedRemedy.frequency}</strong>
          </div>

          <button type="button" onClick={() => openRemedy(recommendedRemedy)}>
            Explore →
          </button>
        </section>
      )}

      <section className="remedy-library">
        <div className="library-heading">
          <div>
            <span className="eyebrow">REMEDY LIBRARY</span>
            <h2>What does your skin need?</h2>
            <p>Choose a concern and discover a simple self-care ritual.</p>
          </div>

          <label className="remedy-search">
            <span>⌕</span>
            <input
              type="search"
              value={searchText}
              placeholder="Search remedies"
              onChange={(event) => setSearchText(event.target.value)}
            />
          </label>
        </div>

        <div className="remedy-filters">
          {CONCERNS.map((concern) => (
            <button
              type="button"
              key={concern}
              className={activeConcern === concern ? "active" : ""}
              onClick={() => setActiveConcern(concern)}
            >
              {concern}
            </button>
          ))}
        </div>

        {remedyError && (
          <p className="remedy-library-message" role="status">
            {remedyError}
          </p>
        )}

        <div className="remedy-library-meta">
          <span>{filteredRemedies.length} rituals available</span>

          <span>
            ♡ {savedRemedyIds.length} saved · ✓ {completedRemedyIds.length} completed
          </span>
        </div>

        <div className="remedy-grid">
          {filteredRemedies.map((remedy) => {
            const remedyInfo = getDoshaInfo(remedy.dosha);
            const recommended = remedy.id === recommendedRemedy?.id;

            return (
              <article
                className={`remedy-card ${getThemeClass(remedy.dosha)}`}
                key={remedy.id}
              >
                {recommended && (
                  <span className="recommended-badge">
                    ✦ Recommended for you
                  </span>
                )}

                <div className="remedy-card-top">
                  <span className="remedy-icon">{remedy.icon}</span>
                  <span className="remedy-dosha-tag">{remedyInfo.label}</span>
                </div>

                <span className="remedy-concern">{remedy.concern}</span>
                <h3>{remedy.title}</h3>
                <p>{remedy.description}</p>

                <div className="remedy-card-details">
                  <span>◷ {remedy.time}</span>
                  <span>♧ {remedy.difficulty}</span>
                </div>

                <div className="card-frequency">
                  ✦ {remedy.frequency}
                </div>

                <button
                  type="button"
                  className="explore-remedy-button"
                  onClick={() => openRemedy(remedy)}
                >
                  Explore Ritual <span>→</span>
                </button>

                <button
                  type="button"
                  className={`save-card-button ${isSaved(remedy.id) ? "saved" : ""}`}
                  onClick={() => toggleSaved(remedy.id)}
                >
                  {isSaved(remedy.id) ? "♥ Saved" : "♡ Save for Later"}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {selectedRemedy && (
        <div
          className="remedy-modal-overlay"
          onMouseDown={() => setSelectedRemedy(null)}
        >
          <section
            className={`remedy-modal ${getThemeClass(selectedRemedy.dosha)}`}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-button"
              onClick={() => setSelectedRemedy(null)}
            >
              ×
            </button>

            <div className="modal-header">
              <span className="modal-remedy-icon">{selectedRemedy.icon}</span>

              <div>
                <span className="remedy-concern">{selectedRemedy.concern}</span>
                <h2>{selectedRemedy.title}</h2>
                <p>{selectedRemedy.description}</p>
              </div>
            </div>

            <div className="remedy-stat-row">
              <div>
                <span>TIME</span>
                <strong>{selectedRemedy.time}</strong>
              </div>

              <div>
                <span>DIFFICULTY</span>
                <strong>{selectedRemedy.difficulty}</strong>
              </div>

              <div>
                <span>SKIN PATTERN</span>
                <strong>{getDoshaInfo(selectedRemedy.dosha).label}</strong>
              </div>
            </div>

            <div className="weekly-routine-highlight">
              <span>✦ YOUR GENTLE ROUTINE</span>
              <strong>{selectedRemedy.frequency}</strong>
              <p>Use this as occasional self-care, not every day.</p>
            </div>

            <div className="allergy-note">
              <strong>Allergy check</strong>
              <span>
                Do not use this ritual if you are allergic or sensitive to any
                listed ingredient. Stop using it if you feel irritation,
                burning, swelling, or discomfort.
              </span>
            </div>

            <div className="modal-action-row">
              <button
                type="button"
                className={isSaved(selectedRemedy.id) ? "active-action" : ""}
                onClick={() => toggleSaved(selectedRemedy.id)}
              >
                {isSaved(selectedRemedy.id) ? "♥ Saved" : "♡ Save Ritual"}
              </button>

              <button
                type="button"
                className={isCompleted(selectedRemedy.id) ? "active-action" : ""}
                onClick={() => toggleCompleted(selectedRemedy.id)}
              >
                {isCompleted(selectedRemedy.id)
                  ? "✓ Completed"
                  : "○ Mark as Completed"}
              </button>
            </div>

            <section className="modal-section">
              <span className="eyebrow">01 · INGREDIENTS</span>
              <ul className="ritual-list ingredients-list">
                {selectedRemedy.ingredients.map((ingredient) => (
                  <li key={ingredient}>✓ {ingredient}</li>
                ))}
              </ul>
            </section>

            <section className="modal-section">
              <span className="eyebrow">02 · BENEFITS</span>
              <ul className="ritual-list benefits-list">
                {selectedRemedy.benefits.map((benefit) => (
                  <li key={benefit}>✓ {benefit}</li>
                ))}
              </ul>
            </section>

            <section className="modal-section">
              <span className="eyebrow">03 · YOUR STEP-BY-STEP RITUAL</span>

              <div className={`ritual-stage ${getThemeClass(selectedRemedy.dosha)}`}>
                <span className="ritual-scene-icon">{activeScene.icon}</span>

                <div>
                  <span className="ritual-stage-label">
                    STEP {currentStep + 1} OF {selectedRemedy.steps.length}
                  </span>
                  <h3>{activeScene.title}</h3>
                  <p>{activeScene.description}</p>
                </div>
              </div>

              <div className="ritual-step-dots">
                {selectedRemedy.steps.map((step, index) => (
                  <button
                    type="button"
                    key={step}
                    className={index === currentStep ? "active" : ""}
                    onClick={() => setCurrentStep(index)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              <div className="active-ritual-step">
                <span>STEP {currentStep + 1}</span>
                <p>{selectedRemedy.steps[currentStep]}</p>
              </div>

              <div className="ritual-navigation">
                <button
                  type="button"
                  disabled={currentStep === 0}
                  onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))}
                >
                  ← Previous
                </button>

                <span>{currentStep + 1} / {selectedRemedy.steps.length}</span>

                <button
                  type="button"
                  className="next-step-button"
                  disabled={currentStep === selectedRemedy.steps.length - 1}
                  onClick={() =>
                    setCurrentStep((step) =>
                      Math.min(step + 1, selectedRemedy.steps.length - 1)
                    )
                  }
                >
                  {currentStep === selectedRemedy.steps.length - 1
                    ? "Ritual Complete ✓"
                    : "Next Step →"}
                </button>
              </div>
            </section>

            <div className="important-note">
              <strong>Important</strong>
              <span>{selectedRemedy.important}</span>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default HomeRemedy;
