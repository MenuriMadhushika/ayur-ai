import React from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

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
import HowItWorks from "./components/HowItWorks";
import Register from "./components/Register";
import Login from "./components/Login";

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
      <Hero />

      <section className="intro-section">
        <div className="section-label">
          AYURVEDIC SKINCARE
        </div>

        <h2>Discover Your Ayurvedic Skin Balance</h2>

        <p className="section-description">
          Ayurveda describes three natural energies called
          Doshas. Discover yours and understand what your
          skin truly needs.
        </p>

        <HowItWorks />
        <DoshaSelector />
      </section>

      <SkinScanCard />

      <section className="personalized-section">
        <div className="personalized-content">
          <span className="section-label">
            PERSONALIZED CARE
          </span>

          <h2>Beauty Guided by Ayurveda</h2>

          <p>
            AyurAI combines Ayurvedic principles with
            intelligent technology to help you understand
            your skin and discover personalized Ayurvedic care.
          </p>

          <div className="feature-row">
            <div className="feature-item">
              <span className="feature-number">01</span>
              <h3>Discover</h3>
              <p>
                Understand your Ayurvedic skin type and Dosha.
              </p>
            </div>

            <div className="feature-item">
              <span className="feature-number">02</span>
              <h3>Analyse</h3>
              <p>
                Explore AI-powered skin analysis for your
                concerns.
              </p>
            </div>

            <div className="feature-item">
              <span className="feature-number">03</span>
              <h3>Personalize</h3>
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
// PROTECTED ROUTE
// =========================================================

function ProtectedRoute({ children }) {
  const savedUser = localStorage.getItem("ayuraiUser");
  const savedUserId = localStorage.getItem("ayuraiUserId");

  // Users must log in before opening private pages.
  if (!savedUser || !savedUserId) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// =========================================================
// APP LAYOUT
// =========================================================

function App() {
  const location = useLocation();

  // Login and Register are focused pages.
  // The navbar is hidden here to avoid distracting users.
  const authPages = ["/login", "/register"];

  const shouldShowNavbar = !authPages.includes(
    location.pathname
  );

  // FUTURE ADMIN FEATURE:
  // Later, you can check the saved user role here.
  // Example: user.role === "ADMIN"
  // Then show a separate AdminNavbar or AdminDashboard.
  return (
    <div className="app">
      {shouldShowNavbar && <Navbar />}

      <Routes>
        {/* PUBLIC AUTH PAGES */}

        <Route path="/register" element={<Register />} />

        <Route path="/login" element={<Login />} />

        {/* PUBLIC HOME PAGE */}

        <Route path="/" element={<Home />} />

        {/* PROTECTED USER PAGES */}

        <Route
          path="/dosha-test"
          element={
            <ProtectedRoute>
              <DoshaQuestion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/skin-scan"
          element={
            <ProtectedRoute>
              <SkinScan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/home-remedies"
          element={
            <ProtectedRoute>
              <HomeRemedy />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/overall-result"
          element={
            <ProtectedRoute>
              <OverallResult />
            </ProtectedRoute>
          }
        />

        {/* Unknown links return users to the home page. */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;