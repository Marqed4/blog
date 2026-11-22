// About/Details page (route /Details): contact buttons, resume links, education, tech stack, editing software and interests.
import { useEffect, useState } from "react";
import Navbar from "../layout/navbar.js"
import Footer from "../layout/footer.jsx"

// The two emails the copy buttons use
let profEmail   = "zacherywfrancis@gmail.com"
let freelEemail = "marqers7@gmail.com";

const Details = () => {

  // Which email was just copied, so its button can say "Copied!" for a moment
  const [copied, setCopied] = useState("");

  // Copies text to the clipboard, then shows "Copied!" on that button for 2 seconds
  const copy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text);
      setTimeout(() => setCopied(""), 2000);
    });
  };

  // Sets the browser tab title when the page loads ([] = run once)
  useEffect(() => {
    document.title = "Marqed's Details";
  }, []);

  // Hyperlink the email/mailto:

  // Layout: left column (contacts, resume), middle column (education, tech stack, editing software),
  // then interests.
  return (
    <>
      <div className="details-container">
        <Navbar/>
        <h1 className="workspace-page-title details-page-title">
          <span className="workspace-page-title-text">Details</span>
        </h1>

        <div className="details-content">

          <div className="details-left-column">
            <div className="details-layout-emails">
              <h2 className="details-emails-header">Contacts</h2>
              <p className="contacts-body">
                <button onClick={() => copy(profEmail)} className="ae-button ae-button--small">{copied === profEmail ? "Copied!" : "Copy professional email"}</button><br/>
                <button onClick={() => copy(freelEemail)} className="ae-button ae-button--small">{copied === freelEemail ? "Copied!" : "Copy freelance email"}</button><br/>
                <a className="ae-button ae-button--small" href="https://www.linkedin.com/in/zachery-francis/" target="_blank" rel="noopener noreferrer">LinkedIn <span aria-hidden="true">↗</span></a>
              </p>
            </div>

            <div className="details-layout-resume">
              <h2 className="details-resume-header">Resume</h2>
              <p className="resume-body">
                {/* Plain <a> on purpose: target="_blank" opens a new tab, which is a new
                    document either way, so <Link> would not save a reload here. The
                    other internal links in the site use <Link> (see app.js). */}
                <a className="ae-button ae-button--small" href="/Resume" target="_blank" rel="noopener noreferrer">
                  View resume
                </a>
                <br/>
                <a className="ae-button ae-button--small" href={`${process.env.PUBLIC_URL}/documents/zacheryfrancis-resume-10-4-2026.pdf`} download>
                  Download resume
                </a>
              </p>
            </div>
          </div>

          <div className="education-and-skills">
            <div className="details-layout-edu">
              <h2 className="details-education-header">Education</h2>
              <p className="education-body">
                Brooklyn College<br/>
                • M.S. in Computer Science, Concentration: Information Systems<br/><br/>
                Brooklyn College<br/>
                • B.S. in Information Systems, Minor: Computer Science<br/>
                • B.S. in Business Management<br/><br/>
                Kingsborough Community College<br/>
                • A.A. in Liberal Arts
              </p>
            </div>

            <div className="details-layout-coding-lang-framework">
              <h2 className="details-skills-lang-framework">Tech Stack</h2>
              <p className="coding-lang-framworks-body">
                <span className="skill-line">• Java / Oracle JDK 23/25</span><br/>
                <span className="skill-line">• Python / Python 3.13 <span className="studying-tag">Studying</span></span><br/>
                <span className="skill-line">• React / React 19 (HTML, JS, CSS) <span className="studying-tag">Studying</span></span><br/>
                <span className="skill-line">• Rust <span className="studying-tag">Studying</span></span><br/>
                <span className="skill-line">• SQL / PostgreSQL <span className="studying-tag">Studying</span></span><br/>
              </p>
            </div>

            <div className="details-layout-editing-software">
              <h2 className="details-skills-edit-software">Editing Software</h2>
              <p className="editing-software-body">
                • Adobe After Effects<br/>
                • Adobe Premiere Pro<br/>
                • Adobe Media Encoder<br/>
                • Sony Vegas Pro<br/>
              </p>
            </div>
          </div>

          <div className="details-layout-int">
            <h2 className="details-interests-header">Interests</h2>
            <p className="interests-body">
            To me, programming and technology serve as excellent tools through which I can express myself and be creative.<br/>
            In particular, when it comes to coding, I see it not only as a tool but also as an opportunity to resolve challenging issues and create something using my personal style in programming.<br/>
            Technology suits me well because I have all the necessary instruments that I need for creating.
            </p>
          </div>

        </div>
      </div>
    <Footer />
  </>
  );
};

export default Details;