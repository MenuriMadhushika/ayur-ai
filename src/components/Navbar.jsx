
import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // =====================================================
  // PROFILE ICON
  // =====================================================

  const [profileIcon, setProfileIcon] = useState("🪷");

  const profileIcons = {
    lotus: "🪷",
    leaf: "🍃",
    flower: "🌺",
    sun: "☀️",
    butterfly: "🦋",
    botanical: "🌿",
  };

  // =====================================================
  // LOAD SAVED PROFILE ICON
  // =====================================================

  useEffect(() => {
    const loadProfileIcon = () => {
      const savedUser = localStorage.getItem("ayuraiUser");

      if (!savedUser) {
        setProfileIcon("🪷");
        return;
      }

      try {
        const user = JSON.parse(savedUser);

        const selectedIcon =
          profileIcons[user.icon] || "🪷";

        setProfileIcon(selectedIcon);
      } catch {
        setProfileIcon("🪷");
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

  // =====================================================
  // CLOSE MOBILE MENU
  // =====================================================

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // =====================================================
  // DESKTOP NAV LINK CLASS
  // =====================================================

  const getNavClass = ({ isActive }) =>
    isActive
      ? "nav-link active"
      : "nav-link";

  // =====================================================
  // UI
  // =====================================================

  return (
    <header className="navbar">

      <div className="navbar-inner">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
          <span className="logo-main">
            Ayur
          </span>

          <span className="logo-ai">
            AI
          </span>
        </Link>


        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav className="desktop-nav">

          {/* HOME */}

          <NavLink
            to="/"
            end
            className={getNavClass}
            onClick={closeMenu}
          >
            Home
          </NavLink>


          {/* DOSHA TEST */}

          <NavLink
            to="/dosha-test"
            className={getNavClass}
            onClick={closeMenu}
          >
            Dosha Test
          </NavLink>


          {/* SKIN SCAN */}

          <NavLink
            to="/skin-scan"
            className={getNavClass}
            onClick={closeMenu}
          >
            Skin Scan
          </NavLink>


          {/* HOME REMEDIES */}

          <NavLink
            to="/home-remedies"
            className={getNavClass}
            onClick={closeMenu}
          >
            Home Remedies
          </NavLink>


          {/* DASHBOARD */}

          

        </nav>


        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="navbar-actions">

          {/* FIND MY SKIN TYPE */}

          <Link
            to="/dosha-test"
            className="nav-cta"
            onClick={closeMenu}
          >
            Find My Skin Type

            <span>
              →
            </span>
          </Link>


          {/* PROFILE ICON */}

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? "profile-nav-icon active"
                : "profile-nav-icon"
            }
            aria-label="Profile"
            title="Profile"
            onClick={closeMenu}
          >
            <span className="profile-icon">
              {profileIcon}
            </span>
          </NavLink>


          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            className={`menu-button ${
              menuOpen ? "open" : ""
            }`}
            onClick={() =>
              setMenuOpen((current) => !current)
            }
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>

      </div>


      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      <div
        className={`mobile-menu ${
          menuOpen ? "show" : ""
        }`}
      >

        {/* HOME */}

        <NavLink
          to="/"
          end
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Home
        </NavLink>


        {/* DOSHA TEST */}

        <NavLink
          to="/dosha-test"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Dosha Test
        </NavLink>


        {/* SKIN SCAN */}

        <NavLink
          to="/skin-scan"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Skin Scan
        </NavLink>


        {/* HOME REMEDIES */}

        <NavLink
          to="/home-remedies"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Home Remedies
        </NavLink>


        {/* DASHBOARD */}

        


        {/* PROFILE */}

        <NavLink
          to="/profile"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          Profile
        </NavLink>


        {/* CTA */}

        <Link
          to="/dosha-test"
          className="mobile-cta"
          onClick={closeMenu}
        >
          Find My Skin Type →
        </Link>

      </div>

    </header>
  );
};

export default Navbar;
