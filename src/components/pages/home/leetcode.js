import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Highlight from "./highlight.js";

// The dex: one entry per LeetCode problem, read from problems.json. That file is only loaded when this
// tab opens, so the rest of the site does not carry the solutions. Shape of one entry:
//   { number: 1, title: "Two Sum", slug: "two-sum", difficulty: "Easy",
//     topics: ["Array", "Hash Table"],
//     solutions: [{ language: "Java", code: "..." }] }
// `topics` are the problem types. Each type is a chapter of the book, and the chapters
// are in alphabetical order. A problem with two topics appears in both chapters.
// A problem with no topics goes in the last chapter, "Uncategorized".
// `slug` is the last part of the problem's LeetCode address and builds the problem link.
// `solutions` has one item per language. Only solutions that passed their tests are listed.

const UNSORTED = "Uncategorized";

const buildChapters = (list) => {
  const groups = new Map();
  list.forEach((problem) => {
    const topics = problem.topics && problem.topics.length ? problem.topics : [UNSORTED];
    topics.forEach((topic) => {
      if (!groups.has(topic)) groups.set(topic, []);
      groups.get(topic).push(problem);
    });
  });
  return [...groups.entries()]
    .map(([topic, problems]) => ({
      topic,
      problems: [...problems].sort((a, b) => a.number - b.number),
    }))
    .sort((a, b) => {
      if (a.topic === UNSORTED) return 1;
      if (b.topic === UNSORTED) return -1;
      return a.topic.localeCompare(b.topic, "en", { sensitivity: "base" });
    });
};

const LeetCodeDex = () => {
  const reduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [showCode, setShowCode] = useState(null);

  const [problems, setProblems] = useState(null);

  // The data is its own file so it becomes its own download, fetched once when this panel opens
  useEffect(() => {
    let live = true;
    import("./problems.json").then((data) => {
      if (live) setProblems(data.default);
    });
    return () => {
      live = false;
    };
  }, []);

  const chapters = useMemo(() => buildChapters(problems || []), [problems]);
  const total = problems ? problems.length : 0;
  const chapter = chapters[pageIndex];

  const turnTo = (index) => {
    if (index < 0 || index >= chapters.length || index === pageIndex) return;
    setDirection(index > pageIndex ? 1 : -1);
    setPageIndex(index);
  };

  const flip = reduceMotion ? 0 : 1;

  return (
    <section
      className="ae-render-queue ae-leetcode"
      id="leetcode-panel"
      role="tabpanel"
      aria-labelledby="leetcode-tab"
    >
      <div className="ae-render-queue-heading">
        <div>
          <p className="home-card-label">LeetCode</p>
          <h1>Competition-dex</h1>
        </div>
        <span>{problems ? `${total} logged` : "loading"}</span>
      </div>

      <p className="ae-leetcode-description">
        This is an attempt to log my problems, to brush up on completed problems, and to share new solutions.
        Every time I deploy this site, a small script scans my solutions folder and tells me which problems I finished since last time.
      </p>

      <div className="ae-book-stage">
        <AnimatePresence mode="wait" initial={false}>
          {!isOpen ? (
            <motion.button
              key="cover"
              type="button"
              className="ae-book-cover"
              onClick={() => setIsOpen(true)}
              aria-label="Open the competition-dex"
              initial={{ opacity: 0, rotateY: flip * 35 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: flip * -35 }}
              transition={{ duration: 0.22 }}
              style={{ transformOrigin: "left center" }}
            >
              <span className="ae-book-cover-label">Dex</span>
              <strong>Competition-dex</strong>
              <span className="ae-book-cover-count">
                {problems
                  ? `${chapters.length} ${chapters.length === 1 ? "chapter" : "chapters"} · ${total} ${total === 1 ? "problem" : "problems"}`
                  : "Loading the pages"}
              </span>
              <span className="ae-book-cover-open">Open the book ↗</span>
            </motion.button>
          ) : (
            <motion.div
              key="spread"
              className="ae-book"
              initial={{ opacity: 0, rotateY: flip * -35 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: flip * 35 }}
              transition={{ duration: 0.22 }}
              style={{ transformOrigin: "left center" }}
            >
              <div className="ae-book-page ae-book-page--left">
                <p className="ae-book-page-label">Contents</p>
                {chapters.length === 0 ? (
                  <p className="ae-leetcode-empty">No problems logged yet.</p>
                ) : (
                  <ol className="ae-book-contents">
                    {chapters.map((item, index) => (
                      <li key={item.topic}>
                        <button
                          type="button"
                          className={`ae-book-contents-item${index === pageIndex ? " is-active" : ""}`}
                          aria-current={index === pageIndex ? "page" : undefined}
                          onClick={() => turnTo(index)}
                        >
                          <span>{item.topic}</span>
                          <span className="ae-book-contents-count">{item.problems.length}</span>
                        </button>
                      </li>
                    ))}
                  </ol>
                )}
                <button type="button" className="ae-book-close" onClick={() => setIsOpen(false)}>
                  Close the book
                </button>
              </div>

              <div className="ae-book-page ae-book-page--right">
                {chapter ? (
                  <>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={chapter.topic}
                        className="ae-book-chapter"
                        initial={{ opacity: 0, rotateY: flip * direction * -30 }}
                        animate={{ opacity: 1, rotateY: 0 }}
                        exit={{ opacity: 0, rotateY: flip * direction * 30 }}
                        transition={{ duration: 0.18 }}
                        style={{ transformOrigin: "left center" }}
                      >
                        <p className="ae-book-page-label">Chapter {pageIndex + 1}</p>
                        <h2 className="ae-book-chapter-title">{chapter.topic}</h2>
                        <div className="ae-book-entries">
                          {chapter.problems.map((problem) => (
                            <div key={problem.number} className="ae-book-entry">
                              <div className="ae-book-entry-row">
                                <span className="ae-leetcode-number">#{problem.number}</span>
                                <span className="ae-book-entry-title">
                                  <strong>{problem.title}</strong>
                                  <span className="ae-leetcode-lang">{problem.solutions.map((item) => item.language).join(" · ")}</span>
                                </span>
                                <span
                                  className={`ae-leetcode-badge ae-leetcode-badge--${(problem.difficulty || "").toLowerCase()}`}
                                >
                                  {problem.difficulty}
                                </span>
                                <span className="ae-leetcode-actions">
                                  {problem.slug && (
                                    <a
                                      className="ae-button ae-button--small"
                                      href={`https://leetcode.com/problems/${problem.slug}/`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Problem <span aria-hidden="true">↗</span>
                                    </a>
                                  )}
                                  {problem.solutions.map((item) => {
                                    const id = `${problem.number}-${item.language}`;
                                    const label = problem.solutions.length > 1 ? item.language : "Code";
                                    return (
                                      <button
                                        key={id}
                                        type="button"
                                        className="ae-button ae-button--small"
                                        onClick={() => setShowCode(showCode === id ? null : id)}
                                      >
                                        {showCode === id ? "Hide" : label}
                                      </button>
                                    );
                                  })}
                                </span>
                              </div>
                              {problem.solutions.map((item) =>
                                showCode === `${problem.number}-${item.language}` ? (
                                  <pre key={item.language} className="ae-leetcode-code">
                                    <code><Highlight code={item.code} language={item.language} /></code>
                                  </pre>
                                ) : null
                              )}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                    <div className="ae-book-turn" aria-live="polite">
                      <button
                        type="button"
                        className="ae-button ae-button--small"
                        onClick={() => turnTo(pageIndex - 1)}
                        disabled={pageIndex === 0}
                      >
                        ← Previous
                      </button>
                      <span>
                        {pageIndex + 1} of {chapters.length}
                      </span>
                      <button
                        type="button"
                        className="ae-button ae-button--small"
                        onClick={() => turnTo(pageIndex + 1)}
                        disabled={pageIndex === chapters.length - 1}
                      >
                        Next →
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="ae-leetcode-empty">The pages are blank for now.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default LeetCodeDex;
