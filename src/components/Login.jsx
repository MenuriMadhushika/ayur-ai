import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  // =========================================================
  // LOGIN
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8081/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email.trim(),
            password: formData.password,
          }),
        }
      );

      // =====================================================
      // SAFELY READ RESPONSE
      // =====================================================

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
      // HANDLE LOGIN ERROR
      // =====================================================

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password."
        );
      }

      // =====================================================
      // CHECK USER ID
      // =====================================================

      if (!data.id) {
        throw new Error(
          "Login succeeded, but user information is missing."
        );
      }

      // =====================================================
      // SAVE LOGGED-IN USER
      // =====================================================

      const loggedInUser = {
        id: data.id,
        name: data.name,
        email: data.email,
        age: data.age,
        profileIcon: data.profileIcon,
        icon: data.profileIcon || "butterfly",
      };

      localStorage.setItem(
        "ayuraiUser",
        JSON.stringify(loggedInUser)
      );

      // =====================================================
      // SAVE USER ID
      // =====================================================

      localStorage.setItem(
        "ayuraiUserId",
        String(data.id)
      );

      // =====================================================
      // GO TO PROFILE
      // =====================================================

      navigate("/profile");

    } catch (error) {
      console.error(
        "AyurAI login error:",
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
    <main className="login-page">

      <div className="login-card">

        {/* HEADER */}

        <div className="login-header">

          <span className="login-label">
            WELCOME BACK
          </span>

          <h1>
            Welcome to <span>AyurAI</span>
          </h1>

          <p>
            Continue your personalized Ayurvedic
            skincare journey.
          </p>

        </div>

        {/* FORM */}

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          {/* EMAIL */}

          <div className="login-input-group">

            <label htmlFor="email">
              EMAIL
            </label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />

          </div>

          {/* PASSWORD */}

          <div className="login-input-group">

            <label htmlFor="password">
              PASSWORD
            </label>

            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />

          </div>

          {/* ERROR */}

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          {/* LOGIN */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

        </form>

        {/* REGISTER */}

        <div className="login-register">

          <span>
            Don't have an AyurAI account?
          </span>

          <Link to="/register">
            Create an account
          </Link>

        </div>

      </div>

    </main>
  );
}

export default Login;