// Resume page (route /Resume): a download button and the PDF shown in an iframe.
import { useEffect } from "react";
import Footer from "../layout/footer.jsx";
import Navbar from "../layout/navbar.js";

// PUBLIC_URL keeps the path right if the site is hosted in a subfolder
const RESUME_URL = `${process.env.PUBLIC_URL}/documents/zacheryfrancis-resume-10-4-2026.pdf`;

const Resume = () => {
  // Sets the browser tab title when the page loads
  useEffect(() => {
    document.title = "Zachery Francis - Resume";
  }, []);

  // #toolbar=0&navpanes=0 on the iframe asks the browser's PDF viewer to hide its toolbar and side panel.
  return (
    <div className="resume-container">
      <Navbar />

      <a className="ae-button ae-button--primary resume-download" href={RESUME_URL} download>
        Download .pdf
      </a>

      <iframe
        className="resume-pdf-viewer"
        src={`${RESUME_URL}#toolbar=0&navpanes=0`}
        title="Zachery Francis Resume"
      />
      <Footer />
    </div>
  );
};

export default Resume;
