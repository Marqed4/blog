import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="pv-footer">
      <span className="pv-footer-text">Marqed</span>
      <a
        className="pv-footer-link"
        href="https://github.com/Marqed4"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithub aria-hidden="true" />
        <span>GitHub</span>
      </a>
    </footer>
  );
}