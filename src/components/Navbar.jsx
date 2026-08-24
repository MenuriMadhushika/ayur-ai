import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileIcon, setProfileIcon] = useState("🦋");

  const profileIcons = {
    lotus: "🪷",
    leaf: "🍃",
    flower: "🌺",
    sun: "☀️",
    butterfly: "🦋",
    botanical: "🌿",
  };

  useEffect(() => {
    const loadProfileIcon = () => {
      const savedUser = localStorage.getItem("ayuraiUser");

      if (!savedUser) {
        setProfileIcon("🦋");
        return;
      }

      try {
        const user = JSON.parse(savedUser);
        setProfileIcon(profileIcons[user.icon] || "🦋");
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

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const navClass = ({ isActive }) =>
    `nav-link${isActive ? " active" : ""}`;

  const mobileNavClass = ({ isActive }) =>
    `mobile-nav-link${isActive ? " active" : ""}`;

  return (
    <header className="navbar">

      <div className="navbar-inner">

        {/* =========================
            BRAND
        ========================== */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
          aria-label="AyurAI Home"
        >
          <span className="logo-ayur">Ayur</span>
          <span className="logo-ai">AI</span>
        </Link>


        {/* =========================
            DESKTOP NAVIGATION
        ========================== */}

        <nav
          className="desktop-nav"
          aria-label="Primary navigation"
        >
          <NavLink
            to="/"
            end
            className={navClass}
            onClick={closeMenu}
          >
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/dosha-test"
            className={navClass}
            onClick={closeMenu}
          >
            <span>Dosha Test</span>
          </NavLink>

          <NavLink
            to="/skin-scan"
            className={navClass}
            onClick={closeMenu}
          >
            <span>Skin Scan</span>
          </NavLink>

          <NavLink
            to="/home-remedies"
            className={navClass}
            onClick={closeMenu}
          >
            <span>Home Remedies</span>
          </NavLink>
        </nav>


        {/* =========================
            RIGHT ACTIONS
        ========================== */}

        <div className="navbar-actions">

          {/* Profile */}

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `profile-button${isActive ? " active" : ""}`
            }
            aria-label="Open profile"
            title="Profile"
            onClick={closeMenu}
          >
            <span className="profile-icon">
              {profileIcon}
            </span>

            <span className="profile-ring"></span>
          </NavLink>


          {/* Mobile Menu */}

          <button
            type="button"
            className={`menu-button${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((current) => !current)}
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>

      </div>


      {/* =========================
          MOBILE NAVIGATION
      ========================== */}

      <div
        id="mobile-navigation"
        className={`mobile-menu${menuOpen ? " show" : ""}`}
      >

        <div className="mobile-menu-inner">

          <NavLink
            to="/"
            end
            onClick={closeMenu}
            className={mobileNavClass}
          >
            <span className="mobile-link-number">01</span>
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/dosha-test"
            onClick={closeMenu}
            className={mobileNavClass}
          >
            <span className="mobile-link-number">02</span>
            <span>Dosha Test</span>
          </NavLink>

          <NavLink
            to="/skin-scan"
            onClick={closeMenu}
            className={mobileNavClass}
          >
            <span className="mobile-link-number">03</span>
            <span>Skin Scan</span>
          </NavLink>

          <NavLink
            to="/home-remedies"
            onClick={closeMenu}
            className={mobileNavClass}
          >
            <span className="mobile-link-number">04</span>
            <span>Home Remedies</span>
          </NavLink>

          <NavLink
            to="/profile"
            onClick={closeMenu}
            className={mobileNavClass}
          >
            <span className="mobile-link-number">05</span>
            <span>Profile</span>
          </NavLink>

        </div>

      </div>

    </header>
  );
};

export default Navbar;