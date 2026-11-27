// Interface sounds, switched on and off together by the Sound button in the navbar (the music has its own controls).
// Scroll sound: a mechanical ratchet. Each wheel step plays a tiny click cut from a real recording, a faster wheel clicks
// faster, and when the wheel stops the clicks slow down and fade out like a ratchet coasting to a halt.
// Click sound: a keyboard switch. A button or link plays the press when the pointer goes down and the release when it lets go.
// The clips are cut from the recordings in the Desktop sounds folder (src/resources/sound).
// Browsers keep audio silent until the visitor has clicked or pressed a key once, so before that nothing plays.
import downUrl from "../../resources/sound/click-down.wav";
import upUrl from "../../resources/sound/click-up.wav";
import tick1Url from "../../resources/sound/tick-1.wav";
import tick2Url from "../../resources/sound/tick-2.wav";

const KEY = "ae-sfx";
const CEILING = 0.2; // hard volume ceiling for every sound
const QUIET_MS = 140; // no wheel turn for this long counts as stopped
const CLICKABLE = "button, a, [role=button]";

// On by default, and the visitor's choice is saved
let on = true;
try { on = localStorage.getItem(KEY) !== "off"; } catch { /* storage blocked, keep the default */ }

export const sfxOn = () => on;

// The clips are decoded once, up front. An offline context decodes without needing a click first.
const clips = {};
const load = () => {
  const Offline = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!Offline || clips.loaded) return;
  clips.loaded = true;
  const decoder = new Offline(1, 1, 44100);
  Object.entries({ down: downUrl, up: upUrl, tick1: tick1Url, tick2: tick2Url }).forEach(([name, url]) => {
    fetch(url).then((r) => r.arrayBuffer()).then((b) => decoder.decodeAudioData(b)).then((buf) => { clips[name] = buf; }).catch(() => {});
  });
};

// One shared audio context for playing, made on first use
let ctx = null;
const audio = () => {
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
};

// Plays a clip at a time on the audio clock. rate shifts its pitch a little so repeats do not sound identical.
const play = (name, gain, rate = 1, when = 0) => {
  const buf = clips[name];
  if (!buf || !ctx) return;
  const src = ctx.createBufferSource();
  const vol = ctx.createGain();
  src.buffer = buf;
  src.playbackRate.value = rate;
  vol.gain.value = Math.min(gain, CEILING);
  src.connect(vol).connect(ctx.destination);
  src.start(Math.max(when, ctx.currentTime));
};

const press = () => { try { audio(); play("down", CEILING); } catch { /* no audio support, stay silent */ } };
const release = (delay = 0) => { try { audio(); play("up", CEILING * 0.6, 1, ctx.currentTime + delay); } catch { /* stay silent */ } };

// Ratchet state: "idle", "running" (wheel turning) or "winding" (clicks slowing down)
let state = "idle";
let speed = 0; // 0 for a slow notch, 1 for a hard spin
let nextAt = 0; // audio clock time of the next click
let wind = null; // volume, pitch and gap of the click being played while winding down
let flip = 0;
let timer = 0;
let quietTimer = 0;

// Seconds between clicks while the wheel turns: 85ms for a slow notch, 35ms for a hard spin
const gap = () => 0.085 - 0.05 * speed;
const level = () => CEILING * (0.45 + 0.55 * speed);

// Stops everything right now
const silence = () => {
  clearTimeout(timer);
  clearTimeout(quietTimer);
  state = "idle";
  wind = null;
};

export const setSfx = (value) => {
  on = value;
  try { localStorage.setItem(KEY, value ? "on" : "off"); } catch { /* storage blocked */ }
  if (!value) silence();
};

// Schedules clicks a little ahead of the audio clock, so a busy page cannot make them stutter
const pump = () => {
  while (nextAt < ctx.currentTime + 0.1) {
    let gain = level();
    let rate = 1;
    let step = gap();
    if (state === "winding") {
      wind.gain *= 0.62;
      wind.rate *= 0.985;
      wind.gap *= 1.3;
      if (wind.gain < 0.012) { silence(); return; }
      ({ gain, rate, gap: step } = wind);
    }
    play(flip++ % 2 ? "tick1" : "tick2", gain, rate * (0.96 + Math.random() * 0.08), nextAt);
    nextAt += step;
  }
  timer = setTimeout(pump, 25);
};

// First click of a burst, or picking the ratchet back up while it is still winding down
const spinUp = () => {
  audio();
  clearTimeout(timer);
  nextAt = state === "idle" ? ctx.currentTime + 0.005 : Math.max(nextAt, ctx.currentTime + 0.005);
  state = "running";
  pump();
};

// Wheel stopped: the clicks keep going but slower and quieter, then end
const coast = () => {
  if (state !== "running") return;
  state = "winding";
  wind = { gain: level(), rate: 1, gap: gap() };
};

// Starts listening for scrolling and clicks. Returns the function that stops it.
export const startScrollSounds = () => {
  load();
  let lastWheel = 0;
  let held = false;

  // Only wheel turns count, so jumps made by the site (like going to the top on a new page) stay silent.
  // The quiet timer follows the wheel, not the page: the browser's smooth scrolling and trackpad
  // momentum keep firing scroll events after the hand stops, and those must not stretch the sound.
  const armQuiet = () => {
    clearTimeout(quietTimer);
    quietTimer = setTimeout(coast, QUIET_MS);
  };
  const onWheel = (e) => {
    if (Math.abs(e.deltaY) < 4) return; // trackpad momentum tail, not a real turn
    const now = Date.now();
    speed = Math.min(1, Math.abs(e.deltaY) / 250 + (now - lastWheel < 60 ? 0.35 : 0));
    lastWheel = now;
    if (state === "running") armQuiet();
  };
  // The ratchet starts only when a wheel turn actually moved the page (not at the top or bottom)
  const onScroll = () => {
    if (!on || state === "running" || Date.now() - lastWheel > 100) return;
    try { spinUp(); armQuiet(); } catch { silence(); /* no audio support, stay silent */ }
  };
  // A hidden tab should be quiet
  const onHide = () => { if (document.hidden) silence(); };
  // Buttons and links press when the pointer goes down and release when it lets go.
  // A click with no pointer (the keyboard) plays both.
  const onDown = (e) => { if (on && e.target.closest?.(CLICKABLE)) { held = true; press(); } };
  const onUp = () => { if (held) { held = false; if (on) release(); } };
  const onClick = (e) => { if (on && e.detail === 0 && e.target.closest?.(CLICKABLE)) { press(); release(0.09); } };

  document.addEventListener("pointerdown", onDown, true);
  document.addEventListener("pointerup", onUp, true);
  document.addEventListener("click", onClick, true);
  window.addEventListener("wheel", onWheel, { passive: true });
  window.addEventListener("scroll", onScroll, { capture: true, passive: true });
  document.addEventListener("visibilitychange", onHide);
  return () => {
    document.removeEventListener("pointerdown", onDown, true);
    document.removeEventListener("pointerup", onUp, true);
    document.removeEventListener("click", onClick, true);
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("scroll", onScroll, true);
    document.removeEventListener("visibilitychange", onHide);
    silence();
  };
};
