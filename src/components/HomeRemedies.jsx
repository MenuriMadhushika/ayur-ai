import React from "react";
import "./HomeRemedies.css";

const HomeRemedies = () => {

  const remedies = [
    {
      icon: "🌿",
      title: "Aloe Vera",
      description:
        "A gentle cooling and soothing option for skin that feels irritated or warm.",
      suitableFor: "Sensitive & irritated skin"
    },
    {
      icon: "🌼",
      title: "Turmeric",
      description:
        "A traditional Ayurvedic ingredient commonly used in simple skincare routines.",
      suitableFor: "Blemish-prone skin"
    },
    {
      icon: "🥥",
      title: "Coconut",
      description:
        "A nourishing traditional ingredient that can support a simple care routine for dry skin.",
      suitableFor: "Dry skin"
    },
    {
      icon: "🍃",
      title: "Neem",
      description:
        "A traditional Ayurvedic botanical often used in cleansing and skin-care practices.",
      suitableFor: "Oily & congested skin"
    }
  ];

  return (
    <section className="home-remedies-section">

      <div className="home-remedies-heading">

        <span className="section-label">
          AYURVEDIC HOME CARE
        </span>

        <h2>
          Simple Remedies,
          <br />
          <span>Inspired by Ayurveda</span>
        </h2>

        <p>
          Discover gentle Ayurvedic-inspired home care ideas
          based on your skin needs and Ayurvedic balance.
        </p>

      </div>


      <div className="remedies-grid">

        {remedies.map((remedy, index) => (

          <article
            className="remedy-card"
            key={remedy.title}
          >

            <div className="remedy-top">

              <span className="remedy-number">
                0{index + 1}
              </span>

              <span className="remedy-icon">
                {remedy.icon}
              </span>

            </div>

            <h3>
              {remedy.title}
            </h3>

            <p>
              {remedy.description}
            </p>

            <span className="remedy-suitable">
              {remedy.suitableFor}
            </span>

          </article>

        ))}

      </div>


      <div className="remedies-note">

        <span>✦</span>

        <p>
          These are traditional Ayurvedic-inspired home care ideas.
          Always patch test new ingredients and stop if irritation occurs.
        </p>

      </div>

    </section>
  );
};

export default HomeRemedies;