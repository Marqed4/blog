import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../layout/navbar.js";
import Footer from "../layout/footer.jsx";

// Shown by the "*" route in app.js for any path that has no page.
// It keeps the navbar and footer so a visitor with a dead link is never stuck,
// and the links below are <Link> so they do not reload the page (see app.js).
const NotFound = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = "Page not found";
  }, []);

  return (
    <>
      <div className="notfound-container">
        <Navbar />
        <div className="notfound-card">
          <h1 className="notfound-code">404</h1>
          <p className="notfound-message">
            That page does not exist, or it moved.
          </p>
          {/* Echo the address so a mistyped or outdated link is easy to spot. */}
          <p className="notfound-path">{pathname}</p>
          <p className="notfound-links">
            <Link to="/">Home</Link>
            <Link to="/Projects">Projects</Link>
            <Link to="/Resume">Resume</Link>
            <Link to="/Details">Details</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
