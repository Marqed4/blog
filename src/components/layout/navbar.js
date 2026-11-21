// Top navigation bar shown on every page: link buttons on desktop, a hamburger menu on small screens.
import { useState } from "react";
import { NavLink } from "react-router-dom";

// The site colors are picked in the Character panel on Home (see theme.js).

const Navbar = () => {
  // Tracks whether the mobile dropdown menu is open
  const [menuOpen, setMenuOpen] = useState(false);

  // Builds the 4 page links. Called twice (toolbar + mobile menu) so the list only lives in one place.
  const renderLinks = (isMobile = false) => {
    // Only the mobile links close the menu on click; desktop links have no menu to close
    const closeMenu = isMobile ? () => setMenuOpen(false) : undefined;
    // NavLink tells us isActive, so the current page's button gets the "is-active" highlight
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

  // Layout: link row, then the hamburger button.
  // The mobile menu shows only while menuOpen.
  // "end" keeps Home from always matching.
  return (
    <nav className="ae-top-nav" aria-label="Main navigation">
      <div className="ae-nav-window">
        <div className="ae-nav-toolbar">{renderLinks()}</div>

        <div className="ae-nav-actions">
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
