import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OverallResult.css";

const overallData = {

  vata: {
    dry: {
      title: "Vata + Dry Skin",
      summary:
        "Your Ayurvedic profile appears aligned with Vata characteristics, while your skin analysis suggests a dry skin pattern. Your routine may benefit from gentle cleansing, hydration and moisture support.",
      focus: [
        "Deep hydration",
        "Moisture-locking skincare",
        "Gentle cleansing"
      ],
      remedies: [
        "Apply a small amount of pure aloe vera gel for soothing hydration.",
        "Use a gentle, fragrance-free moisturizer after cleansing.",
        "Stay hydrated throughout the day and include nourishing foods in your diet."
      ]
    },

    sensitive: {
      title: "Vata + Sensitive Skin",
      summary:
        "Your results show a Vata-aligned Ayurvedic profile together with sensitive skin characteristics. A simple, gentle routine may help support your skin barrier.",
      focus: [
        "Gentle skincare",
        "Calming hydration",
        "Barrier support"
      ],
      remedies: [
        "Use plain aloe vera gel if your skin tolerates it.",
        "Avoid harsh scrubs and strongly fragranced products.",
        "Keep your skincare routine simple and consistent."
      ]
    },

    oily: {
      title: "Vata + Oily Skin",
      summary:
        "Your results combine Vata characteristics with visible oily skin characteristics. Focus on maintaining hydration without using overly heavy products.",
      focus: [
        "Lightweight hydration",
        "Gentle cleansing",
        "Balanced skincare"
      ],
      remedies: [
        "Use a lightweight, non-comedogenic moisturizer.",
        "Cleanse gently without over-washing.",
        "Choose simple, soothing skincare rather than harsh oil-stripping products."
      ]
    }
  },

  pitta: {
    dry: {
      title: "Pitta + Dry Skin",
      summary:
        "Your results suggest Pitta characteristics together with dry skin characteristics. Your routine may benefit from calming hydration while avoiding harsh or irritating products.",
      focus: [
        "Cooling hydration",
        "Gentle cleansing",
        "Skin calming"
      ],
      remedies: [
        "Use plain aloe vera gel if your skin tolerates it.",
        "Apply a gentle moisturizer while the skin is slightly damp.",
        "Avoid very hot water when washing your face."
      ]
    },

    sensitive: {
      title: "Pitta + Sensitive Skin",
      summary:
        "Your results show Pitta characteristics together with sensitive skin characteristics. Calming and minimal skincare may be especially appropriate to explore.",
      focus: [
        "Calming care",
        "Gentle products",
        "Cooling hydration"
      ],
      remedies: [
        "Use a simple fragrance-free moisturizer.",
        "Try a cool compress when the skin feels warm or irritated.",
        "Avoid harsh exfoliation and heavily fragranced products."
      ]
    },

    oily: {
      title: "Pitta + Oily Skin",
      summary:
        "Your Ayurvedic profile appears aligned with Pitta while your skin analysis suggests an oily pattern. Focus on gentle cleansing, lightweight hydration and calming care.",
      focus: [
        "Gentle cleansing",
        "Light hydration",
        "Calming skincare"
      ],
      remedies: [
        "Use a gentle cleanser rather than aggressive oil-stripping products.",
        "Choose a lightweight moisturizer.",
        "Keep the skin cool and avoid very hot water."
      ]
    }
  },

  kapha: {
    dry: {
      title: "Kapha + Dry Skin",
      summary:
        "Your results combine Kapha characteristics with dry skin characteristics. Your routine may benefit from gentle cleansing together with sufficient hydration.",
      focus: [
        "Balanced hydration",
        "Gentle cleansing",
        "Skin nourishment"
      ],
      remedies: [
        "Use a gentle cleanser followed by a lightweight moisturizer.",
        "Avoid excessive cleansing that may increase dryness.",
        "Drink enough water and maintain a balanced daily routine."
      ]
    },

    sensitive: {
      title: "Kapha + Sensitive Skin",
      summary:
        "Your results suggest Kapha characteristics together with sensitive skin. Focus on keeping your routine simple, gentle and balanced.",
      focus: [
        "Gentle cleansing",
        "Calming care",
        "Light hydration"
      ],
      remedies: [
        "Use fragrance-free and gentle skincare products.",
        "Avoid harsh scrubbing.",
        "Use a lightweight moisturizer to support the skin barrier."
      ]
    },

    oily: {
      title: "Kapha + Oily Skin",
      summary:
        "Your results show Kapha characteristics together with oily skin characteristics. Your skincare routine may benefit from gentle cleansing and lightweight hydration.",
      focus: [
        "Oil balance",
        "Gentle cleansing",
        "Light hydration"
      ],
      remedies: [
        "Cleanse gently twice daily if appropriate for your skin.",
        "Choose lightweight, non-comedogenic skincare.",
        "Avoid repeatedly washing the face to remove oil."
      ]
    }
  }

};

function OverallResult() {

  const navigate = useNavigate();

  const [doshaResult, setDoshaResult] = useState(null);
  const [skinResult, setSkinResult] = useState(null);

  useEffect(() => {

    // ---------------------------------------------
    // GET DOSHA RESULT
    // ---------------------------------------------

    const savedDosha =
      localStorage.getItem("ayuraiDoshaResult");

    if (savedDosha) {

      try {

        setDoshaResult(
          JSON.parse(savedDosha)
        );

      } catch (error) {

        console.error(
          "Invalid Dosha result",
          error
        );

      }

    }

    // ---------------------------------------------
    // GET SKIN RESULT
    // ---------------------------------------------

    const savedSkin =
      localStorage.getItem("ayuraiSkinAnalysis");

    if (savedSkin) {

      try {

        setSkinResult(
          JSON.parse(savedSkin)
        );

      } catch (error) {

        console.error(
          "Invalid skin analysis",
          error
        );

      }

    }

  }, []);


  // =================================================
  // MISSING RESULTS
  // =================================================

  if (!doshaResult || !skinResult) {

    return (

      <div className="overall-page">

        <div className="overall-empty">

          <span>
            AYURAI • PERSONAL PROFILE
          </span>

          <h1>
            Complete Your
            <br />
            AyurAI Analysis
          </h1>

          <p>
            Complete both your Dosha Test and
            Skin Scan to receive your combined
            personalized result.
          </p>

          <div className="overall-empty-actions">

            {!doshaResult && (

              <button
                onClick={() =>
                  navigate("/dosha-test")
                }
              >
                Take Dosha Test →
              </button>

            )}

            {!skinResult && (

              <button
                onClick={() =>
                  navigate("/skin-scan")
                }
              >
                Analyze My Skin →
              </button>

            )}

          </div>

        </div>

      </div>

    );

  }


  // =================================================
  // GET VALUES
  // =================================================

  const dosha =
    doshaResult.dominant?.toLowerCase();

  const skinType =
    skinResult.skinType?.toLowerCase();


  // =================================================
  // SAFETY FALLBACK
  // =================================================

  const validDosha =
    ["vata", "pitta", "kapha"].includes(dosha)
      ? dosha
      : "vata";

  const validSkinType =
    ["dry", "sensitive", "oily"].includes(skinType)
      ? skinType
      : "dry";


  const profile =
    overallData[validDosha][validSkinType];


  // =================================================
  // RENDER
  // =================================================

  return (

    <div className="overall-page">

      <div className="overall-container">


        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="overall-header">

          <span className="overall-label">
            AYURAI • PERSONALIZED SKIN PROFILE
          </span>

          <h1>
            Your Complete
            <br />
            <span>Ayurvedic Skin Profile</span>
          </h1>

          <p>
            Your Dosha pattern and visible skin
            characteristics have been combined
            to create a personalized AyurAI
            wellness profile.
          </p>

        </div>


        {/* ==========================================
            PROFILE SUMMARY
        ========================================== */}

        <div className="profile-summary">

          <div className="profile-item">

            <span>
              AYURVEDIC DOSHA
            </span>

            <strong>
              {doshaResult.dominant}
            </strong>

            <small>
              {doshaResult.percentages?.[
                doshaResult.dominant
              ]}% alignment
            </small>

          </div>


          <div className="profile-divider"></div>


          <div className="profile-item">

            <span>
              SKIN TYPE
            </span>

            <strong>
              {skinResult.skinType}
            </strong>

            <small>
              Based on visible characteristics
            </small>

          </div>

        </div>


        {/* ==========================================
            OVERALL RESULT
        ========================================== */}

        <div className="overall-result-card">

          <span className="result-small-label">
            YOUR COMBINED RESULT
          </span>

          <h2>
            {profile.title}
          </h2>

          <p>
            {profile.summary}
          </p>

        </div>


        {/* ==========================================
            SKIN CONCERNS
        ========================================== */}

        {skinResult.concerns?.length > 0 && (

          <section className="overall-section">

            <span className="result-small-label">
              VISIBLE CONCERNS
            </span>

            <h2>
              What We Noticed
            </h2>

            <div className="overall-concerns">

              {skinResult.concerns.map(
                (concern, index) => (

                  <div
                    className="overall-concern"
                    key={index}
                  >

                    <span>
                      0{index + 1}
                    </span>

                    <strong>
                      {concern}
                    </strong>

                  </div>

                )
              )}

            </div>

          </section>

        )}


        {/* ==========================================
            PERSONALIZED FOCUS
        ========================================== */}

        <section className="overall-section">

          <span className="result-small-label">
            PERSONALIZED CARE
          </span>

          <h2>
            Your Skincare Focus
          </h2>

          <p className="section-intro">
            These areas are suggested from
            your combined Dosha and skin profile.
          </p>

          <div className="focus-grid">

            {profile.focus.map(
              (item, index) => (

                <div
                  className="focus-card"
                  key={item}
                >

                  <span>
                    0{index + 1}
                  </span>

                  <h3>
                    {item}
                  </h3>

                  <p>
                    A gentle approach that may
                    complement your {profile.title}
                    profile.
                  </p>

                </div>

              )
            )}

          </div>

        </section>


        {/* ==========================================
            HOME REMEDIES
        ========================================== */}

        <section className="overall-section remedies-section">

          <span className="result-small-label">
            AYURVEDIC-INSPIRED HOME CARE
          </span>

          <h2>
            Simple Home Remedies
          </h2>

          <p className="section-intro">
            Gentle wellness practices you may
            explore as part of your skincare routine.
          </p>


          <div className="remedy-list">

            {profile.remedies.map(
              (remedy, index) => (

                <div
                  className="remedy-card"
                  key={index}
                >

                  <div className="remedy-number">
                    0{index + 1}
                  </div>

                  <div>

                    <span>
                      HOME CARE
                    </span>

                    <p>
                      {remedy}
                    </p>

                  </div>

                </div>

              )
            )}

          </div>

        </section>


        {/* ==========================================
            HYDRATION
        ========================================== */}

        {skinResult.hydration && (

          <section className="hydration-summary">

            <div>

              <span>
                HYDRATION APPEARANCE
              </span>

              <h3>
                {skinResult.hydration.level}
              </h3>

            </div>

            <strong>
              {skinResult.hydration.percentage}%
            </strong>

          </section>

        )}


        {/* ==========================================
            ACTIONS
        ========================================== */}

        <div className="overall-actions">

          <button
            className="overall-primary"
            onClick={() =>
              navigate("/profile")
            }
          >
            Save to My Profile →
          </button>

          <button
            className="overall-secondary"
            onClick={() =>
              navigate("/products")
            }
          >
            Explore Recommended Products
          </button>

        </div>


        {/* ==========================================
            DISCLAIMER
        ========================================== */}

        <p className="overall-disclaimer">

          AyurAI provides educational and
          Ayurvedic-inspired skincare guidance.
          This combined profile is not a medical
          diagnosis and should not replace advice
          from a qualified healthcare professional.

        </p>

      </div>

    </div>

  );

}

export default OverallResult;