import API_BASE_URL from "../utils/api";
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = {
          message: await response.text(),
        };
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid email or password."
        );
      }

      if (!data.id) {
        throw new Error(
          "Login succeeded, but user information is missing."
        );
      }

      // Save the account details, role, and login token.
      const loggedInUser = {
        id: data.id,
        name: data.name || "",
        email: data.email || email,
        age: data.age ?? null,
        profileIcon: data.profileIcon || "🌿",
        icon: data.profileIcon || "🌿",
        role: data.role || "USER",
      };

      localStorage.setItem(
        "ayuraiUser",
        JSON.stringify(loggedInUser)
      );

      localStorage.setItem(
        "ayuraiUserId",
        String(data.id)
      );

      if (data.token) {
        localStorage.setItem("ayuraiToken", data.token);
      } else {
        localStorage.removeItem("ayuraiToken");
      }

      // ADMIN accounts open the protected dashboard.
      // Normal users continue to the AyurAI home page.
      if (data.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (loginError) {
      console.error("AyurAI login error:", loginError);

      setError(
        loginError.message ||
        "Unable to connect to AyurAI."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-card">
        <Link className="auth-wordmark" to="/" aria-label="AyurAI home">
          <span>Ayur</span><em>AI</em>
        </Link>
        <div className="login-header">
          <span className="login-label">
            WELCOME BACK
          </span>

          <h1>
            Welcome to <span>AyurAI</span>
          </h1>

          <p>
            Continue your Skin Scan and Ayurvedic wellness journey.
          </p>
        </div>

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >
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
              disabled={loading}
            />
          </div>

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
              disabled={loading}
            />
          </div>

          {error && (
            <div
              className="login-error"
              role="alert"
            >
              {error}
            </div>
          )}

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
