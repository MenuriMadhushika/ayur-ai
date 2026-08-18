import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">

      <div className="navbar-inner">

        {/* LOGO */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="logo-main">Ayur</span>
          <span className="logo-ai">AI</span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="desktop-nav">

          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/dosha-test"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Dosha Test
          </NavLink>

          <a
            href="/#skin-scan"
            className="nav-link"
          >
            Skin Scan
          </a>

                <NavLink
        to="/products"
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
      >
        Products
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          isActive ? "nav-link active" : "nav-link"
        }
      >
        Profile
      </NavLink>

      <a href="#dashboard" className="nav-link">
        Dashboard
      </a>

        </nav>

        {/* RIGHT SIDE */}
        <div className="navbar-actions">

          <Link
            to="/dosha-test"
            className="nav-cta"
          >
            Find My Skin Type
            <span>→</span>
          </Link>

          <button
            className={`menu-button ${
              menuOpen ? "open" : ""
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open navigation menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

        </div>

      </div>

      {/* MOBILE MENU */}
      <div
        className={`mobile-menu ${
          menuOpen ? "show" : ""
        }`}
      >

        <NavLink
          to="/"
          onClick={closeMenu}
        >
          Home
        </NavLink>

        <NavLink
          to="/dosha-test"
          onClick={closeMenu}
        >
          Dosha Test
        </NavLink>

        <a
          href="/#skin-scan"
          onClick={closeMenu}
        >
          Skin Scan
        </a>

        <NavLink
          to="/products"
          onClick={closeMenu}
        >
          Products
        </NavLink>

        <a
          href="#dashboard"
          onClick={closeMenu}
        >
          Dashboard
        </a>

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