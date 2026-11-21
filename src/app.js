// Root of the site: draws the parallax background and maps each URL to its page component.
import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import './components/pages/missing.css';
import NotFound from "./components/pages/missing.jsx";

import './app.css';

// <---- Landing Page ---->
import './components/layout/icon.css';
import './components/layout/navbar.css';
import './components/layout/footer.css'
import './components/pages/home/body.css';
import './components/pages/home/portfolio.css'
import './components/pages/home/text.css';

// <---- Landing Page ---->
import Home from "./components/pages/home/home.js";

// <---- Details Page ---->
import './components/pages/details.css';
import Details from "./components/pages/details.js";

// <---- Projects Page ---->
import './components/pages/projects.css';
import Projects from "./components/pages/projects.js";

// <---- Gallery Page ---->
import './components/pages/gallery.css';
import Gallery from "./components/pages/gallery.js";

// <---- Resume Page ---->
import './components/pages/resume.css';
import Resume from "./components/pages/resume.js";

// <---- Diva FFMPEG Page ---->
import './components/projects/diva-ffmpeg.css';
import DivaFFMPEG from "./components/projects/diva-ffmpeg.js";

// <---- Sudoku Proj Page ---->
import './components/projects/sudoku.css';
import Sudoku from "./components/projects/sudoku.js";

// <---- Custom Calendar Proj Page ---->
import './components/projects/calisigh.css';
import Calisigh from "./components/projects/calisigh.js";

// <---- PopularVote Proj Page ---->
import './components/projects/popular-vote.css';
import PopularVote from "./components/projects/popular-vote.js";

// <---- Time Rabbit Proj Page ---->
import './components/projects/time-rabbit.css';
import TimeRabbit from "./components/projects/time-rabbit.js";

// <---- PopularVote Time Log Page (url-only, no nav link) ---->
import './components/capstone/timelog.css';
import PopularVoteTimeLog from "./components/capstone/timelog.js";

// <---- CISC 4900 PopularVote Page ---->
import './components/capstone/overview.css';
import CISC4900PopularVote from "./components/capstone/overview.js";

// <---- CISC 4900 PopularVote PowerPoint Page (url-only, no nav link) ---->
import './components/capstone/slides.css';
import CISC4900PowerPoint from "./components/capstone/slides.js";

import './components/layout/pages.css';

// <---- Guide ---->
import './components/layout/guide.css';
import Guide from "./components/layout/guide.js";

// <---- Music Tape ---->
import './components/layout/tape.css';
import Tape from "./components/layout/tape.js";

import DefaultBackground from "./resources/art/background-project/gradients/site.gif";

// Why internal links use react-router's <Link> and not <a href>:
// A plain <a href="/Projects"> makes the browser load a brand new document. That
// re-downloads and re-parses the JS bundle, remounts <App>, and restarts the
// background gif and the parallax springs below, so every click flashes and
// resets the page. <Link to="/Projects"> only swaps the route on the client, so
// <App> (and the background it draws) stays mounted the whole visit.
// Links that leave the site (other domains, mailto:) stay as <a>, because they
// have to leave the app.
//
// Side effect of client side navigation: the browser no longer jumps to the top on
// its own, so a page opened from a scrolled position would start mid-page.
// ScrollToTop puts that back by scrolling to the top on every route change.
// Scrolls to the top whenever the route changes (see note above)
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// App: parallax background + route table
const App = () => {
  // Mouse position as -0.5..0.5 from the screen center (updated in the mousemove effect)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  // Whether the user asked their OS for less motion; read once on first render
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  // Springs smooth the raw mouse values; reduced motion uses softer settings
  const springConfig = { stiffness: prefersReducedMotion ? 18 : 40, damping: prefersReducedMotion ? 28 : 20, mass: 0.5 };
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  // Parallax: background moves 14px opposite the mouse, content 50px; both stay still for reduced motion
  const bgX = useTransform(x, (v) => prefersReducedMotion ? 0 : v * -14);
  const bgY = useTransform(y, (v) => prefersReducedMotion ? 0 : v * -14);
  const contentX = useTransform(x, (v) => prefersReducedMotion ? 0 : v * -50);
  const contentY = useTransform(y, (v) => prefersReducedMotion ? 0 : v * -50);

  // Keeps prefersReducedMotion in sync if the user changes the OS setting while the site is open
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handlePreferenceChange = () => setPrefersReducedMotion(mediaQuery.matches);

    handlePreferenceChange();
    mediaQuery.addEventListener?.('change', handlePreferenceChange);
    return () => mediaQuery.removeEventListener?.('change', handlePreferenceChange);
  }, []);

  // Tracks the mouse across the whole window and feeds it to the springs
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (prefersReducedMotion) {
        rawX.set(0);
        rawY.set(0);
        return;
      }
      rawX.set(e.clientX / window.innerWidth - 0.5);
      rawY.set(e.clientY / window.innerHeight - 0.5);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [prefersReducedMotion, rawX, rawY]);

  // Parallax background image + the content wrapper that holds the route table (path -> page, "*" = 404).
  return (
    <>
      <ScrollToTop />
      <motion.img
        src={DefaultBackground}
        alt=""
        className="home-bg"
        style={{ x: bgX, y: bgY }}
      />
      <motion.div className="ae-site" style={{ x: contentX, y: contentY }}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/Details" element={<Details/>} />
          <Route path="/Resume" element={<Resume/>} />
          <Route path="/Projects" element={<Projects/>} />
          <Route path="/Gallery" element={<Gallery/>} />
          <Route path="/TimeRabbit" element={<TimeRabbit/>} />
          <Route path="/Calisigh" element={<Calisigh/>} />
          <Route path="/PopularVote" element={<PopularVote/>} />
          <Route path="/Sudoku" element={<Sudoku/>} />
          <Route path="/DivaFFMPEG" element={<DivaFFMPEG/>} />
          <Route path="/CISC-4900-PopularVote-TimeLog" element={<PopularVoteTimeLog/>} />
          <Route path="/CISC-4900-PopularVote-PowerPointPresentation" element={<CISC4900PowerPoint/>} />
          <Route path="/CISC-4900-PopularVote" element={<CISC4900PopularVote/>} />
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </motion.div>
      <Guide />
      <Tape />
    </>
  );
};

export default App;