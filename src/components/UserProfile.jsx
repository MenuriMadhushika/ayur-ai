import React, { useState } from "react";
import "./UserProfile.css";

const UserProfile = () => {

  // =====================================================
  // GET SAVED DOSHA RESULT
  // =====================================================

  const getDoshaResult = () => {
    try {
      const saved = localStorage.getItem(
        "ayuraiDoshaResult"
      );

      return saved ? JSON.parse(saved) : null;

    } catch (error) {
      console.error(
        "Unable to load Dosha result:",
        error
      );

      return null;
    }
  };

  const savedDosha = getDoshaResult();

  // =====================================================
  // USER DATA
  // =====================================================

  const [user, setUser] = useState({

    name: "AyurAI User",

    email: "user@ayurai.com",

    age: "23",

    dosha:
      savedDosha?.dominant ||
      "Not tested",

    skinType:
      "Not analyzed",

    hydration:
      "Not analyzed",

    concern:
      "Not analyzed",

  });

  // =====================================================
  // EDIT STATE
  // =====================================================

  const [editing, setEditing] =
    useState(false);

  const [editForm, setEditForm] =
    useState({

      name: user.name,

      email: user.email,

      age: user.age,

    });

  // =====================================================
  // EDIT PROFILE
  // =====================================================

  const handleEdit = () => {

    setEditForm({

      name: user.name,

      email: user.email,

      age: user.age,

    });

    setEditing(true);
  };

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {

    const {
      name,
      value,
    } = event.target;

    setEditForm((previous) => ({

      ...previous,

      [name]: value,

    }));
  };

  // =====================================================
  // SAVE PROFILE
  // =====================================================

  const handleSave = () => {

    setUser((previous) => ({

      ...previous,

      name: editForm.name,

      email: editForm.email,

      age: editForm.age,

    }));

    setEditing(false);
  };

  // =====================================================
  // CANCEL
  // =====================================================

  const handleCancel = () => {

    setEditing(false);
  };

  // =====================================================
  // REFRESH DOSHA
  // =====================================================

  const refreshDosha = () => {

    const latestDosha =
      getDoshaResult();

    setUser((previous) => ({

      ...previous,

      dosha:
        latestDosha?.dominant ||
        "Not tested",

    }));
  };

  // =====================================================
  // DOSHA PERCENTAGES
  // =====================================================

  const percentages =
    savedDosha?.percentages || {

      vata: 0,

      pitta: 0,

      kapha: 0,

    };

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

          <span>
            Skin Journey
          </span>

        </h1>

        <p>

          Your Ayurvedic skin profile,
          AI analysis and personalized
          skincare journey in one place.

        </p>

      </div>


      {/* =================================================
          PROFILE CARD
      ================================================= */}

      <div className="profile-main-card">

        <div className="profile-avatar">

          {user.name
            .charAt(0)
            .toUpperCase()}

        </div>


        <div className="profile-user-info">

          <h2>
            {user.name}
          </h2>

          <p>
            {user.email}
          </p>

          <span className="profile-age">
            Age {user.age}
          </span>

          <span className="profile-status">
            ✦ AyurAI Skin Explorer
          </span>

        </div>


        <button
          className="edit-profile-button"
          onClick={handleEdit}
        >
          ✎ Edit Profile
        </button>

      </div>


      {/* =================================================
          EDIT PROFILE MODAL
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

                {editForm.name
                  .charAt(0)
                  .toUpperCase() || "A"}

              </div>


              <div>

                <span className="profile-modal-label">

                  AYURAI • PERSONAL DETAILS

                </span>

                <h2>
                  Edit Your Profile
                </h2>

                <p>
                  Make your AyurAI experience truly yours.
                </p>

              </div>

            </div>


            {/* FORM */}

            <div className="profile-form">

              <div className="profile-input-group">

                <label>
                  ✦ FULL NAME
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
                  ✉ EMAIL ADDRESS
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
                  ◌ AGE
                </label>

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
                ✓ Save Changes
              </button>

            </div>


            <p className="profile-modal-footer">

              ✦ Your AyurAI journey,
              beautifully personalized.

            </p>

          </div>

        </div>

      )}


      {/* =================================================
          AYURVEDIC PROFILE
      ================================================= */}

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
              {user.dosha}
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
              {user.skinType}
            </strong>

            <small>
              Based on your AI analysis
            </small>

          </div>


          <div className="profile-stat hydration-stat">

            <span>
              HYDRATION
            </span>

            <strong>
              {user.hydration}
            </strong>

            <small>
              Current skin hydration
            </small>

          </div>


          <div className="profile-stat concern-stat">

            <span>
              MAIN CONCERN
            </span>

            <strong>
              {user.concern}
            </strong>

            <small>
              Visible skin concern
            </small>

          </div>

        </div>

      </div>


      {/* =================================================
          DOSHA BREAKDOWN
      ================================================= */}

      <div className="profile-section">

        <div className="profile-section-heading">

          <span>
            02 • DOSHA BALANCE
          </span>

          <h2>
            Your Ayurvedic Energy
          </h2>

        </div>


        <div className="profile-dosha-card">

          <div className="profile-dosha-title">

            <span>
              PRIMARY DOSHA
            </span>

            <strong>
              {user.dosha}
            </strong>

          </div>


          <div className="profile-dosha-bars">

            <div className="profile-dosha-row">

              <div>

                <span>
                  Vata
                </span>

                <strong>
                  {percentages.vata}%
                </strong>

              </div>

              <div className="profile-progress">

                <div
                  style={{
                    width:
                      `${percentages.vata}%`,
                  }}
                />

              </div>

            </div>


            <div className="profile-dosha-row">

              <div>

                <span>
                  Pitta
                </span>

                <strong>
                  {percentages.pitta}%
                </strong>

              </div>

              <div className="profile-progress">

                <div
                  style={{
                    width:
                      `${percentages.pitta}%`,
                  }}
                />

              </div>

            </div>


            <div className="profile-dosha-row">

              <div>

                <span>
                  Kapha
                </span>

                <strong>
                  {percentages.kapha}%
                </strong>

              </div>

              <div className="profile-progress">

                <div
                  style={{
                    width:
                      `${percentages.kapha}%`,
                  }}
                />

              </div>

            </div>

          </div>


          <button
            className="profile-refresh-button"
            onClick={refreshDosha}
          >
            ↻ Refresh Dosha Result
          </button>

        </div>

      </div>


      {/* =================================================
          LATEST ANALYSIS
      ================================================= */}

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
            ✦
          </div>


          <div className="latest-analysis-content">

            <span>
              LAST ANALYSIS
            </span>

            <h3>
              {user.skinType}
            </h3>

            <p>
              {user.hydration} hydration •{" "}
              {user.concern} •{" "}
              {user.dosha}
            </p>

          </div>


          <button className="view-analysis-button">
            View Analysis →
          </button>

        </div>

      </div>


      {/* =================================================
          RECOMMENDATIONS
      ================================================= */}

      <div className="profile-section">

        <div className="profile-section-heading">

          <span>
            04 • PERSONALIZED CARE
          </span>

          <h2>
            Recommended For You
          </h2>

        </div>


        <div className="profile-products">

          <div className="profile-product-card">

            <div className="product-placeholder">
              ✦
            </div>

            <span>
              AYURVEDIC CARE
            </span>

            <h3>
              Coconut Body Oil
            </h3>

            <button>
              View Product →
            </button>

          </div>


          <div className="profile-product-card">

            <div className="product-placeholder">
              ✦
            </div>

            <span>
              CALMING CARE
            </span>

            <h3>
              Neem & Turmeric
            </h3>

            <button>
              View Product →
            </button>

          </div>


          <div className="profile-product-card">

            <div className="product-placeholder">
              ✦
            </div>

            <span>
              BALANCING CARE
            </span>

            <h3>
              Sandalwood Care
            </h3>

            <button>
              View Product →
            </button>

          </div>

        </div>

      </div>


      {/* =================================================
          DOSHA JOURNEY
      ================================================= */}

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

              Your current dominant
              Ayurvedic balance is

              <strong>
                {" "}
                {user.dosha}
              </strong>.

            </p>

          </div>


          <button className="retake-button">

            Retake Dosha Test →

          </button>

        </div>

      </div>


      {/* =================================================
          HISTORY
      ================================================= */}

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

          <div className="history-item">

            <div className="history-date">

              <strong>
                18
              </strong>

              <span>
                AUG
              </span>

            </div>


            <div className="history-info">

              <h3>
                Ayurvedic Dosha Test
              </h3>

              <p>
                Primary balance •{" "}
                {user.dosha}
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