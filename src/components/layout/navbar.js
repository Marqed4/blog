import { useState } from "react";
import { NavLink } from "react-router-dom";

// The site colors are picked in the Character panel on Home (see theme.js).

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const renderLinks = (isMobile = false) => {
    const closeMenu = isMobile ? () => setMenuOpen(false) : undefined;
    const linkClass = ({ isActive }) =>
      `ae-button ae-button--small ae-nav-link${isActive ? " is-active" : ""}`;

    return (
      <>
        <NavLink to="/" end className={linkClass} onClick={closeMenu}>
          Home
        </NavLink>
        <NavLink to="/Projects" className={linkClass} onClick={closeMenu}>
          Projects
        </NavLink>
        <NavLink to="/Details" className={linkClass} onClick={closeMenu}>
          About
        </NavLink>
        <NavLink to="/Resume" className={linkClass} onClick={closeMenu}>
          Resume
        </NavLink>
      </>
    );
  };

  return (
    <nav className="ae-top-nav" aria-label="Main navigation">
      <div className="ae-nav-window">
        <div className="ae-nav-toolbar">{renderLinks()}</div>

        <div className="ae-nav-actions">
          <button
            type="button"
            className="ae-button ae-button--small ae-music-toggle"
            disabled
            aria-label="Sound effects coming soon"
            title="Sound effects coming soon"
          >
            <span className="ae-sound-indicator" aria-hidden="true" />
            <span>Sounds off</span>
          </button>
          <button
            type="button"
            className="ae-button ae-button--small ae-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="ae-mobile-menu"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {menuOpen ? "×" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="ae-mobile-menu" id="ae-mobile-menu">
          {renderLinks(true)}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
