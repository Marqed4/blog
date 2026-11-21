// A small "? Guide" pill fixed at the top left. Hover, keyboard focus or a tap opens a short
// list of directions for the site. Escape or a tap outside closes it.
import { useEffect, useRef, useState } from "react";

// The directions. Edit the text here, one line per item.
const LINES = [
  "Top bar: Home, Projects, About and Resume.",
  "On Home, the strip under the title has HOME, RENDER QUEUE and LEETCODE.",
  "LEETCODE is a book. Press Code on a problem to read my solution.",
  "The Character panel on Home changes the site colors.",
  "The cassette at the bottom right plays music. Press its key to start.",
];

const Guide = () => {
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  // Remembers if the last touch of the pill was a mouse, so a click does not undo the hover.
  // Any key press clears it, so Enter on the pill works again for keyboard users.
  const lastPointer = useRef("");

  // While open: Escape closes it, and so does a tap anywhere outside (phones have no hover)
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onOutside = (e) => {
      if (box.current && !box.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onOutside);
    };
  }, [open]);

  // Mouse hover opens and closes it. Touch pointers are ignored here and use the click below.
  const hover = (isOpen) => (e) => {
    lastPointer.current = e.pointerType;
    if (e.pointerType === "mouse") setOpen(isOpen);
  };

  // Mouse: hover already opened it, so a click does nothing. Touch and keyboard: toggle.
  const click = () => {
    if (lastPointer.current === "mouse") return;
    setOpen(!open);
  };

  // Keyboard focus opens it. A tap also focuses the button, so only :focus-visible counts.
  const focus = (e) => {
    if (e.target.matches(":focus-visible")) setOpen(true);
  };

  // Tabbing out of the whole guide closes it
  const blur = (e) => {
    if (!box.current.contains(e.relatedTarget)) setOpen(false);
  };

  // The panel only renders while open. aria-describedby points the pill at it for screen readers.
  // The wrapper also has ae-site because the shared button styles only apply inside it.
  return (
    <div className="ae-site ae-guide" ref={box} onPointerEnter={hover(true)} onPointerLeave={hover(false)} onBlur={blur} onKeyDown={() => { lastPointer.current = ""; }}>
      <button
        type="button"
        className="ae-button ae-button--small ae-guide-pill"
        aria-expanded={open}
        aria-describedby={open ? "ae-guide-panel" : undefined}
        onClick={click}
        onFocus={focus}
      >
        ? Guide
      </button>
      {open && (
        <ul className="ae-guide-panel" id="ae-guide-panel" role="tooltip">
          {LINES.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Guide;
