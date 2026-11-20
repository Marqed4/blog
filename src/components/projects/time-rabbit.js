// TimeRabbit project page: a screenshot with a numbered feature list, then Overview / Features / Architecture cards.
import { useEffect } from "react";
import Navbar from "../layout/navbar.js"
import Footer from "../layout/footer.jsx";
import "./time-rabbit.css"

import AppView from "../../resources/art/projects/time-rabbit/view-app.png"


// Data for the screenshot rows: image, label, short tag and bullet list.|NL|// An optional flip: true would put the image on the right (none use it here).
const sections = [
  {
    img: AppView,
    alt: "TimeRabbit app view",
    label: "The Stopwatch",
    tag: "sw",
    items: [
      "Time display → shows elapsed time in HH:MM:SS format",
      "Start button → begins the timer; label switches to Stop while running",
      "Stop button → pauses the timer at the current elapsed time",
      "Reset button → stops the timer and returns the display to 00:00:00",
      "Custom background → TimeRabbit.png renders behind the controls",
      "Custom icon → Time-Rabbit.ico appears in the taskbar and title bar",
    ],
  },
];

// Mostly static content, so no state needed
const TimeRabbit = () => {

  // Sets the browser tab title once when the page loads ([] = run once)
  useEffect(() => {
    document.title = "TimeRabbit";
  }, []);

  // Layout: navbar + title, screenshot rows (from sections), then Overview / Features / Architecture cards
  return (
    <div className="timerabbit-container">
      <Navbar />

      <h1 className="workspace-page-title">
        <a
          href="https://github.com/Marqed4/TimeRabbit"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="workspace-page-title-text">TimeRabbit</span>
        </a>
      </h1>

      <p className="timerabbit-description">A simple stopwatch app.</p>
      <p className="timerabbit-description">
        Start, stop, and reset. That's it.
      </p>

      <div className="timerabbit-views">
        {sections.map(({ img, alt, label, tag, flip, items }) => (
          <div
            key={tag}
            className={`timerabbit-view-section${flip ? " timerabbit-view-section--flip" : ""}`}
          >
            <img src={img} className="timerabbit-screenshot" alt={alt} />
            <div className="timerabbit-view-docs">
              <p className="timerabbit-view-label">{label}</p>
              <ul className="timerabbit-view-list">
                {items.map((item, i) => (
                  <li key={i}>
                    <span className="timerabbit-tag">{tag}.{i + 1}</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="timerabbit-content">

        <div className="timerabbit-layout-overview">
          <h2 className="section-heading">Overview</h2>
          <p className="overview-body">
            <strong>TimeRabbit</strong> is a desktop stopwatch built entirely in <strong>Java Swing</strong>.<br /><br />
            A single <code>Stopwatch</code> class wires together the UI, a <code>javax.swing.Timer</code> firing every second,
            and start/stop/reset logic - all packaged and shipped as a Windows installer.<br /><br />
            The background image and app icon are loaded from a <code>resources/</code> folder
            relative to the executable, so the app looks the same on any machine.
          </p>
        </div>

        <div className="timerabbit-layout-features">
          <h2 className="section-heading">Features</h2>
          <p className="features-body">
            • <strong>HH:MM:SS display</strong>: zero-padded hours, minutes, and seconds<br /><br />
            • <strong>Start / Stop toggle</strong>: one button, two states<br /><br />
            • <strong>Reset</strong>: clears elapsed time and stops the timer<br /><br />
            • <strong>Custom background</strong>: full-panel image rendered behind the controls<br /><br />
            • <strong>Packaged installer</strong>: ships as a Windows setup executable (v1.1.5)
          </p>
        </div>

        <div className="timerabbit-layout-architecture">
          <h2 className="section-heading">Architecture</h2>
          <p className="architecture-body">
            Java Swing (UI)<br />
            ↓<br /><br />
            javax.swing.Timer<br />
            (1s tick)<br />
            ↓<br /><br />
            Stopwatch.java<br />
            (single class)<br />
            ↓<br /><br />
            Windows Installer<br />
            (v1.1.5)
          </p>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default TimeRabbit;