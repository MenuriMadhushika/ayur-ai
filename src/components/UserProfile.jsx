import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./UserProfile.css";

import { getAssessmentStatus } from "../utils/assessmentStatus";
import API_BASE_URL, {
  getAuthenticatedHeaders,
  getAuthenticatedJsonHeaders,
} from "../utils/api";
import { getDoshaInfo } from "../utils/doshaInfo";
import { formatAcneSeverity } from "../utils/acneSeverityInfo";

/* =========================================================
   AYURAI — USER PROFILE
   Loads profile, Skin Scan, and Dosha information.
========================================================= */

const profileIcons = [
  { id: "butterfly", symbol: "🦋", name: "Butterfly" },
  { id: "lotus", symbol: "🪷", name: "Lotus" },
  { id: "leaf", symbol: "🍃", name: "Leaf" },
  { id: "flower", symbol: "🌺", name: "Flower" },
  { id: "sun", symbol: "☀️", name: "Sun" },
  { id: "botanical", symbol: "🌿", name: "Botanical" },
];

/* Home suggestions shown after the Dosha Test. */
const _remediesByDosha = {
  Vata: [
    {
      icon: "🌿🥥",
      category: "HYDRATING CARE",
      title: "Aloe Vera & Coconut Care",
      description: "A gentle moisturizing ritual for dry-feeling skin.",
      ingredients: "Aloe vera gel + a small amount of coconut oil",
    },
    {
      icon: "🥒",
      category: "SOOTHING CARE",
      title: "Cucumber & Aloe Mask",
      description: "A refreshing ritual for comfortable-looking skin.",
      ingredients: "Fresh cucumber + pure aloe vera gel",
    },
    {
      icon: "🌾🍯",
      category: "GENTLE CARE",
      title: "Oat & Honey Mask",
      description: "A gentle mask for soft and comfortable-looking skin.",
      ingredients: "Finely ground oats + a small amount of honey",
    },
  ],

  Pitta: [
    {
      icon: "🌿",
      category: "COOLING CARE",
      title: "Aloe Vera Cooling Care",
      description: "A simple ritual for skin that feels warm or sensitive.",
      ingredients: "Pure aloe vera gel",
    },
    {
      icon: "🥒",
      category: "SOOTHING CARE",
      title: "Cucumber & Aloe Mask",
      description: "A refreshing combination for a calm skin feeling.",
      ingredients: "Fresh cucumber + pure aloe vera gel",
    },
    {
      icon: "🌾🥛",
      category: "GENTLE CARE",
      title: "Oat & Yogurt Care",
      description: "A gentle home ritual for sensitive-looking skin.",
      ingredients: "Finely ground oats + plain yogurt",
    },
  ],

  Kapha: [
    {
      icon: "🍃",
      category: "BALANCING CARE",
      title: "Neem & Aloe Care",
      description: "A botanical-inspired ritual for oily-looking skin.",
      ingredients: "Aloe vera gel + a small amount of neem powder",
    },
    {
      icon: "🪨🌹",
      category: "CLARIFYING CARE",
      title: "Multani Mitti & Rose Water",
      description: "A traditional ritual for excess surface oil.",
      ingredients: "Multani mitti + rose water",
    },
    {
      icon: "🥒",
      category: "REFRESHING CARE",
      title: "Cucumber Refresh",
      description: "A light and refreshing ritual for a clean skin feeling.",
      ingredients: "Fresh cucumber",
    },
  ],
};

/* =========================================================
   SMALL HELPERS
========================================================= */

const readSavedData = (key) => {
  try {
    const savedValue = localStorage.getItem(key);
    return savedValue ? JSON.parse(savedValue) : null;
  } catch (error) {
    console.error(`Unable to read ${key}:`, error);
    return null;
  }
};

const normalizeDosha = (value) => {
  const normalized = String(value || "").trim().toLowerCase();

  if (normalized === "vata") return "Vata";
  if (normalized === "pitta") return "Pitta";
  if (normalized === "kapha") return "Kapha";

  return "";
};

const formatDate = (value) => {
  if (!value) return { day: "--", month: "---" };

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return { day: "--", month: "---" };
  }

  return {
    day: date.getDate(),
    month: date
      .toLocaleString("en-US", { month: "short" })
      .toUpperCase(),
  };
};

/* =========================================================
   COMPONENT
========================================================= */

const UserProfile = () => {
  const navigate = useNavigate();

  /* User information saved after login/register. */
  const [user, setUser] = useState(() => {
    const savedUser = readSavedData("ayuraiUser");

    return {
      id: savedUser?.id || localStorage.getItem("ayuraiUserId") || null,
      name: savedUser?.name || "AyurAI User",
      email: savedUser?.email || "user@ayurai.com",
      age: savedUser?.age ?? "",
      icon: savedUser?.icon || savedUser?.profileIcon || "butterfly",
    };
  });

  const [doshaResult, setDoshaResult] = useState(() =>
    readSavedData("ayuraiDoshaResult")
  );

  const [skinScanResult, setSkinScanResult] = useState(() => {
    return (
      readSavedData("ayuraiSkinScanResult") ||
      readSavedData("ayuraiSkinResult")
    );
  });

  const [assessmentStatus, setAssessmentStatus] = useState(() => {
    try {
      return getAssessmentStatus() || {};
    } catch {
      return {};
    }
  });

  const [loadingAssessments, setLoadingAssessments] = useState(false);
  const [editing, setEditing] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    age: user.age,
    icon: user.icon,
  });

  /* =======================================================
     BACKEND USER PROFILE
  ======================================================= */

  const loadUser = async () => {
    const userId = localStorage.getItem("ayuraiUserId");

    if (!userId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: getAuthenticatedHeaders(),
      });

      if (!response.ok) return;

      const data = await response.json();

      const backendUser = {
        id: data.id,
        name: data.name || "AyurAI User",
        email: data.email || "user@ayurai.com",
        age: data.age ?? "",
        icon: data.profileIcon || data.icon || "butterfly",
      };

      setUser(backendUser);

      setEditForm({
        name: backendUser.name,
        email: backendUser.email,
        age: backendUser.age,
        icon: backendUser.icon,
      });

      localStorage.setItem("ayuraiUser", JSON.stringify(backendUser));
    } catch (error) {
      console.error("Unable to load profile:", error);
    }
  };

  /* =======================================================
     BACKEND ASSESSMENTS
  ======================================================= */

  const loadAssessmentResults = async () => {
    const userId = localStorage.getItem("ayuraiUserId");

    if (!userId) return;

    setLoadingAssessments(true);

    try {
      const [doshaResponse, skinResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/dosha-assessments/user/${userId}/latest`, {
          headers: getAuthenticatedHeaders(),
        }),
        fetch(`${API_BASE_URL}/skin-scans/user/${userId}/latest`, {
          headers: getAuthenticatedHeaders(),
        }),
      ]);

      if (doshaResponse.ok) {
        const data = await doshaResponse.json();

        const vataScore = Number(data.vataScore) || 0;
        const pittaScore = Number(data.pittaScore) || 0;
        const kaphaScore = Number(data.kaphaScore) || 0;
        const totalScore = vataScore + pittaScore + kaphaScore;

        let vataPercentage = Number(data.vataPercentage);
        let pittaPercentage = Number(data.pittaPercentage);
        let kaphaPercentage = Number(data.kaphaPercentage);

        const percentagesMissing =
          !Number.isFinite(vataPercentage) ||
          !Number.isFinite(pittaPercentage) ||
          !Number.isFinite(kaphaPercentage);

        if (percentagesMissing && totalScore > 0) {
          vataPercentage = Math.round((vataScore / totalScore) * 100);
          pittaPercentage = Math.round((pittaScore / totalScore) * 100);
          kaphaPercentage = 100 - vataPercentage - pittaPercentage;
        }

        const scores = {
          Vata: vataScore,
          Pitta: pittaScore,
          Kapha: kaphaScore,
        };

        let dominantDosha = normalizeDosha(data.dominantDosha);

        if (!dominantDosha && totalScore > 0) {
          dominantDosha = Object.entries(scores).sort(
            (first, second) => second[1] - first[1]
          )[0][0];
        }

        const processedDosha = {
          ...data,
          dominantDosha,
          percentages: {
            Vata: vataPercentage || 0,
            Pitta: pittaPercentage || 0,
            Kapha: kaphaPercentage || 0,
          },
          completed: true,
          completedAt: data.createdAt || data.completedAt,
        };

        setDoshaResult(processedDosha);

        localStorage.setItem(
          "ayuraiDoshaResult",
          JSON.stringify(processedDosha)
        );
      }

      if (skinResponse.ok) {
        const data = await skinResponse.json();

        const processedSkin = {
          ...data,
          skinType:
            data.estimatedSkinType || "Uncertain",
          texture:
            data.visibleCharacteristics || data.texture || "Not analyzed",
          hydration:
            data.hydration ?? data.hydrationPercentage ?? null,
          completed:
            String(data.analysisStatus || "").toUpperCase() === "COMPLETED",
          completedAt: data.createdAt || data.completedAt,
        };

        setSkinScanResult(processedSkin);

        localStorage.setItem(
          "ayuraiSkinScanResult",
          JSON.stringify(processedSkin)
        );
      }

      setAssessmentStatus(getAssessmentStatus() || {});
    } catch (error) {
      console.error("Unable to load assessments:", error);

      setDoshaResult(readSavedData("ayuraiDoshaResult"));
      setSkinScanResult(readSavedData("ayuraiSkinScanResult"));
    } finally {
      setLoadingAssessments(false);
    }
  };

  useEffect(() => {
    loadUser();
    loadAssessmentResults();

    const refreshProfile = () => {
      loadAssessmentResults();
    };

    window.addEventListener("storage", refreshProfile);
    window.addEventListener(
      "ayurai-assessment-updated",
      refreshProfile
    );
    window.addEventListener(
      "ayuraiAssessmentUpdated",
      refreshProfile
    );

    return () => {
      window.removeEventListener("storage", refreshProfile);
      window.removeEventListener(
        "ayurai-assessment-updated",
        refreshProfile
      );
      window.removeEventListener(
        "ayuraiAssessmentUpdated",
        refreshProfile
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
      icon: user.icon,
    });

    setEditing(true);
  };

  const handleSave = async () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      setProfileError("Please enter your name and email.");
      return;
    }

    const userId = user.id || localStorage.getItem("ayuraiUserId");

    if (!userId) {
      setProfileError("User session not found. Please log in again.");
      return;
    }

    setSavingProfile(true);
    setProfileError("");

    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: getAuthenticatedJsonHeaders(),
        body: JSON.stringify({
          name: editForm.name.trim(),
          email: editForm.email.trim().toLowerCase(),
          age: editForm.age ? Number(editForm.age) : null,
          profileIcon: editForm.icon,
        }),
      });

      if (!response.ok) {
        throw new Error("Profile update failed.");
      }

      const data = await response.json();

      const updatedUser = {
        id: data.id || userId,
        name: data.name || editForm.name.trim(),
        email: data.email || editForm.email.trim().toLowerCase(),
        age: data.age ?? editForm.age,
        icon: data.profileIcon || editForm.icon,
      };

      setUser(updatedUser);
      localStorage.setItem("ayuraiUser", JSON.stringify(updatedUser));
      setEditing(false);
    } catch (error) {
      console.error("Unable to save profile:", error);
      setProfileError("Unable to save changes. Please try again.");
    } finally {
      setSavingProfile(false);
    }
  };

  /* =======================================================
     USER-FRIENDLY DOSHA LABELS
  ======================================================= */

  const dominantDosha = normalizeDosha(doshaResult?.dominantDosha);

  const dominantInfo = getDoshaInfo(dominantDosha);
  const vataInfo = getDoshaInfo("Vata");
  const pittaInfo = getDoshaInfo("Pitta");
  const kaphaInfo = getDoshaInfo("Kapha");

  const dominantLabel = dominantDosha
    ? dominantInfo.label
    : "Not tested";

  const percentages = doshaResult?.percentages || {};

  const vata = Number(percentages.Vata) || 0;
  const pitta = Number(percentages.Pitta) || 0;
  const kapha = Number(percentages.Kapha) || 0;
  const totalPercentage = vata + pitta + kapha;

  const acneSeverity = skinScanResult?.skinType
    ? formatAcneSeverity(skinScanResult.skinType)
    : "Not analyzed";
  const skinCompleted = Boolean(
    assessmentStatus?.skinScanCompleted || skinScanResult?.completed
  );

  const doshaCompleted = Boolean(
    assessmentStatus?.doshaCompleted ||
      assessmentStatus?.doshaTestCompleted ||
      doshaResult?.completed
  );

  const selectedIcon =
    profileIcons.find((item) => item.id === user.icon) ||
    profileIcons[0];

  const wellnessIdeasReady = doshaCompleted;

  const doshaDate = formatDate(doshaResult?.completedAt);
  const skinDate = formatDate(skinScanResult?.completedAt);

  return (
    <section className="profile-page">
      {/* ===================================================
          PROFILE HEADER
      =================================================== */}

      <header className="profile-header">
        <span className="profile-label">AYURAI · MY PROFILE</span>

        <h1>
          Your Personal <span>Skin Journey</span>
        </h1>

        <p>
          Keep your AI Skin Scan and separate Dosha wellness result
          in one calm place.
        </p>
      </header>

      {/* ===================================================
          USER DETAILS
      =================================================== */}

      <section className="profile-main-card">
        <div className="profile-avatar">{selectedIcon.symbol}</div>

        <div className="profile-user-info">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <span>{user.age ? `Age ${user.age}` : "Age not set"}</span>
        </div>

        <button
          type="button"
          className="edit-profile-button"
          onClick={handleEdit}
        >
          Edit Profile
        </button>
      </section>

      {/* ===================================================
          PROFILE EDIT MODAL
      =================================================== */}

      {editing && (
        <div
          className="edit-profile-overlay"
          onClick={() => setEditing(false)}
        >
          <div
            className="edit-profile-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="profile-modal-close"
              onClick={() => setEditing(false)}
              aria-label="Close profile editor"
            >
              ×
            </button>

            <div className="profile-modal-header">
              <div className="profile-modal-avatar">
                {
                  profileIcons.find(
                    (item) => item.id === editForm.icon
                  )?.symbol
                }
              </div>

              <div>
                <span>AYURAI · PERSONAL DETAILS</span>
                <h2>Edit Your Profile</h2>
                <p>Personalize your AyurAI profile.</p>
              </div>
            </div>

            <div className="profile-icon-section">
              <label>CHOOSE YOUR PROFILE SYMBOL</label>

              <div className="profile-icon-grid">
                {profileIcons.map((icon) => (
                  <button
                    type="button"
                    key={icon.id}
                    className={`profile-icon-option ${
                      editForm.icon === icon.id ? "selected" : ""
                    }`}
                    onClick={() =>
                      setEditForm((previous) => ({
                        ...previous,
                        icon: icon.id,
                      }))
                    }
                    title={icon.name}
                  >
                    {icon.symbol}
                  </button>
                ))}
              </div>
            </div>

            <div className="profile-form">
              <label>
                FULL NAME
                <input
                  value={editForm.name}
                  onChange={(event) =>
                    setEditForm((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Your full name"
                />
              </label>

              <label>
                EMAIL ADDRESS
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(event) =>
                    setEditForm((previous) => ({
                      ...previous,
                      email: event.target.value,
                    }))
                  }
                  placeholder="Your email address"
                />
              </label>

              <label>
                AGE
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={editForm.age}
                  onChange={(event) =>
                    setEditForm((previous) => ({
                      ...previous,
                      age: event.target.value,
                    }))
                  }
                  placeholder="Your age"
                />
              </label>
            </div>

            {profileError && (
              <p className="profile-form-error">{profileError}</p>
            )}

            <div className="profile-modal-actions">
              <button
                type="button"
                className="profile-cancel-button"
                onClick={() => setEditing(false)}
                disabled={savingProfile}
              >
                Cancel
              </button>

              <button
                type="button"
                className="profile-save-button"
                onClick={handleSave}
                disabled={savingProfile}
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================
          QUICK INSIGHTS
      =================================================== */}

      <section className="profile-section">
        <div className="profile-section-heading">
          <span>01 · YOUR INSIGHTS</span>
          <h2>Your Results at a Glance</h2>
        </div>

        <div className="profile-stats">
          <article className="profile-stat dosha-stat">
            <span>YOUR AYURVEDIC PATTERN</span>
            <strong>{dominantLabel}</strong>
            <small>
              {dominantDosha
                ? dominantInfo.shortLabel
                : "Complete the Dosha Test"}
            </small>
          </article>

          <article className="profile-stat skin-stat">
            <span>ACNE-LIKE SEVERITY</span>
            <strong>{acneSeverity}</strong>
            <small>Estimated by the AI Skin Scan</small>
          </article>

        </div>
      </section>

      {/* ===================================================
          SKIN BALANCE
      =================================================== */}

      <section className="profile-section">
        <div className="profile-section-heading">
          <span>02 · AYURVEDIC WELLNESS PATTERN</span>
          <h2>Your Dosha Result</h2>
          <p>
            Vata, Pitta, and Kapha are Ayurvedic wellness patterns. They are
            considered separately from your AI Skin Scan.
          </p>
        </div>

        <div className="dosha-balance-card">
          <div
            className="dosha-circle"
            style={{
              background:
                totalPercentage > 0
                  ? `conic-gradient(
                      #6f8da8 0 ${vata}%,
                      #c9785d ${vata}% ${vata + pitta}%,
                      #b48a42 ${vata + pitta}% 100%
                    )`
                  : "#e5dfd2",
            }}
          >
            <div className="dosha-circle-inner">
              <span>PRIMARY PATTERN</span>
              <strong>{dominantLabel}</strong>
              <small>
                {dominantDosha
                  ? dominantInfo.shortLabel
                  : "Take the assessment"}
              </small>
            </div>
          </div>

          <div className="dosha-legend">
            <div className="dosha-legend-item">
              <span className="legend-dot vata-dot" />
              <div>
                <strong>{vataInfo.label}</strong>
                <small>{vata}%</small>
              </div>
            </div>

            <div className="dosha-legend-item">
              <span className="legend-dot pitta-dot" />
              <div>
                <strong>{pittaInfo.label}</strong>
                <small>{pitta}%</small>
              </div>
            </div>

            <div className="dosha-legend-item">
              <span className="legend-dot kapha-dot" />
              <div>
                <strong>{kaphaInfo.label}</strong>
                <small>{kapha}%</small>
              </div>
            </div>

            <button
              type="button"
              className="profile-refresh-button"
              onClick={loadAssessmentResults}
              disabled={loadingAssessments}
            >
              {loadingAssessments ? "Refreshing..." : "Refresh Results"}
            </button>
          </div>
        </div>
      </section>

      {/* ===================================================
          LATEST SCAN
      =================================================== */}

      <section className="profile-section">
        <div className="profile-section-heading">
          <span>03 · LATEST SKIN SCAN</span>
          <h2>Your Latest Skin Scan</h2>
        </div>

        <div className="latest-analysis-card">
          <div className="analysis-symbol">✦</div>

          <div className="latest-analysis-content">
            <span>AI ACNE-SEVERITY ESTIMATE</span>
            <h3>{acneSeverity}</h3>
            <p>{skinCompleted ? `Completed ${skinDate.day} ${skinDate.month}` : "No Skin Scan completed"}</p>
          </div>

          <button
            type="button"
            className="view-analysis-button"
            onClick={() => navigate("/skin-scan")}
          >
            View Skin Scan →
          </button>
        </div>
      </section>

      {/* ===================================================
          RECOMMENDED HOME REMEDIES
      =================================================== */}

      <section className="profile-section">
        <div className="profile-section-heading">
          <span>04 · WELLNESS LIBRARY</span>
          <h2>Optional Wellness Ideas</h2>
          <p>
            General self-care ideas kept separate from your acne-severity estimate.
          </p>
        </div>

        {wellnessIdeasReady ? (
          <div className="profile-care-decision profile-care-ready">
            <span className="profile-care-icon">✦</span>
            <div>
              <span>YOUR WELLNESS PATTERN IS READY</span>
              <h3>Explore general wellness ideas.</h3>
              <p>
                Browse optional ideas associated with your Ayurvedic wellness pattern.
              </p>
            </div>

            <button type="button" onClick={() => navigate("/home-remedies")}>
              Explore Wellness Ideas →
            </button>
          </div>
        ) : (
          <div className="profile-care-decision">
            <span className="profile-care-icon">◌</span>
            <div>
              <span>ONE STEP AT A TIME</span>
              <h3>Complete the Dosha Test to see suggested ideas.</h3>
              <p>
                Wellness ideas are associated only with your Ayurvedic
                questionnaire result, never with the acne model.
              </p>
            </div>

            <button type="button" onClick={() => navigate("/dosha-test")}>
              Complete Dosha Test →
            </button>
          </div>
        )}
      </section>

      {/* ===================================================
          ASSESSMENT JOURNEY
      =================================================== */}

      <section className="dosha-profile-card">
        <div>
          <span>05 · DOSHA TEST</span>
          <h2>Your Ayurvedic Wellness Journey</h2>

          <p>
            Your current primary wellness pattern is{" "}
            <strong>{dominantLabel}</strong>.
          </p>
        </div>

        <button
          type="button"
          className="retake-button"
          onClick={() => navigate("/dosha-test")}
        >
          Retake Assessment →
        </button>
      </section>

      {/* ===================================================
          ASSESSMENT HISTORY
      =================================================== */}

      <section className="profile-section">
        <div className="profile-section-heading">
          <span>06 · HISTORY</span>
          <h2>Assessment History</h2>
        </div>

        <div className="history-list">
          {doshaCompleted && (
            <article className="history-item">
              <div className="history-date">
                <strong>{doshaDate.day}</strong>
                <span>{doshaDate.month}</span>
              </div>

              <div className="history-info">
                <h3>Dosha Test</h3>
                <p>Primary Ayurvedic pattern · {dominantLabel}</p>
              </div>

              <span className="history-status">Completed</span>
            </article>
          )}

          {skinCompleted && (
            <article className="history-item">
              <div className="history-date">
                <strong>{skinDate.day}</strong>
                <span>{skinDate.month}</span>
              </div>

              <div className="history-info">
                <h3>Skin Scan</h3>
                <p>
                  Acne-like severity · {acneSeverity}
                </p>
              </div>

              <span className="history-status">Completed</span>
            </article>
          )}

          {!doshaCompleted && !skinCompleted && (
            <div className="empty-history">
              <span>⌘</span>
              <p>Your completed assessments will appear here.</p>
            </div>
          )}
        </div>
      </section>

      <p className="analysis-disclaimer">
        AyurAI provides an educational acne-like severity estimate and separate
        Ayurvedic wellness guidance. It does not diagnose, treat, or prevent
        medical conditions.
      </p>
    </section>
  );
};

export default UserProfile;
