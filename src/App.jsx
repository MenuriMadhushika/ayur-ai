import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import { testBackend } from "./api";
import "./App.css";

// =========================================================
// COMPONENTS
// =========================================================

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DoshaSelector from "./components/DoshaSelector";
import SkinScanCard from "./components/SkinScanCard";
import DoshaQuestion from "./components/DoshaQuestion";
import UserProfile from "./components/UserProfile";
import HomeRemedy from "./components/HomeRemedy";
import OverallResult from "./components/OverallResult";

// =========================================================
// PAGES
// =========================================================

import SkinScan from "./pages/SkinScan";


// =========================================================
// HOME PAGE
// =========================================================

function Home() {

  return (

    <main>

      {/* =================================================
          HERO
      ================================================= */}

      <Hero />


      {/* =================================================
          DOSHA SECTION
      ================================================= */}

      <section className="intro-section">

        <div className="section-label">
          AYURVEDIC SKINCARE
        </div>


        <h2>
          Discover Your Ayurvedic Skin Balance
        </h2>


        <p className="section-description">
          Ayurveda describes three natural energies called
          Doshas. Discover yours and understand what your
          skin truly needs.
        </p>


        <DoshaSelector />

      </section>


      {/* =================================================
          AI SKIN ANALYSIS
      ================================================= */}

      <SkinScanCard />


      {/* =================================================
          PERSONALIZED CARE
      ================================================= */}

      <section className="personalized-section">

        <div className="personalized-content">

          <span className="section-label">
            PERSONALIZED CARE
          </span>


          <h2>
            Beauty Guided by Ayurveda
          </h2>


          <p>
            AyurAI combines Ayurvedic principles with
            intelligent technology to help you understand
            your skin and discover personalized Ayurvedic care.
          </p>


          {/* =================================================
              FEATURES
          ================================================= */}

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
                Explore AI-powered skin analysis for your
                concerns.
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
  );
}


// =========================================================
// APP
// =========================================================

function App() {

  // =======================================================
  // BACKEND CONNECTION
  // =======================================================

  useEffect(() => {

    testBackend()

      .then((data) => {

        console.log(
          "Backend connected:",
          data
        );

      })

      .catch((error) => {

        console.error(
          "Backend connection failed:",
          error
        );

      });

  }, []);


  // =======================================================
  // SYSTEM LAYOUT
  // =======================================================

  return (

    <div className="app">

      {/* =================================================
          GLOBAL NAVBAR
          Appears on EVERY PAGE
      ================================================= */}

      <Navbar />


      {/* =================================================
          PAGE ROUTES
      ================================================= */}

      <Routes>


        {/* =================================================
            HOME
        ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* =================================================
            DOSHA TEST
        ================================================= */}

        <Route
          path="/dosha-test"
          element={<DoshaQuestion />}
        />


        {/* =================================================
            SKIN SCAN
        ================================================= */}

        <Route
          path="/skin-scan"
          element={<SkinScan />}
        />


        {/* =================================================
            HOME REMEDIES
        ================================================= */}

        <Route
          path="/home-remedies"
          element={<HomeRemedy />}
        />


        {/* =================================================
            PROFILE
        ================================================= */}

        <Route
          path="/profile"
          element={<UserProfile />}
        />

        <Route
  path="/overall-result"
  element={<OverallResult />}
/>

      </Routes>

    </div>
  );
}


export default App;