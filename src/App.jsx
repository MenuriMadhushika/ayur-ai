import React from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./App.css";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import DoshaQuestion from "./components/DoshaQuestion";
import UserProfile from "./components/UserProfile";
import HomeRemedy from "./components/HomeRemedy";
import OverallResult from "./components/OverallResult";
import HowItWorks from "./components/HowItWorks";
import Register from "./components/Register";
import Login from "./components/Login";

import SkinScan from "./pages/SkinScan";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./pages/AdminLayout";

function Home() {
  const navigate = useNavigate();

  return (
    <main>
      <Hero />

      <section className="intro-section home-journey">
        <HowItWorks />
      </section>

      <section className="personalized-section home-value-section">
        <div className="personalized-content">
          <span className="section-label">
            WHY AYURAI
          </span>

          <h2>Simple guidance for your skin journey.</h2>

          <p>
            Start with what you already know about your skin. AyurAI then
            combines your Skin Scan and Ayurvedic wellness pattern to
            suggest gentle, educational home-care ideas.
          </p>

          <div className="feature-row">
            <div className="feature-item">
              <span className="feature-number">01</span>
              <h3>Clear</h3>
                <p>
                  See an educational estimate of acne-like severity.
                </p>
            </div>

            <div className="feature-item">
              <span className="feature-number">02</span>
              <h3>Personal</h3>
              <p>
                See your Skin Scan and wellness pattern together.
              </p>
            </div>

            <div className="feature-item">
              <span className="feature-number">03</span>
              <h3>Gentle</h3>
              <p>
                Explore general wellness ideas separately from the AI result.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="home-final-action"
            onClick={() => navigate("/skin-scan")}
          >
            Start your Skin Scan <span>→</span>
          </button>
        </div>
      </section>

      <section className="home-remedy-preview">
        <div className="home-remedy-preview-heading">
          <span className="section-label">GENTLE HOME REMEDIES</span>
          <h2>A few calm rituals to explore.</h2>
          <p>
            These are simple examples. After your Skin Scan and Dosha Test,
            explore these optional general wellness ideas separately.
          </p>
        </div>

        <div className="home-remedy-preview-grid">
          <article className="home-preview-card preview-blue">
            <span>DRY-FEELING SKIN</span>
            <h3>Honey & Oat Hydration</h3>
            <p>A soft, comforting home ritual to try once or twice a week.</p>
          </article>

          <article className="home-preview-card preview-blush">
            <span>SENSITIVE-FEELING SKIN</span>
            <h3>Oat & Aloe Comfort</h3>
            <p>A minimal, gentle ritual with a patch test before you begin.</p>
          </article>

          <article className="home-preview-card preview-gold">
            <span>WARM OR OILY-FEELING SKIN</span>
            <h3>Aloe & Cucumber Cooling Care</h3>
            <p>A light, refreshing ritual for days when your skin needs less.</p>
          </article>
        </div>

        <button
          type="button"
          className="home-remedy-preview-action"
          onClick={() => navigate("/home-remedies")}
        >
          Explore home remedies <span>→</span>
        </button>
      </section>
    </main>
  );
}

// Requires any signed-in account.
function ProtectedRoute({ children }) {
  const savedUser = localStorage.getItem("ayuraiUser");
  const savedUserId = localStorage.getItem("ayuraiUserId");

  if (!savedUser || !savedUserId) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Requires an ADMIN account.
function AdminRoute({ children }) {
  const savedUser = localStorage.getItem("ayuraiUser");

  if (!savedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(savedUser);

    if (user.role !== "ADMIN") {
      return <Navigate to="/" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const location = useLocation();

  const authPages = ["/login", "/register"];

  // Admin uses its own dashboard header.
  const isAdminPage = location.pathname.startsWith("/admin");

  const shouldShowNavbar =
    !authPages.includes(location.pathname) && !isAdminPage;

  return (
    <div className="app">
      {shouldShowNavbar && <Navbar />}

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/" element={<Home />} />

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

        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="/admin" element={<AdminDashboard view="dashboard" />} />
          <Route path="/admin/users" element={<AdminDashboard view="users" />} />
          <Route path="/admin/assessments" element={<AdminDashboard view="assessments" />} />
          <Route path="/admin/remedies" element={<AdminDashboard view="remedies" />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
