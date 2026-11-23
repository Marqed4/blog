// Scroll sound: a soft loop while the mouse wheel is scrolling the page, then a wind-down clip when it stops,
// like a spinning thing coasting to a halt. The sound never lasts longer than the scrolling does.
// Browsers keep audio silent until the visitor has clicked or pressed a key once, so before that nothing plays.
import loopUrl from "../../resources/sound/skittle-scroll_start.wav";
import windDownUrl from "../../resources/sound/skittle-scroll_end.wav";

const KEY = "ae-sfx";
const CEILING = 0.2; // hard volume ceiling for every scroll sound
const QUIET_MS = 140; // no scroll for this long counts as stopped
const FADE_MS = 70; // how fast the loop fades out before the wind-down starts

// On by default, and the visitor's choice is saved
let on = true;
try { on = localStorage.getItem(KEY) !== "off"; } catch { /* storage blocked, keep the default */ }

export const sfxOn = () => on;

// State: "idle", "running" (loop playing while scrolling) or "winding" (wind-down clip playing).
// Only one of the two clips plays at a time, so they never overlap.
let state = "idle";
let loop = null;
let windDown = null;
let quietTimer = 0;
let fadeTimer = 0;

const make = (url, repeat) => {
  const a = new Audio(url);
  a.preload = "auto";
  a.volume = CEILING;
  a.loop = repeat;
  return a;
};

// Stops everything right now
const silence = () => {
  clearTimeout(quietTimer);
  clearInterval(fadeTimer);
  state = "idle";
  [loop, windDown].forEach((a) => {
    if (!a) return;
    a.pause();
    a.currentTime = 0;
    a.volume = CEILING;
  });
};

export const setSfx = (value) => {
  on = value;
  try { localStorage.setItem(KEY, value ? "on" : "off"); } catch { /* storage blocked */ }
  if (!value) silence();
};

// Scrolling stopped: fade the loop out quickly, then play the wind-down once
const coast = () => {
  if (state !== "running") return;
  state = "winding";
  const steps = 5;
  let n = 0;
  clearInterval(fadeTimer);
  fadeTimer = setInterval(() => {
    n += 1;
    loop.volume = Math.max(0, CEILING * (1 - n / steps));
    if (n < steps) return;
    clearInterval(fadeTimer);
    loop.pause();
    loop.currentTime = 0;
    loop.volume = CEILING;
    windDown.currentTime = 0;
    windDown.volume = CEILING;
    windDown.play().catch(() => { state = "idle"; });
    windDown.onended = () => { if (state === "winding") state = "idle"; };
  }, FADE_MS / steps);
};

// Starts listening for scrolling. Returns the function that stops it.
export const startScrollSounds = () => {
  loop = make(loopUrl, true);
  windDown = make(windDownUrl, false);
  let lastWheel = 0;

  // Only the wheel counts, so jumps made by the site (like going to the top on a new page) stay silent
  const onWheel = () => { lastWheel = Date.now(); };
  const onScroll = () => {
    if (!on || Date.now() - lastWheel > 250) return;
    if (state !== "running") {
      // Scrolling again: cut any wind-down in progress, then start the loop
      silence();
      state = "running";
      loop.play().catch(() => { state = "idle"; });
    }
    clearTimeout(quietTimer);
    quietTimer = setTimeout(coast, QUIET_MS);
  };
  // A hidden tab should be quiet
  const onHide = () => { if (document.hidden) silence(); };

  window.addEventListener("wheel", onWheel, { passive: true });
  window.addEventListener("scroll", onScroll, { capture: true, passive: true });
  document.addEventListener("visibilitychange", onHide);
  return () => {
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("scroll", onScroll, true);
    document.removeEventListener("visibilitychange", onHide);
    silence();
  };
};
