import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <Link to="/" className="logo" onClick={closeMenu}>
        AyurAI
      </Link>

      <nav className={menuOpen ? "nav-links active" : "nav-links"}>
        <Link to="/" onClick={closeMenu}>
          Home
        </Link>

        <Link to="/dosha-test" onClick={closeMenu}>
          Dosha Test
        </Link>

        <Link to="/skin-scan" onClick={closeMenu}>
          Skin Scan
        </Link>

        <Link to="/products" onClick={closeMenu}>
          Products
        </Link>

        <Link to="/dashboard" onClick={closeMenu}>
          Dashboard
        </Link>

        
      </nav>

      <button
        className="menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
      >
        ☰
      </button>
    </header>
  );
};

export default Navbar;