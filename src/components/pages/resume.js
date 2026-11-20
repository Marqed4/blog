import { useEffect } from "react";
import Footer from "../layout/footer.jsx";
import Navbar from "../layout/navbar.js";

const RESUME_URL = `${process.env.PUBLIC_URL}/documents/zacheryfrancis-resume-10-4-2026.pdf`;

const Resume = () => {
  useEffect(() => {
    document.title = "Zachery Francis - Resume";
  }, []);

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
