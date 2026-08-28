import React, { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  useNavigate,
} from "react-router-dom";

import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] =
    useState(false);

  const [profileIcon, setProfileIcon] = useState("🦋");

  // =========================================================
  // PROFILE ICONS
  // =========================================================

  const profileIcons = {
    lotus: "🪷",
    leaf: "🍃",
    flower: "🌺",
    sun: "☀️",
    butterfly: "🦋",
    botanical: "🌿",
  };

  // =========================================================
  // LOAD SAVED PROFILE ICON
  // =========================================================

  useEffect(() => {
    const loadProfileIcon = () => {
      const savedUser = localStorage.getItem("ayuraiUser");

      if (!savedUser) {
        setProfileIcon("🦋");
        return;
      }

      try {
        const user = JSON.parse(savedUser);

        setProfileIcon(
          profileIcons[user.icon] || "🦋"
        );
      } catch {
        setProfileIcon("🦋");
      }
    };

    loadProfileIcon();

    window.addEventListener(
      "ayuraiProfileUpdated",
      loadProfileIcon
    );

    return () => {
      window.removeEventListener(
        "ayuraiProfileUpdated",
        loadProfileIcon
      );
    };
  }, []);

  // =========================================================
  // MENU HELPERS
  // =========================================================

  const closeMenus = () => {
    setMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const navClass = ({ isActive }) =>
    `nav-link${isActive ? " active" : ""}`;

  const mobileNavClass = ({ isActive }) =>
    `mobile-nav-link${isActive ? " active" : ""}`;

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    // Remove saved login session.
    localStorage.removeItem("ayuraiUser");
    localStorage.removeItem("ayuraiUserId");

    // FUTURE:
    // Add token removal here when JWT authentication is used.
    // localStorage.removeItem("ayuraiToken");

    closeMenus();

    // Users cannot return to private pages using Back.
    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* BRAND */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenus}
          aria-label="AyurAI Home"
        >
          <span className="logo-ayur">Ayur</span>
          <span className="logo-ai">AI</span>
        </Link>

        {/* DESKTOP NAVIGATION */}

        <nav
          className="desktop-nav"
          aria-label="Primary navigation"
        >
          <NavLink
            to="/"
            end
            className={navClass}
            onClick={closeMenus}
          >
            Home
          </NavLink>

          <NavLink
            to="/dosha-test"
            className={navClass}
            onClick={closeMenus}
          >
            Dosha Test
          </NavLink>

          <NavLink
            to="/skin-scan"
            className={navClass}
            onClick={closeMenus}
          >
            Skin Scan
          </NavLink>

          <NavLink
            to="/home-remedies"
            className={navClass}
            onClick={closeMenus}
          >
            Home Remedies
          </NavLink>
        </nav>

        {/* PROFILE + MOBILE MENU */}

        <div className="navbar-actions">
          <div className="profile-menu-wrapper">
            <button
              type="button"
              className="profile-button"
              onClick={() =>
                setProfileMenuOpen(
                  (current) => !current
                )
              }
              aria-label="Open profile menu"
              aria-expanded={profileMenuOpen}
            >
              <span className="profile-icon">
                {profileIcon}
              </span>

              <span className="profile-ring" />
            </button>

            {/* Profile menu shown after clicking profile icon */}

            {profileMenuOpen && (
              <div className="profile-dropdown">
                <Link
                  to="/profile"
                  onClick={closeMenus}
                >
                  My Profile
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                >
                  Logout
                </button>

                {/* FUTURE ADMIN FEATURE:
                    Add an Admin Dashboard link here only
                    when the logged-in user has role ADMIN. */}
              </div>
            )}
          </div>

          {/* Mobile menu button */}

          <button
            type="button"
            className={`menu-button${
              menuOpen ? " open" : ""
            }`}
            onClick={() => {
              setMenuOpen((current) => !current);
              setProfileMenuOpen(false);
            }}
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* MOBILE NAVIGATION */}

      <div
        id="mobile-navigation"
        className={`mobile-menu${menuOpen ? " show" : ""}`}
      >
        <div className="mobile-menu-inner">
          <NavLink
            to="/"
            end
            onClick={closeMenus}
            className={mobileNavClass}
          >
            <span className="mobile-link-number">01</span>
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/dosha-test"
            onClick={closeMenus}
            className={mobileNavClass}
          >
            <span className="mobile-link-number">02</span>
            <span>Dosha Test</span>
          </NavLink>

          <NavLink
            to="/skin-scan"
            onClick={closeMenus}
            className={mobileNavClass}
          >
            <span className="mobile-link-number">03</span>
            <span>Skin Scan</span>
          </NavLink>

          <NavLink
            to="/home-remedies"
            onClick={closeMenus}
            className={mobileNavClass}
          >
            <span className="mobile-link-number">04</span>
            <span>Home Remedies</span>
          </NavLink>

          <NavLink
            to="/profile"
            onClick={closeMenus}
            className={mobileNavClass}
          >
            <span className="mobile-link-number">05</span>
            <span>My Profile</span>
          </NavLink>

          <button
            type="button"
            className="mobile-logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;