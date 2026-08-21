import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";

const profileIcons = [
  { id: "lotus", symbol: "🌸", name: "Lotus" },
  { id: "leaf", symbol: "🍃", name: "Leaf" },
  { id: "flower", symbol: "🌺", name: "Flower" },
  { id: "sun", symbol: "☀️", name: "Sun" },
  { id: "butterfly", symbol: "🦋", name: "Butterfly" },
  { id: "botanical", symbol: "🌿", name: "Botanical" },
];

const remediesByDosha = {
  Vata: [
    {
      icon: "🌿",
      category: "HYDRATING CARE",
      title: "Aloe Vera & Coconut Care",
      description:
        "A gentle moisturizing ritual for dry and dehydrated-looking skin.",
      ingredients: "Aloe vera gel + a small amount of coconut oil",
    },
    {
      icon: "🥒",
      category: "NOURISHING CARE",
      title: "Cucumber & Aloe Mask",
      description:
        "A refreshing ritual designed to provide a soothing and hydrated skin feeling.",
      ingredients: "Fresh cucumber + pure aloe vera gel",
    },
    {
      icon: "🌼",
      category: "GENTLE CARE",
      title: "Oat & Honey Mask",
      description:
        "A gentle mask for soft and comfortable-looking skin.",
      ingredients: "Finely ground oats + a small amount of honey",
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
      ingredients: "Fresh cucumber + pure aloe vera gel",
    },
    {
      icon: "🌾",
      category: "GENTLE CARE",
      title: "Oat & Yogurt Care",
      description:
        "A gentle home ritual for sensitive-looking skin.",
      ingredients: "Finely ground oats + plain yogurt",
    },
  ],

  Kapha: [
    {
      icon: "🌿",
      category: "BALANCING CARE",
      title: "Neem & Aloe Care",
      description:
        "A botanical-inspired ritual for oily or congested-looking skin.",
      ingredients: "Aloe vera gel + a small amount of neem powder",
    },
    {
      icon: "🌾",
      category: "CLARIFYING CARE",
      title: "Multani Mitti & Rose Water",
      description:
        "A traditional clay-based ritual that can absorb excess surface oil.",
      ingredients: "Multani mitti + rose water",
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

const UserProfile = () => {
  const navigate = useNavigate();

  // =====================================================
  // DOSHA RESULT
  // =====================================================

  const getDoshaResult = () => {
    try {
      const saved = localStorage.getItem("ayuraiDoshaResult");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const savedDosha = getDoshaResult();

  // =====================================================
  // USER
  // =====================================================

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("ayuraiUser");

    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        // use default
      }
    }

    return {
      name: "AyurAI User",
      email: "user@ayurai.com",
      age: "23",
      icon: "lotus",
      dosha: savedDosha?.dominant || "Not tested",
      skinType: "Not analyzed",
      hydration: "Not analyzed",
      concern: "Not analyzed",
    };
  });

  const [editing, setEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    age: user.age,
    icon: user.icon || "lotus",
  });

  // =====================================================
  // SAVE USER
  // =====================================================

  useEffect(() => {
    localStorage.setItem("ayuraiUser", JSON.stringify(user));
  }, [user]);

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      age: user.age,
      icon: user.icon || "lotus",
    });

    setEditing(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleIconSelect = (iconId) => {
    setEditForm((previous) => ({
      ...previous,
      icon: iconId,
    }));
  };

  const handleSave = () => {
    const updatedUser = {
      ...user,
      name: editForm.name.trim() || "AyurAI User",
      email: editForm.email.trim() || "user@ayurai.com",
      age: editForm.age,
      icon: editForm.icon,
    };

    setUser(updatedUser);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  // =====================================================
  // REFRESH DOSHA
  // =====================================================

  const refreshDosha = () => {
    const latestDosha = getDoshaResult();

    setUser((previous) => ({
      ...previous,
      dosha: latestDosha?.dominant || "Not tested",
    }));
  };

  // =====================================================
  // DOSHA PERCENTAGES
  // =====================================================

  const latestDosha = getDoshaResult();

  const percentages = latestDosha?.percentages || {
    vata: 0,
    pitta: 0,
    kapha: 0,
  };

  const totalPercentage =
    percentages.vata +
    percentages.pitta +
    percentages.kapha;

  // =====================================================
  // PROFILE ICON
  // =====================================================

  const selectedIcon =
    profileIcons.find((item) => item.id === user.icon) ||
    profileIcons[0];

  // =====================================================
  // REMEDIES
  // =====================================================

  const normalizedDosha =
    user.dosha && user.dosha !== "Not tested"
      ? user.dosha.charAt(0).toUpperCase() +
        user.dosha.slice(1).toLowerCase()
      : "";

  const recommendedRemedies =
    remediesByDosha[normalizedDosha] || [];

  // =====================================================
  // UI
  // =====================================================

  return (
    <section className="profile-page">

      {/* =================================================
          HEADER
      ================================================= */}

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


      {/* =================================================
          MAIN PROFILE
      ================================================= */}

      <div className="profile-main-card">

        <div className="profile-avatar">
          {selectedIcon.symbol}
        </div>

        <div className="profile-user-info">

          <h2>{user.name}</h2>

          <p>{user.email}</p>

          <span className="profile-age">
            Age {user.age}
          </span>

        </div>

        <button
          className="edit-profile-button"
          onClick={handleEdit}
        >
          Edit Profile
        </button>

      </div>


      {/* =================================================
          EDIT MODAL
      ================================================= */}

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
                    (item) => item.id === editForm.icon
                  )?.symbol
                }
              </div>

              <div>
                <span className="profile-modal-label">
                  AYURAI • PERSONAL DETAILS
                </span>

                <h2>Edit Your Profile</h2>

                <p>
                  Personalize your AyurAI profile.
                </p>
              </div>

            </div>


            {/* PROFILE ICONS */}

            <div className="profile-icon-section">

              <label>
                CHOOSE YOUR PROFILE SYMBOL
              </label>

              <div className="profile-icon-grid">

                {profileIcons.map((icon) => (

                  <button
                    type="button"
                    key={icon.id}
                    className={`profile-icon-option ${
                      editForm.icon === icon.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleIconSelect(icon.id)
                    }
                    title={icon.name}
                  >
                    <span>{icon.symbol}</span>
                  </button>

                ))}

              </div>

            </div>


            {/* FORM */}

            <div className="profile-form">

              <div className="profile-input-group">

                <label>FULL NAME</label>

                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                />

              </div>


              <div className="profile-input-group">

                <label>EMAIL ADDRESS</label>

                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                />

              </div>


              <div className="profile-input-group">

                <label>AGE</label>

                <input
                  type="number"
                  name="age"
                  value={editForm.age}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  placeholder="Your age"
                />

              </div>

            </div>


            <div className="profile-modal-divider" />

            <div className="profile-modal-actions">

              <button
                className="profile-cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button
                className="profile-save-button"
                onClick={handleSave}
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>
      )}


      {/* =================================================
          01 — AYURVEDIC PROFILE
      ================================================= */}

      <div className="profile-section">

        <div className="profile-section-heading">
          <span>01 • AYURVEDIC PROFILE</span>
          <h2>Understand Your Balance</h2>
        </div>


        <div className="profile-stats">

          <div className="profile-stat dosha-stat">
            <span>YOUR DOSHA</span>
            <strong>{user.dosha}</strong>
            <small>Ayurvedic balance</small>
          </div>

          <div className="profile-stat skin-stat">
            <span>SKIN TYPE</span>
            <strong>{user.skinType}</strong>
            <small>Based on your AI analysis</small>
          </div>

          <div className="profile-stat hydration-stat">
            <span>HYDRATION</span>
            <strong>{user.hydration}</strong>
            <small>Current skin hydration</small>
          </div>

          <div className="profile-stat concern-stat">
            <span>MAIN CONCERN</span>
            <strong>{user.concern}</strong>
            <small>Visible skin concern</small>
          </div>

        </div>

      </div>


      {/* =================================================
          02 — DOSHA BALANCE
      ================================================= */}

      <div className="profile-section">

        <div className="profile-section-heading">
          <span>02 • DOSHA BALANCE</span>
          <h2>Your Ayurvedic Energy</h2>
        </div>


        <div className="dosha-balance-card">

          <div className="dosha-circle-wrapper">

            <div
              className="dosha-circle"
              style={{
                background: `
                  conic-gradient(
                    #b68b4c 0 ${percentages.vata}%,
                    #d47b61 ${percentages.vata}% ${
                      percentages.vata + percentages.pitta
                    }%,
                    #7f9b72 ${
                      percentages.vata + percentages.pitta
                    }% 100%
                  )
                `,
              }}
            >

              <div className="dosha-circle-inner">

                <span>PRIMARY</span>

                <strong>
                  {user.dosha}
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
                <strong>Vata</strong>
                <small>
                  {percentages.vata}%
                </small>
              </div>

            </div>


            <div className="dosha-legend-item">

              <span className="legend-dot pitta-dot" />

              <div>
                <strong>Pitta</strong>
                <small>
                  {percentages.pitta}%
                </small>
              </div>

            </div>


            <div className="dosha-legend-item">

              <span className="legend-dot kapha-dot" />

              <div>
                <strong>Kapha</strong>
                <small>
                  {percentages.kapha}%
                </small>
              </div>

            </div>


            <button
              className="profile-refresh-button"
              onClick={refreshDosha}
            >
              Refresh Dosha Result
            </button>

          </div>

        </div>

      </div>


      {/* =================================================
          03 — LATEST ANALYSIS
      ================================================= */}

      <div className="profile-section">

        <div className="profile-section-heading">
          <span>03 • AYURVISION AI</span>
          <h2>Latest Skin Analysis</h2>
        </div>


        <div className="latest-analysis-card">

          <div className="analysis-symbol">
            ✦
          </div>

          <div className="latest-analysis-content">

            <span>LAST ANALYSIS</span>

            <h3>
              {user.skinType}
            </h3>

            <p>
              {user.hydration} hydration •{" "}
              {user.concern} •{" "}
              {user.dosha}
            </p>

          </div>

          <button
            className="view-analysis-button"
            onClick={() => navigate("/")}
          >
            View Analysis →
          </button>

        </div>

      </div>


      {/* =================================================
          04 — HOME REMEDIES
      ================================================= */}

      <div className="profile-section">

        <div className="profile-section-heading">

          <span>04 • PERSONALIZED CARE</span>

          <h2>Recommended Home Remedies</h2>

          <p className="profile-section-description">
            Gentle Ayurvedic-inspired suggestions
            based on your Dosha balance.
          </p>

        </div>


        {recommendedRemedies.length > 0 ? (

          <div className="profile-remedies-grid">

            {recommendedRemedies.map((remedy, index) => (

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

                  <span>INGREDIENTS</span>

                  <p>
                    {remedy.ingredients}
                  </p>

                </div>

              </div>

            ))}

          </div>

        ) : (

          <div className="empty-remedies">

            <span>🌸</span>

            <h3>
              Begin Your AyurAI Journey
            </h3>

            <p>
              Complete the Dosha Test to unlock
              personalized Ayurvedic care suggestions.
            </p>

            <button
              onClick={() => navigate("/dosha-test")}
            >
              Take Dosha Test →
            </button>

          </div>

        )}

      </div>


      {/* =================================================
          05 — DOSHA JOURNEY
      ================================================= */}

      <div className="profile-section">

        <div className="dosha-profile-card">

          <div>

            <span>05 • DOSHA TEST</span>

            <h2>Your Dosha Journey</h2>

            <p>
              Your current dominant Ayurvedic balance is{" "}
              <strong>{user.dosha}</strong>.
            </p>

          </div>

          <button
            className="retake-button"
            onClick={() => navigate("/dosha-test")}
          >
            Retake Dosha Test →
          </button>

        </div>

      </div>


      {/* =================================================
          06 — HISTORY
      ================================================= */}

      <div className="profile-section">

        <div className="profile-section-heading">

          <span>06 • HISTORY</span>

          <h2>Skin Analysis History</h2>

        </div>


        <div className="history-list">

          <div className="history-item">

            <div className="history-date">

              <strong>18</strong>
              <span>AUG</span>

            </div>

            <div className="history-info">

              <h3>
                Ayurvedic Dosha Test
              </h3>

              <p>
                Primary balance • {user.dosha}
              </p>

            </div>

            <span className="history-status">
              Completed
            </span>

          </div>

        </div>

      </div>

    </section>
  );
};

export default UserProfile;