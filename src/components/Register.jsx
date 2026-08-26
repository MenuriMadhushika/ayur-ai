import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // =========================================================
  // REGISTER
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!formData.password) {
      setError("Please enter a password.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8081/api/users",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim().toLowerCase(),
            password: formData.password,
            age: null,
            profileIcon: "🌿",
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        data = {
          message: text,
        };
      }

      // =====================================================
      // HANDLE BACKEND ERROR
      // =====================================================

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Unable to create your account."
        );
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      navigate("/login");

    } catch (error) {
      console.error(
        "AyurAI registration error:",
        error
      );

      setError(
        error.message ||
        "Unable to connect to AyurAI."
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="auth-page">

      <div className="auth-background-decoration auth-decoration-one" />
      <div className="auth-background-decoration auth-decoration-two" />

      <section className="auth-card">

        {/* BRAND */}

        <div className="auth-brand">

          <span className="auth-brand-mark">
            ✦
          </span>

          <span className="auth-brand-name">
            AYURAI
          </span>

          <span className="auth-brand-subtitle">
            AYURVEDIC INTELLIGENCE
          </span>

        </div>

        {/* HEADER */}

        <div className="auth-header">

          <span className="auth-label">
            BEGIN YOUR JOURNEY
          </span>

          <h1>
            Create Your
            <span> AyurAI Profile</span>
          </h1>

          <p>
            Begin your personalized Ayurvedic skincare
            and wellness journey.
          </p>

        </div>

        {/* REGISTER FORM */}

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          {/* NAME */}

          <div className="auth-input-group">

            <label htmlFor="register-name">
              FULL NAME
            </label>

            <input
              id="register-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              autoComplete="name"
            />

          </div>

          {/* EMAIL */}

          <div className="auth-input-group">

            <label htmlFor="register-email">
              EMAIL ADDRESS
            </label>

            <input
              id="register-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              autoComplete="email"
            />

          </div>

          {/* PASSWORD */}

          <div className="auth-input-group">

            <label htmlFor="register-password">
              PASSWORD
            </label>

            <input
              id="register-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              autoComplete="new-password"
            />

          </div>

          {/* CONFIRM PASSWORD */}

          <div className="auth-input-group">

            <label htmlFor="register-confirm-password">
              CONFIRM PASSWORD
            </label>

            <input
              id="register-confirm-password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              autoComplete="new-password"
            />

          </div>

          {/* ERROR */}

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            className="auth-submit-button"
            disabled={loading}
          >

            {loading ? (
              <span className="auth-loading">
                Creating Profile...
              </span>
            ) : (
              <>
                Create My Profile
                <span>→</span>
              </>
            )}

          </button>

        </form>

        {/* LOGIN */}

        <div className="auth-switch">

          <span>
            Already have an AyurAI account?
          </span>

          <Link to="/login">
            Sign In
          </Link>

        </div>

        {/* DISCLAIMER */}

        <p className="auth-disclaimer">
          AyurAI provides AI-estimated visual observations
          and educational Ayurvedic guidance. It is not a
          medical diagnosis.
        </p>

      </section>

    </main>
  );
}

export default Register;