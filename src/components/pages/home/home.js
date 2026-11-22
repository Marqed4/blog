// Home page: an After Effects style workspace with tabs (Home, Render Queue, LeetCode),
// floating project tiles, a theme color picker, and a contact form.
import { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { subscribeNow } from "../../layout/nowplaying.js";
import { ProjectsArray } from "../projects.js";
import LeetCodeDex from "./leetcode.js";
import { applyTheme, loadTheme, resetTheme, saveTheme } from "../../../theme.js";

import HomeBanner from "../../../resources/art/background-project/gradients/orange-glob-marble.gif";
import Navbar from "../../layout/navbar.js";
import Footer from "../../layout/footer.jsx";

// Fake effect names shown in the left panel (decorative)
const Effects = [
  "Twixtor",
  "RSMB",
  "Element 3D",
  "FilConvert Nitrate",
  "Glow",
  "Shine",
  "Transform",
  "S_ClampChroma",
  "Mocha AE",
  "Add Grain",
];

// One floating tile that drifts toward/away from the mouse. Internal pages use `to` (router Link), the contact tile uses `href`.
const FloatingRectangle = ({ className, to, href, label }) => {
  const rectangleRef = useRef(null);
  // Springs make the tile ease to its target instead of snapping
  const springConfig = { stiffness: 150, damping: 18, mass: 0.6 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);
  const rotateX = useSpring(0, springConfig);
  const rotateY = useSpring(0, springConfig);
  const scale = useSpring(1, springConfig);
  // Pick the element: router Link for pages, plain <a> for the #contact anchor
  const TileLink = to ? Link : "a";
  const destination = to ? { to } : { href };

  // Listens to the mouse on the whole window so the tile reacts when the cursor gets near
  useEffect(() => {
    const handleMouseMove = (event) => {
      const rectangle = rectangleRef.current;
      if (!rectangle) return;

      const bounds = rectangle.getBoundingClientRect();
      const offsetX = bounds.left + bounds.width / 2 - event.clientX;
      const offsetY = bounds.top + bounds.height / 2 - event.clientY;
      const distance = Math.hypot(offsetX, offsetY);
      // Tile only reacts within 280px of the cursor
      const range = 280;

      // Too far away (or reduced motion): settle back to rest
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || distance >= range) {
        x.set(0);
        y.set(0);
        rotateX.set(0);
        rotateY.set(0);
        scale.set(1);
        return;
      }

      // proximity: 0 at the edge of the range, 1 when the cursor is on the tile
      const proximity = 1 - distance / range;
      // Unit direction away from the cursor (|| 1 avoids dividing by zero)
      const directionX = offsetX / (distance || 1);
      const directionY = offsetY / (distance || 1);

      // Push away from the cursor, tilt in 3D and grow slightly, all scaled by how close the cursor is
      x.set(directionX * 30 * proximity);
      y.set(directionY * 30 * proximity);
      rotateX.set(-directionY * 18 * proximity);
      rotateY.set(directionX * 18 * proximity);
      scale.set(1 + 0.06 * proximity);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [rotateX, rotateY, scale, x, y]);

  return (
    <motion.div
      ref={rectangleRef}
      className={`ae-floating-rectangle ${className}`}
      style={{ x, y, rotateX, rotateY, scale }}
    >
      <TileLink
        {...destination}
        className="ae-floating-rectangle-link"
        aria-label={to ? `Open ${label} project` : "Scroll to get in touch"}
      >
        <span className="ae-floating-rectangle-face">
          <strong>{label}</strong>
          <small>{to ? "OPEN PROJECT ↗" : "SCROLL TO CONTACT ↓"}</small>
        </span>
      </TileLink>
    </motion.div>
  );
};

// Home page component
const Home = () => {
  // Which tab is open: composition (Home), renderQueue or leetCode
  const [activePanel, setActivePanel] = useState("composition");
  // The tape's "View in editor" button sends the visitor here with the tab to open
  const route = useLocation();
  // The song the tape is playing, shown as an audio clip in the timeline
  const [song, setSong] = useState({ title: "", playing: false });
  useEffect(() => subscribeNow(setSong), []);
  useEffect(() => {
    if (route.state && route.state.tab) {
      setActivePanel(route.state.tab);
      window.scrollTo({ top: 0 });
    }
  }, [route.state]);
  // True briefly after submit so the paper plane animation plays
  const [isSending, setIsSending] = useState(false);
  // Current Stroke/Fill colors, starting from what was saved in localStorage
  const [theme, setTheme] = useState(loadTheme);

  // Stroke drives the purple accents, Fill drives the blue/teal accents (see theme.js).
  const handleThemeChange = (key) => (event) => {
    const next = { ...theme, [key]: event.target.value };
    setTheme(next);
    saveTheme(next);
    applyTheme(next);
  };

  // Reset: resetTheme clears storage, applies defaults and returns them for state
  const handleThemeReset = () => setTheme(resetTheme());

  // Set the browser tab title when the page loads
  useEffect(() => {
    document.title = "Marqed's Homepage";
  }, []);

  // No backend: build a mailto: link from the form so it opens the visitor's email app
  const handleContactSubmit = (event) => {
    // Stop the normal page-reloading form submit
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");
    // encodeURIComponent so spaces/newlines are safe in the URL
    const subject = encodeURIComponent(`Website message from ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);

    setIsSending(true);
    window.location.href = `mailto:zacherywfrancis@gmail.com?subject=${subject}&body=${body}`;
    // Turn the sending animation off after 1.6s
    window.setTimeout(() => setIsSending(false), 1600);
  };

  // Layout: navbar, then the workspace window (titlebar, tab buttons, left panel | stage | right panel,
  // timeline), then the contact form. The stage shows Home, LeetCode or the Render Queue depending on activePanel.
  return (
    <>
      <div className="home-container">
        <Navbar />
        <img src={HomeBanner} alt="" className="home-banner-bg" />
        <div className="home-banner-mirror-top" aria-hidden="true">
          <img src={HomeBanner} alt="" />
        </div>
        <div className="home-banner-mirror-right" aria-hidden="true">
          <img src={HomeBanner} alt="" />
        </div>
        <div className="home-banner-mirror-corner" aria-hidden="true">
          <img src={HomeBanner} alt="" />
        </div>

        <main className="ae-workspace-shell">
          <div className="ae-window-titlebar">
            <span className="ae-window-filename">*.aep</span>
            <span className="ae-window-mode">Workspace: Portfolio</span>
            <div className="ae-window-controls" aria-hidden="true">
              <span className="ae-window-minimize" />
              <span className="ae-window-maximize" />
              <span className="ae-window-close">×</span>
            </div>
          </div>
          <div className="ae-workspace-menubar" aria-hidden="true">
            File&nbsp;&nbsp; Edit&nbsp;&nbsp; Composition&nbsp;&nbsp; Layer&nbsp;&nbsp; Effect&nbsp;&nbsp; Animation&nbsp;&nbsp; View&nbsp;&nbsp; Window&nbsp;&nbsp; Help
          </div>
          <div className="ae-workspace-tools" aria-hidden="true">
            <span className="ae-tool-active">↖</span>
            <span>✋</span>
            <span>⌕</span>
            <span className="ae-tool-separator" />
            <span>♢</span>
            <span>▣</span>
            <span className="ae-tool-spacer" />
            <span>16:9&nbsp; · &nbsp;100%</span>
          </div>
          <div className="ae-panel-tabs" role="tablist" aria-label="Workspace panels">
            <span>PROJECT</span>
            <button
              type="button"
              id="composition-tab"
              className={`ae-panel-tab${activePanel === "composition" ? " ae-panel-tab-active" : ""}`}
              role="tab"
              aria-selected={activePanel === "composition"}
              aria-controls="composition-panel"
              onClick={() => setActivePanel("composition")}
            >
              HOME
            </button>
            <button
              type="button"
              id="render-queue-tab"
              className={`ae-panel-tab${activePanel === "renderQueue" ? " ae-panel-tab-active" : ""}`}
              role="tab"
              aria-selected={activePanel === "renderQueue"}
              aria-controls="render-queue-panel"
              onClick={() => setActivePanel("renderQueue")}
            >
              RENDER QUEUE
            </button>
            <button
              type="button"
              id="leetcode-tab"
              className={`ae-panel-tab${activePanel === "leetCode" ? " ae-panel-tab-active" : ""}`}
              role="tab"
              aria-selected={activePanel === "leetCode"}
              aria-controls="leetcode-panel"
              onClick={() => setActivePanel("leetCode")}
            >
              LEETCODE
            </button>
          </div>

          <div className="ae-workspace-main">
            <aside className="ae-project-panel" aria-label="Effect controls and project panel">
              <div className="ae-dock-tabs" aria-hidden="true">
                <span className="is-active">Effect Controls</span>
                <span>Project</span>
              </div>
              <div className="ae-inspector-header">Blog Composition</div>
              <ul className="ae-effect-list" aria-label="Effects">
                {Effects.map((effect) => (
                  <li key={effect}>
                    <span aria-hidden="true">▸</span>
                    {effect}
                  </li>
                ))}
              </ul>
              <div className="ae-project-header">Project</div>
              <ul className="ae-project-list">
                <li className="is-active">Marqed Portfolio</li>
                <li>PopularVote</li>
                <li>Calisigh</li>
                <li>Gallery</li>
                <li>TimeRabbit</li>
              </ul>
            </aside>

            <div className="ae-stage-pane">
              {activePanel === "composition" ? (
                <>
                  <div
                    className="home-content"
                    id="composition-panel"
                    role="tabpanel"
                    aria-labelledby="composition-tab"
                  >
                    <section className="home-card home-intro-card">
                      <p className="home-card-label">Composition / Introduction</p>
                      <p>
                        Hi, I’m Zach; online, I go by Marqed.<br /><br />
                        I’m an M.S. Computer Science student at Brooklyn College, building full-stack apps and desktop tools. I’m interested in software and IT internships and share my technical and creative work here.
                      </p>
                    </section>

                  </div>
                  <div className="ae-floating-rectangles">
                    <FloatingRectangle
                      className="ae-floating-rectangle--popularvote"
                      to="/PopularVote"
                      label="PopularVote"
                    />
                    <FloatingRectangle
                      className="ae-floating-rectangle--calisigh"
                      to="/Calisigh"
                      label="Calisigh"
                    />
                    <FloatingRectangle
                      className="ae-floating-rectangle--projects"
                      to="/Projects"
                      label="Projects"
                    />
                    <FloatingRectangle
                      className="ae-floating-rectangle--gallery"
                      to="/Gallery"
                      label="Gallery"
                    />
                    <FloatingRectangle
                      className="ae-floating-rectangle--contact"
                      href="#contact"
                      label="Get in touch"
                    />
                  </div>
                </>
              ) : activePanel === "leetCode" ? (
                <LeetCodeDex />
              ) : (
                <section
                  className="ae-render-queue"
                  id="render-queue-panel"
                  role="tabpanel"
                  aria-labelledby="render-queue-tab"
                >
                  <div className="ae-render-queue-heading">
                    <div>
                      <p className="home-card-label">Render Queue</p>
                      <h1>Projects</h1>
                    </div>
                    <span>{ProjectsArray.length} items</span>
                  </div>
                  <div className="ae-render-queue-list">
                    {ProjectsArray.map((project) => (
                      <Link
                        key={project.id}
                        className="ae-render-queue-item"
                        to={`/${project.title.replace(/\s+/g, "")}`}
                      >
                        <span className="ae-render-queue-status" aria-hidden="true" />
                        <span className="ae-render-queue-copy">
                          <strong>{project.title}</strong>
                          <span>{project.description.split("\n")[0]}</span>
                        </span>
                        <span className="ae-render-queue-action">Open project ↗</span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="ae-inspector-panel" aria-label="Character panel">
              <div className="ae-dock-stack" aria-hidden="true">
                <div>Info</div>
                <div>Audio</div>
                <div>Effects &amp; Presets</div>
                <div>Libraries</div>
                <div>Align</div>
              </div>
              <div className="ae-inspector-header">Character</div>
              <div className="ae-character-controls" aria-hidden="true">
                <div className="ae-character-font">
                  <span>Franklin Gothic...</span>
                  <span>Regular</span>
                </div>
                <div className="ae-character-row">
                  <span>36 px</span>
                  <span>Auto</span>
                </div>
                <div className="ae-character-row">
                  <span>127%</span>
                  <span>135%</span>
                </div>
                <div className="ae-character-tools">
                  <span>B</span><span>I</span><span>U</span><span>All Caps</span>
                </div>
              </div>
              <div className="ae-character-controls ae-character-theme">
                <div className="ae-character-colors">
                  <label htmlFor="theme-fill">Fill</label>
                  <input
                    id="theme-fill"
                    type="color"
                    className="ae-character-swatch"
                    value={theme.fill}
                    onChange={handleThemeChange("fill")}
                    aria-label="Fill color, the secondary accent"
                    title="Fill: secondary accent color"
                  />
                  <label htmlFor="theme-stroke">Stroke</label>
                  <input
                    id="theme-stroke"
                    type="color"
                    className="ae-character-swatch"
                    value={theme.stroke}
                    onChange={handleThemeChange("stroke")}
                    aria-label="Stroke color, the main accent"
                    title="Stroke: main accent color"
                  />
                </div>
                <button type="button" className="ae-character-reset" onClick={handleThemeReset}>
                  Reset colors
                </button>
              </div>
            </aside>
          </div>

          <section className="ae-timeline" aria-label="Decorative composition timeline">
            <div className="ae-timeline-heading">
              <strong>Timeline</strong>
              <span>HOME_COMP&nbsp; · &nbsp;00:00:12:18</span>
            </div>
            <div className="ae-timeline-ruler" aria-hidden="true">
              <span>0s</span><span>3s</span><span>6s</span><span>9s</span><span>12s</span>
            </div>
            <div className="ae-timeline-track" aria-hidden="true">
              <span className="ae-track-name">INTRO / TYPE</span>
              <span className="ae-track-clip ae-track-clip-intro" />
            </div>
            <div className="ae-timeline-track" aria-hidden="true">
              <span className="ae-track-name">PROJECTS</span>
              <span className="ae-track-clip ae-track-clip-projects" />
            </div>
            <div className="ae-timeline-track" aria-hidden="true">
              <span className="ae-track-name">CONTACT</span>
              <span className="ae-track-clip ae-track-clip-contact" />
            </div>
            <div className="ae-timeline-track">
              <span className="ae-track-name">AUDIO</span>
              <span className={`ae-track-clip ae-track-clip-audio${song.title ? " has-song" : ""}${song.playing ? " is-playing" : ""}`}>{song.title}</span>
            </div>
          </section>
        </main>
        <section className={`ae-contact-section${isSending ? " is-sending" : ""}`} id="contact" aria-labelledby="contact-title">
          <div className="ae-contact-cloud" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="ae-contact-copy">
            <p className="home-card-label">Output / Get in touch</p>
            <h2 id="contact-title">Let’s make something.</h2>
            <p>Send a note and it’ll open in your email app, ready to fly.</p>
            <a href="mailto:zacherywfrancis@gmail.com">zacherywfrancis@gmail.com</a>
          </div>
          <form className="ae-contact-form" onSubmit={handleContactSubmit}>
            <label>
              Name
              <input name="name" autoComplete="name" required />
            </label>
            <label>
              Email
              <input name="email" type="email" autoComplete="email" required />
            </label>
            <label className="ae-contact-message">
              Message
              <textarea name="message" rows="3" required />
            </label>
            <button type="submit" className="ae-send-button" disabled={isSending}>
              <span>{isSending ? "Sending…" : "Send message"}</span>
              <svg className="ae-paper-plane" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 2 11 13" />
                <path d="m22 2-7 20-4-9-9-4Z" />
              </svg>
            </button>
            <p className="ae-contact-note" aria-live="polite">
              {isSending ? "Your email app is opening…" : "Your message stays in your email app until you send it."}
            </p>
          </form>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Home;
