import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css"; // We'll move style logic into this file

/**
 * Header component:
 * - Displays a logo, site name, nav links (Home, Blog, About), and sign-in/sign-up buttons.
 * - Sticky on scroll, with a subtle box shadow that appears once the user scrolls.
 * - Responsive design with a hamburger menu for smaller screens.
 */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Add box shadow once scrolled beyond 10px
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <div className="header__logo-container">
        {/* Placeholder logo (could be text or an actual image) */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/6565/6565893.png"
          alt="Site Logo"
          className="header__logo"
        />

        {/* Clickable site name: navigates back to Home */}
        <Link to="/" className="header__site-name">
          MaliciousURL.io
        </Link>
      </div>

      {/* Hamburger Menu Button (visible on small screens) */}
      <button
        className={`header__hamburger ${isMenuOpen ? "is-active" : ""}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      {/* Nav Container */}
      <nav className={`header__nav ${isMenuOpen ? "open" : ""}`}>
        <Link
          to="/"
          className="header__nav-item"
          onClick={() => setIsMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          to="/blog"
          className="header__nav-item"
          onClick={() => setIsMenuOpen(false)}
        >
          Blog
        </Link>
        <Link
          to="/about"
          className="header__nav-item"
          onClick={() => setIsMenuOpen(false)}
        >
          About
        </Link>

        {/* Sign in/Sign up buttons */}
        <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
          <button className="btn">Sign In</button>
        </Link>
        <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
          <button className="btn">Sign Up</button>
        </Link>
      </nav>
    </header>
  );
}

export default Header;
