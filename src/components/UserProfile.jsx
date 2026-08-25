import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";

import {
  getAssessmentStatus,
} from "../utils/assessmentStatus";

/* =========================================================
   AYURAI — PROFILE ICONS
========================================================= */

const profileIcons = [
  { id: "butterfly", symbol: "🦋", name: "Butterfly" },
  { id: "lotus", symbol: "🪷", name: "Lotus" },
  { id: "leaf", symbol: "🍃", name: "Leaf" },
  { id: "flower", symbol: "🌺", name: "Flower" },
  { id: "sun", symbol: "☀️", name: "Sun" },
  { id: "botanical", symbol: "🌿", name: "Botanical" },
];

/* =========================================================
   AYURAI — HOME REMEDIES
========================================================= */

const remediesByDosha = {
  Vata: [
    {
      icon: "🌿🥥",
      category: "HYDRATING CARE",
      title: "Aloe Vera & Coconut Care",
      description:
        "A gentle moisturizing ritual for dry and dehydrated-looking skin.",
      ingredients:
        "Aloe vera gel + a small amount of coconut oil",
    },
    {
      icon: "🥒",
      category: "NOURISHING CARE",
      title: "Cucumber & Aloe Mask",
      description:
        "A refreshing ritual designed to provide a soothing and hydrated skin feeling.",
      ingredients:
        "Fresh cucumber + pure aloe vera gel",
    },
    {
      icon: "🌾🍯",
      category: "GENTLE CARE",
      title: "Oat & Honey Mask",
      description:
        "A gentle mask for soft and comfortable-looking skin.",
      ingredients:
        "Finely ground oats + a small amount of honey",
    },
  ],

  Pitta: [
    {
      icon: "🌿",
      category: "COOLING CARE",
      title: "Aloe Vera Cooling Care",
      description:
        "A simple cooling ritual for skin that feels warm or sensitive.",
      ingredients: "Pure aloe vera gel",
    },
    {
      icon: "🥒",
      category: "SOOTHING CARE",
      title: "Cucumber & Aloe Mask",
      description:
        "A refreshing combination for a calm and comfortable skin feeling.",
      ingredients:
        "Fresh cucumber + pure aloe vera gel",
    },
    {
      icon: "🌾🥛",
      category: "GENTLE CARE",
      title: "Oat & Yogurt Care",
      description:
        "A gentle home ritual for sensitive-looking skin.",
      ingredients:
        "Finely ground oats + plain yogurt",
    },
  ],

  Kapha: [
    {
      icon: "🍃",
      category: "BALANCING CARE",
      title: "Neem & Aloe Care",
      description:
        "A botanical-inspired ritual for oily or congested-looking skin.",
      ingredients:
        "Aloe vera gel + a small amount of neem powder",
    },
    {
      icon: "🪨🌹",
      category: "CLARIFYING CARE",
      title: "Multani Mitti & Rose Water",
      description:
        "A traditional clay-based ritual that can absorb excess surface oil.",
      ingredients:
        "Multani mitti + rose water",
    },
    {
      icon: "🥒",
      category: "REFRESHING CARE",
      title: "Cucumber Refresh",
      description:
        "A light and refreshing ritual for a clean skin feeling.",
      ingredients: "Fresh cucumber",
    },
  ],
};

/* =========================================================
   STORAGE HELPERS
========================================================= */

const getSavedDoshaResult = () => {
  try {
    const saved =
      localStorage.getItem("ayuraiDoshaResult");

    if (!saved) return null;

    return JSON.parse(saved);
  } catch (error) {
    console.error(
      "Unable to read AyurAI Dosha result:",
      error
    );

    return null;
  }
};

const getSavedSkinScanResult = () => {
  try {
    const saved =
      localStorage.getItem("ayuraiSkinScanResult");

    if (saved) {
      return JSON.parse(saved);
    }

    const alternative =
      localStorage.getItem("ayuraiSkinResult");

    if (alternative) {
      return JSON.parse(alternative);
    }

    return null;
  } catch (error) {
    console.error(
      "Unable to read AyurAI Skin Scan result:",
      error
    );

    return null;
  }
};

/* =========================================================
   HELPERS
========================================================= */

const normalizeDosha = (value) => {
  if (!value) return "";

  const normalized =
    String(value)
      .trim()
      .toLowerCase();

  if (normalized === "vata") return "Vata";
  if (normalized === "pitta") return "Pitta";
  if (normalized === "kapha") return "Kapha";

  return "";
};

const formatSkinValue = (value) => {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "Not analyzed";
  }

  return String(value);
};

/* =========================================================
   USER PROFILE
========================================================= */

const UserProfile = () => {
  const navigate = useNavigate();

  /* =======================================================
     ASSESSMENT RESULTS
  ======================================================= */

  const [doshaResult, setDoshaResult] =
    useState(() => getSavedDoshaResult());

  const [skinScanResult, setSkinScanResult] =
    useState(() => getSavedSkinScanResult());

  const [assessmentStatus, setAssessmentStatus] =
    useState(() => {
      try {
        return getAssessmentStatus() || {};
      } catch {
        return {};
      }
    });

  /* =======================================================
     USER
  ======================================================= */

  const [user, setUser] = useState(() => {
    try {
      const savedUser =
        localStorage.getItem("ayuraiUser");

      if (savedUser) {
        const parsed = JSON.parse(savedUser);

        return {
          id: parsed.id,
          name: parsed.name || "AyurAI User",
          email:
            parsed.email || "user@ayurai.com",
          age:
            parsed.age !== null &&
            parsed.age !== undefined
              ? parsed.age
              : "",
          icon:
            parsed.icon ||
            parsed.profileIcon ||
            "butterfly",
        };
      }
    } catch (error) {
      console.error(
        "Unable to read AyurAI user:",
        error
      );
    }

    return {
      id: null,
      name: "AyurAI User",
      email: "user@ayurai.com",
      age: "",
      icon: "butterfly",
    };
  });

  const [editing, setEditing] =
    useState(false);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [profileError, setProfileError] =
    useState("");

  const [editForm, setEditForm] =
    useState({
      name: user.name,
      email: user.email,
      age: user.age,
      icon: user.icon || "butterfly",
    });

  /* =======================================================
     LOAD USER FROM BACKEND
  ======================================================= */

  useEffect(() => {
    const loadUser = async () => {
      const storedId =
        localStorage.getItem("ayuraiUserId");

      if (!storedId) {
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8081/api/users/${storedId}`
        );

        if (!response.ok) {
          return;
        }

        const data =
          await response.json();

        const backendUser = {
          id: data.id,
          name:
            data.name || "AyurAI User",
          email:
            data.email || "user@ayurai.com",
          age:
            data.age !== null &&
            data.age !== undefined
              ? data.age
              : "",
          icon:
            data.profileIcon ||
            "butterfly",
        };

        setUser(backendUser);

        localStorage.setItem(
          "ayuraiUser",
          JSON.stringify({
            ...backendUser,
            profileIcon:
              backendUser.icon,
          })
        );

      } catch (error) {
        console.error(
          "Unable to load user profile:",
          error
        );
      }
    };

    loadUser();
  }, []);

  /* =======================================================
     LOAD / REFRESH ASSESSMENTS
  ======================================================= */

  const loadAssessmentResults = () => {
    setDoshaResult(
      getSavedDoshaResult()
    );

    setSkinScanResult(
      getSavedSkinScanResult()
    );

    try {
      setAssessmentStatus(
        getAssessmentStatus() || {}
      );
    } catch {
      setAssessmentStatus({});
    }
  };

  useEffect(() => {
    loadAssessmentResults();

    const handleStorage = () => {
      loadAssessmentResults();
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    window.addEventListener(
      "ayuraiAssessmentUpdated",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );

      window.removeEventListener(
        "ayuraiAssessmentUpdated",
        handleStorage
      );
    };
  }, []);

  /* =======================================================
     EDIT PROFILE
  ======================================================= */

  const handleEdit = () => {
    setProfileError("");

    setEditForm({
      name: user.name,
      email: user.email,
      age: user.age,
      icon: user.icon || "butterfly",
    });

    setEditing(true);
  };

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setProfileError("");
  };

  /* =======================================================
     ICON SELECT
  ======================================================= */

  const handleIconSelect = (iconId) => {
    setEditForm((previous) => ({
      ...previous,
      icon: iconId,
    }));
  };

  /* =======================================================
     SAVE PROFILE TO BACKEND
  ======================================================= */

  const handleSave = async () => {
    setProfileError("");

    if (!editForm.name.trim()) {
      setProfileError(
        "Please enter your name."
      );
      return;
    }

    if (!editForm.email.trim()) {
      setProfileError(
        "Please enter your email."
      );
      return;
    }

    const userId =
      user.id ||
      localStorage.getItem(
        "ayuraiUserId"
      );

    if (!userId) {
      setProfileError(
        "User session not found. Please login again."
      );
      return;
    }

    setSavingProfile(true);

    try {
      const response = await fetch(
        `http://localhost:8081/api/users/${userId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: editForm.name.trim(),
            email:
              editForm.email
                .trim()
                .toLowerCase(),
            age:
              editForm.age
                ? Number(editForm.age)
                : null,
            profileIcon:
              editForm.icon ||
              "butterfly",
          }),
        }
      );

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      let data;

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        data = await response.json();
      } else {
        const text =
          await response.text();

        data = {
          message: text,
        };
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to update profile."
        );
      }

      /* ===============================================
         UPDATE FRONTEND USER
      =============================================== */

      const updatedUser = {
        id: data.id || Number(userId),

        name:
          data.name ||
          editForm.name.trim(),

        email:
          data.email ||
          editForm.email
            .trim()
            .toLowerCase(),

        age:
          data.age ??
          editForm.age,

        icon:
          data.profileIcon ||
          editForm.icon ||
          "butterfly",

        profileIcon:
          data.profileIcon ||
          editForm.icon ||
          "butterfly",
      };

      setUser(updatedUser);

      localStorage.setItem(
        "ayuraiUser",
        JSON.stringify(
          updatedUser
        )
      );

      localStorage.setItem(
        "ayuraiUserId",
        String(updatedUser.id)
      );

      setEditing(false);

    } catch (error) {
      console.error(
        "AyurAI profile update error:",
        error
      );

      setProfileError(
        error.message ||
        "Unable to update your profile."
      );

    } finally {
      setSavingProfile(false);
    }
  };

  /* =======================================================
     CANCEL
  ======================================================= */

  const handleCancel = () => {
    setProfileError("");
    setEditing(false);
  };

  /* =======================================================
     DOSHA DATA
  ======================================================= */

  const dominantDosha =
    normalizeDosha(
      doshaResult?.dominantDosha
    );

  const percentages =
    doshaResult?.percentages || {
      Vata: 0,
      Pitta: 0,
      Kapha: 0,
    };

  const vata =
    Number(percentages.Vata) || 0;

  const pitta =
    Number(percentages.Pitta) || 0;

  const kapha =
    Number(percentages.Kapha) || 0;

  const totalPercentage =
    vata + pitta + kapha;

  /* =======================================================
     SKIN DATA
  ======================================================= */

  const skinType =
    formatSkinValue(
      skinScanResult?.skinType
    );

  const hydrationValue =
    skinScanResult?.hydration;

  const hydration =
    hydrationValue !== undefined &&
    hydrationValue !== null &&
    hydrationValue !== ""
      ? `${hydrationValue}%`
      : "Not analyzed";

  const concern =
    formatSkinValue(
      skinScanResult?.texture
    );

  /* =======================================================
     ASSESSMENT COMPLETION
  ======================================================= */

  const skinCompleted =
    Boolean(
      assessmentStatus?.skinScanCompleted ||
      skinScanResult?.completed
    );

  const doshaCompleted =
    Boolean(
      assessmentStatus?.doshaCompleted ||
      assessmentStatus?.doshaTestCompleted ||
      doshaResult?.completed
    );

  /* =======================================================
     SELECTED ICON
  ======================================================= */

  const selectedIcon =
    profileIcons.find(
      (item) =>
        item.id === user.icon
    ) ||
    profileIcons[0];

  /* =======================================================
     REMEDIES
  ======================================================= */

  const recommendedRemedies =
    remediesByDosha[
      dominantDosha
    ] || [];

  /* =======================================================
     UI
  ======================================================= */

  return (
    <section className="profile-page">

      {/* HEADER */}

      <div className="profile-header">

        <span className="profile-label">
          AYURAI • MY PROFILE
        </span>

        <h1>
          Your Personal
          <br />
          <span>Skin Journey</span>
        </h1>

        <p>
          Your Ayurvedic profile, skin insights and
          personalized wellness journey.
        </p>

      </div>

      {/* PROFILE CARD */}

      <div className="profile-main-card">

        <div className="profile-avatar">
          {selectedIcon.symbol}
        </div>

        <div className="profile-user-info">

          <h2>
            {user.name}
          </h2>

          <p>
            {user.email}
          </p>

          <span className="profile-age">
            {user.age
              ? `Age ${user.age}`
              : "Age not set"}
          </span>

        </div>

        <button
          className="edit-profile-button"
          onClick={handleEdit}
        >
          Edit Profile
        </button>

      </div>

      {/* =====================================================
          EDIT PROFILE MODAL
      ===================================================== */}

      {editing && (

        <div className="edit-profile-overlay">

          <div className="edit-profile-modal">

            <button
              className="profile-modal-close"
              onClick={handleCancel}
            >
              ×
            </button>

            <div className="profile-modal-header">

              <div className="profile-modal-avatar">
                {
                  profileIcons.find(
                    (item) =>
                      item.id ===
                      editForm.icon
                  )?.symbol || "🦋"
                }
              </div>

              <div>

                <span className="profile-modal-label">
                  AYURAI • PERSONAL DETAILS
                </span>

                <h2>
                  Edit Your Profile
                </h2>

                <p>
                  Personalize your AyurAI profile.
                </p>

              </div>

            </div>

            {/* ICONS */}

            <div className="profile-icon-section">

              <label>
                CHOOSE YOUR PROFILE SYMBOL
              </label>

              <div className="profile-icon-grid">

                {profileIcons.map(
                  (icon) => (

                    <button
                      type="button"
                      key={icon.id}
                      className={`profile-icon-option ${
                        editForm.icon ===
                        icon.id
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleIconSelect(
                          icon.id
                        )
                      }
                      title={icon.name}
                    >
                      <span>
                        {icon.symbol}
                      </span>
                    </button>

                  )
                )}

              </div>

            </div>

            {/* FORM */}

            <div className="profile-form">

              <div className="profile-input-group">

                <label>
                  FULL NAME
                </label>

                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />

              </div>

              <div className="profile-input-group">

                <label>
                  EMAIL ADDRESS
                </label>

                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                />

              </div>

              <div className="profile-input-group">

                <label>
                  AGE
                </label>

                <input
                  type="number"
                  name="age"
                  value={editForm.age ?? ""}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  placeholder="Your age"
                />

              </div>

            </div>

            {/* ERROR */}

            {profileError && (
              <div className="auth-error">
                {profileError}
              </div>
            )}

            <div className="profile-modal-divider" />

            <div className="profile-modal-actions">

              <button
                className="profile-cancel-button"
                onClick={handleCancel}
                disabled={savingProfile}
              >
                Cancel
              </button>

              <button
                className="profile-save-button"
                onClick={handleSave}
                disabled={savingProfile}
              >
                {savingProfile
                  ? "Saving..."
                  : "Save Changes"}
              </button>

            </div>

          </div>

        </div>

      )}

      {/* =====================================================
          01 — AYURVEDIC PROFILE
      ===================================================== */}

      <div className="profile-section">

        <div className="profile-section-heading">

          <span>
            01 • AYURVEDIC PROFILE
          </span>

          <h2>
            Understand Your Balance
          </h2>

        </div>

        <div className="profile-stats">

          <div className="profile-stat dosha-stat">

            <span>
              YOUR DOSHA
            </span>

            <strong>
              {dominantDosha || "Not tested"}
            </strong>

            <small>
              Ayurvedic balance
            </small>

          </div>

          <div className="profile-stat skin-stat">

            <span>
              SKIN TYPE
            </span>

            <strong>
              {skinType}
            </strong>

            <small>
              AI-estimated visible characteristics
            </small>

          </div>

          <div className="profile-stat hydration-stat">

            <span>
              HYDRATION
            </span>

            <strong>
              {hydration}
            </strong>

            <small>
              AI-estimated visible characteristic
            </small>

          </div>

          <div className="profile-stat concern-stat">

            <span>
              MAIN CONCERN
            </span>

            <strong>
              {concern}
            </strong>

            <small>
              AI-observed visible characteristic
            </small>

          </div>

        </div>

      </div>

      {/* =====================================================
          02 — DOSHA BALANCE
      ===================================================== */}

      <div className="profile-section">

        <div className="profile-section-heading">

          <span>
            02 • DOSHA BALANCE
          </span>

          <h2>
            Your Ayurvedic Energy
          </h2>

        </div>

        <div className="dosha-balance-card">

          <div className="dosha-circle-wrapper">

            <div
              className="dosha-circle"
              style={{
                background:
                  totalPercentage > 0
                    ? `conic-gradient(
                        #b68b4c 0 ${vata}%,
                        #d47b61 ${vata}% ${vata + pitta}%,
                        #7f9b72 ${vata + pitta}% 100%
                      )`
                    : "#e5dfd2",
              }}
            >

              <div className="dosha-circle-inner">

                <span>
                  PRIMARY
                </span>

                <strong>
                  {dominantDosha || "Not tested"}
                </strong>

                <small>
                  {totalPercentage > 0
                    ? "Your balance"
                    : "Take the test"}
                </small>

              </div>

            </div>

          </div>

          <div className="dosha-legend">

            <div className="dosha-legend-item">

              <span className="legend-dot vata-dot" />

              <div>

                <strong>
                  Vata
                </strong>

                <small>
                  {vata}%
                </small>

              </div>

            </div>

            <div className="dosha-legend-item">

              <span className="legend-dot pitta-dot" />

              <div>

                <strong>
                  Pitta
                </strong>

                <small>
                  {pitta}%
                </small>

              </div>

            </div>

            <div className="dosha-legend-item">

              <span className="legend-dot kapha-dot" />

              <div>

                <strong>
                  Kapha
                </strong>

                <small>
                  {kapha}%
                </small>

              </div>

            </div>

            <button
              className="profile-refresh-button"
              onClick={loadAssessmentResults}
            >
              Refresh Results
            </button>

          </div>

        </div>

      </div>

      {/* =====================================================
          03 — LATEST ANALYSIS
      ===================================================== */}

      <div className="profile-section">

        <div className="profile-section-heading">

          <span>
            03 • AYURVISION AI
          </span>

          <h2>
            Latest Skin Analysis
          </h2>

        </div>

        <div className="latest-analysis-card">

          <div className="analysis-symbol">
            ⌘
          </div>

          <div className="latest-analysis-content">

            <span>
              LAST ANALYSIS
            </span>

            <h3>
              {skinType}
            </h3>

            <p>
              {hydration} hydration •{" "}
              {concern} •{" "}
              {dominantDosha || "Not tested"}
            </p>

          </div>

          <button
            className="view-analysis-button"
            onClick={() =>
              navigate("/skin-scan")
            }
          >
            View Analysis →
          </button>

        </div>

      </div>

      {/* =====================================================
          04 — HOME REMEDIES
      ===================================================== */}

      <div className="profile-section">

        <div className="profile-section-heading">

          <span>
            04 • PERSONALIZED CARE
          </span>

          <h2>
            Recommended Home Remedies
          </h2>

          <p className="profile-section-description">
            Gentle Ayurvedic-inspired suggestions based on
            your Dosha balance.
          </p>

        </div>

        {recommendedRemedies.length > 0 ? (

          <div className="profile-remedies-grid">

            {recommendedRemedies.map(
              (remedy, index) => (

                <div
                  className="profile-remedy-card"
                  key={index}
                >

                  <div className="remedy-number">
                    0{index + 1}
                  </div>

                  <div className="remedy-icon">
                    {remedy.icon}
                  </div>

                  <span className="remedy-category">
                    {remedy.category}
                  </span>

                  <h3>
                    {remedy.title}
                  </h3>

                  <p>
                    {remedy.description}
                  </p>

                  <div className="remedy-ingredients">

                    <span>
                      INGREDIENTS
                    </span>

                    <p>
                      {remedy.ingredients}
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        ) : (

          <div className="empty-remedies">

            <span>
              🌸
            </span>

            <h3>
              Begin Your AyurAI Journey
            </h3>

            <p>
              Complete the Dosha Test to unlock personalized
              Ayurvedic care suggestions.
            </p>

            <button
              onClick={() =>
                navigate("/dosha-test")
              }
            >
              Take Dosha Test →
            </button>

          </div>

        )}

      </div>

      {/* =====================================================
          05 — DOSHA JOURNEY
      ===================================================== */}

      <div className="profile-section">

        <div className="dosha-profile-card">

          <div>

            <span>
              05 • DOSHA TEST
            </span>

            <h2>
              Your Dosha Journey
            </h2>

            <p>
              Your current dominant Ayurvedic balance is{" "}
              <strong>
                {dominantDosha || "Not tested"}
              </strong>.
            </p>

          </div>

          <button
            className="retake-button"
            onClick={() =>
              navigate("/dosha-test")
            }
          >
            Retake Dosha Test →
          </button>

        </div>

      </div>

      {/* =====================================================
          06 — HISTORY
      ===================================================== */}

      <div className="profile-section">

        <div className="profile-section-heading">

          <span>
            06 • HISTORY
          </span>

          <h2>
            Skin Analysis History
          </h2>

        </div>

        <div className="history-list">

          {doshaCompleted && (

            <div className="history-item">

              <div className="history-date">

                <strong>
                  {doshaResult?.completedAt
                    ? new Date(
                        doshaResult.completedAt
                      ).getDate()
                    : "--"}
                </strong>

                <span>
                  {doshaResult?.completedAt
                    ? new Date(
                        doshaResult.completedAt
                      )
                        .toLocaleString(
                          "en-US",
                          {
                            month: "short",
                          }
                        )
                        .toUpperCase()
                    : "---"}
                </span>

              </div>

              <div className="history-info">

                <h3>
                  Ayurvedic Dosha Test
                </h3>

                <p>
                  Primary balance •{" "}
                  {dominantDosha || "Not tested"}
                </p>

              </div>

              <span className="history-status">
                Completed
              </span>

            </div>

          )}

          {skinCompleted && (

            <div className="history-item">

              <div className="history-date">

                <strong>
                  {skinScanResult?.completedAt
                    ? new Date(
                        skinScanResult.completedAt
                      ).getDate()
                    : "--"}
                </strong>

                <span>
                  {skinScanResult?.completedAt
                    ? new Date(
                        skinScanResult.completedAt
                      )
                        .toLocaleString(
                          "en-US",
                          {
                            month: "short",
                          }
                        )
                        .toUpperCase()
                    : "---"}
                </span>

              </div>

              <div className="history-info">

                <h3>
                  AI Skin Scan
                </h3>

                <p>
                  {skinType} •{" "}
                  {hydration} hydration
                </p>

              </div>

              <span className="history-status">
                Completed
              </span>

            </div>

          )}

          {!doshaCompleted &&
            !skinCompleted && (

              <div className="history-item">

                <div className="history-info">

                  <h3>
                    No assessments yet
                  </h3>

                  <p>
                    Complete your Skin Scan or Dosha Test
                    to begin your AyurAI journey.
                  </p>

                </div>

              </div>

            )}

        </div>

      </div>

      {/* DISCLAIMER */}

      <p
        className="analysis-disclaimer"
        style={{
          marginTop: "30px",
        }}
      >
        AyurAI provides AI-estimated visual observations
        and educational Ayurvedic guidance only. These
        results are not a medical diagnosis.
      </p>

    </section>
  );
};

export default UserProfile;