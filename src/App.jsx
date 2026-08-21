import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";

// Components
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DoshaSelector from "./components/DoshaSelector";
import SkinScanCard from "./components/SkinScanCard";
import DoshaQuestion from "./components/DoshaQuestion";
import UserProfile from "./components/UserProfile";
import AyurvedicRemedies from "./components/AyurvedicRemedies";


/* =========================================================
   HOME PAGE
   ========================================================= */

function Home() {
  return (
    <div className="app">

      {/* =========================
          NAVBAR
      ========================== */}

      <Navbar />


      <main>

        {/* =========================
            HERO
        ========================== */}

        <Hero />


        {/* =========================
            DOSHA SECTION
        ========================== */}

        <section className="intro-section">

          <div className="section-label">
            AYURVEDIC SKINCARE
          </div>

          <h2>
            Discover Your Ayurvedic Skin Balance
          </h2>

          <p className="section-description">
            Ayurveda describes three natural energies called Doshas.
            Discover yours and understand what your skin truly needs.
          </p>

          <DoshaSelector />

        </section>


        {/* =========================
            AI SKIN ANALYSIS
        ========================== */}

        <SkinScanCard />


        {/* =========================
            HOME REMEDIES
        ========================== */}

        <section
          className="home-remedies-section"
          id="home-remedies"
        >

          <div className="section-label">
            AYURVEDIC WELLNESS
          </div>

          <h2>
            Natural Care From Your Kitchen
          </h2>

          <p className="section-description">
            Discover simple Ayurvedic home remedies inspired by
            traditional ingredients and personalized to your skin needs.
          </p>

          <AyurvedicRemedies />

        </section>


        {/* =========================
            PERSONALIZED CARE
        ========================== */}

        <section className="personalized-section">

          <div className="personalized-content">

            <span className="section-label">
              PERSONALIZED CARE
            </span>

            <h2>
              Beauty Guided by Ayurveda
            </h2>

            <p>
              AyurAI combines Ayurvedic principles with intelligent
              technology to help you understand your skin and discover
              personalized Ayurvedic care.
            </p>


            <div className="feature-row">

              {/* FEATURE 01 */}

              <div className="feature-item">

                <span className="feature-number">
                  01
                </span>

                <h3>
                  Discover
                </h3>

                <p>
                  Understand your Ayurvedic skin type and Dosha.
                </p>

              </div>


              {/* FEATURE 02 */}

              <div className="feature-item">

                <span className="feature-number">
                  02
                </span>

                <h3>
                  Analyse
                </h3>

                <p>
                  Explore AI-powered skin analysis for your concerns.
                </p>

              </div>


              {/* FEATURE 03 */}

              <div className="feature-item">

                <span className="feature-number">
                  03
                </span>

                <h3>
                  Personalize
                </h3>

                <p>
                  Receive Ayurvedic home-care recommendations.
                </p>

              </div>

            </div>

          </div>

        </section>


      </main>


      {/* =========================
          FOOTER
      ========================== */}

      <footer className="footer">

        <div className="footer-brand">

          <h2>
            AyurAI
          </h2>

          <p>
            Intelligent skincare inspired by the wisdom of Ayurveda.
          </p>

        </div>


        <div className="footer-right">

          <span>
            AI • AYURVEDA • BEAUTY
          </span>

        </div>

      </footer>

    </div>
  );
}


/* =========================================================
   APP ROUTES
   ========================================================= */

function App() {

  return (

    <Routes>

      {/* HOME */}

      <Route
        path="/"
        element={<Home />}
      />


      {/* DOSHA TEST */}

      <Route
        path="/dosha-test"
        element={<DoshaQuestion />}
      />


      {/* USER PROFILE */}

      <Route
        path="/profile"
        element={<UserProfile />}
      />

    </Routes>

  );
}


export default App;