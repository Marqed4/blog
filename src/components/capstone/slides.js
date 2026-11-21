// CISC 4900 PowerPoint page: loads the .pptx from /public and draws it in the browser with pptx-preview, plus a download button.
import { useEffect, useRef } from "react";
import { init } from "pptx-preview";
import Navbar from "../layout/navbar.js";
import Footer from "../layout/footer.jsx";
import "./slides.css";

// PUBLIC_URL keeps the path right even if the site is hosted in a subfolder
const PPTX_URL = `${process.env.PUBLIC_URL}/documents/popularvote-sixteenth-draft-dark.pptx`;

const CISC4900PowerPoint = () => {
  // Points at the empty div the slides get drawn into (pptx-preview needs a real DOM node)
  const wrapperRef = useRef(null);

  // Runs once on load: creates the previewer and fetches the file
  useEffect(() => {
    document.title = "CISC 4900 - PopularVote PowerPoint";

    const node = wrapperRef.current;
    // Set to true when leaving the page. A late fetch then draws nothing.
    let cancelled = false;

    const previewer = init(node, {
      width: 960,
      height: 540,
      mode: "slide",
    });

    // Download the file as raw bytes, then hand them to the previewer
    fetch(PPTX_URL)
      .then((res) => res.arrayBuffer())
      .then((buffer) => {
        if (!cancelled) previewer.preview(buffer);
      });

    // Cleanup when leaving the page. Stop any pending render. Empty the div to avoid duplicate slides.
    return () => {
      cancelled = true;
      if (node) node.innerHTML = "";
    };
  }, []);

  // Layout: navbar, download button, then the empty div the slides render into
  return (
    <div className="cisc4900-ppt-container">
      <Navbar />
      <a className="ae-button ae-button--primary cisc4900-ppt-download" href={PPTX_URL} download>
        Download .pptx
      </a>

      <div className="cisc4900-ppt-viewer" ref={wrapperRef} />
      <Footer />
    </div>
  );
};

export default CISC4900PowerPoint;
