// Projects page (route /Projects): a featured card on top, then a grid of the rest. Each card links to that project's own page.
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../layout/navbar.js";
import Footer from "../layout/footer.jsx"
import Reveal from "../layout/reveal.js"
import "./projects.css";

import DivaFFMPEGLogo from "../../resources/art/projects/diva-ffmpeg/diva-icon.gif";
import CalisighLogo from "../../resources/art/projects/calisigh/icon.png";
import PopularVoteLogo from "../../resources/art/projects/popularvote/favicon.png"
import SudokuLogo from "../../resources/art/projects/sudoku/favicon.png"
import TimeRabbitLogo from "../../resources/art/projects/time-rabbit/time-rabbit.png"

// Currently mentioned project list. 
// Exported so the Home page can reuse the same list. `featured` gets the big card; `link` (live site) is optional.
export const ProjectsArray = [
  // Calisigh
  {
    id: 1,
    featured: true,
    logo: CalisighLogo,
    title: "Calisigh",
    repository: "https://github.com/Marqed4/Calisigh",
    description: "A feature‑rich Midwestern-emo calendar\n" +
    "Open it, add your events, choose your themes, and self-loath...",
  },
  // PopularVote
  {
    id: 2,
    logo: PopularVoteLogo,
    link: "https://popularvote.marqed.it",
    repository: "https://github.com/Marqed4/PopularVote",
    title: "PopularVote",
    description: "Private query session w/ AI forked clustering/condensing\n",
  },
  // CISC 4900 - PopularVote
  {
    id: 3,
    logo: PopularVoteLogo,
    repository: "https://github.com/Marqed4/CISC-4900-PopularVote",
    title: "CISC-4900-PopularVote",
    description: "CISC 4900 capstone build of PopularVote\n" +
    "Flask/SocketIO backend, Gemini clustering, and a full time log",
  },
  // Diva FFMPEG
  {
    id: 4,
    logo: DivaFFMPEGLogo,
    repository: "https://github.com/Marqed4/DivaFFMPEG",
    title: "Diva FFMPEG",
    description: "Beautiful multimedia control. \n Transforming ffmpeg's CLI into the Diva TUI experience.",
  },
  // Sudoku
  {
    id: 5,
    logo: SudokuLogo,
    link: "https://sudoku.marqed.it",
    repository: "https://github.com/Marqed4/Sudoku",
    title: "Sudoku",
    description: "A full‑stack Sudoku solver, scanner, and generator\n",
  },
  // Time Rabbit
  {
    id: 6,
    logo: TimeRabbitLogo,
    repository: "https://github.com/Marqed4/TimeRabbit",
    title: "TimeRabbit",
    description: "A simple stopwatch app\n",
  },
];

/*
Each project will contain it's own data. 
Redirecting the user to a page with more about that project.
*/
// index only controls how late Reveal animates the card in
// The Live site / Source buttons sit outside the Link so no link is nested inside another link.
const ProjectCard = ({ project, index }) => (
  <Reveal key={project.id} index={index} className={`project-wrapper${project.featured ? " project-wrapper--featured" : ""}`}>
    <Link
      // Route path is the title with spaces removed ("Diva FFMPEG" -> /DivaFFMPEG)
      to={"/" + project.title.replace(/\s+/g, "")}
      className={`project-card${project.featured ? " project-card--featured" : ""}`}
    >
      <img
        src={project.logo}
        alt={project.title + "-logo"}
        className="project-logo"
      />
      {project.featured && (
        <span className="project-featured-badge">Featured</span>
      )}
      <div className="project-info">
        <h2 className="project-name">{project.title}</h2>
        <p className="project-description">{project.description}</p>
      </div>
    </Link>
    <div className="project-actions">
      {project.link && (
        <a className="ae-button ae-button--small" href={project.link} target="_blank" rel="noopener noreferrer">
          Live site <span aria-hidden="true">↗</span>
        </a>
      )}
      {project.repository && (
        <a className="ae-button ae-button--small" href={project.repository} target="_blank" rel="noopener noreferrer">
          Source code <span aria-hidden="true">↗</span>
        </a>
      )}
    </div>
  </Reveal>
);

const Projects = () => {
  // Sets the browser tab title when the page loads
  useEffect(() => {
    document.title = "Marqed's Projects";
  }, []);

  // Split the list: first featured project gets its own card, everything else goes in the grid
  const featured = ProjectsArray.find(p => p.featured);
  const rest = ProjectsArray.filter(p => !p.featured);

  // Featured project gets its own big card (index 0); the grid cards start at index + 1 so the stagger continues.
  return (
    <>
      <Navbar />
      <div className="projects-page">
        <h1 className="workspace-page-title projects-page-title">
          <span className="workspace-page-title-text">Projects</span>
        </h1>
        {featured && <ProjectCard project={featured} index={0} />}
        <div className="projects-grid">
          {rest.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index + 1} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Projects;