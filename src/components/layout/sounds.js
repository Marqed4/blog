// Interface sounds, switched on and off together by the Sound button in the navbar (the music has its own controls).
// Scroll sound: a soft whirr that is made live while the mouse wheel scrolls the page, one continuous sound for as
// long as the scrolling lasts. When the wheel stops it fades out while its pitch drops, like a wheel spinning down.
// It is looped noise run through a filter (no sound file, no repeating clip), so nothing can be heard starting over.
// Click sound: a short tick when a button or link is clicked.
// Browsers keep audio silent until the visitor has clicked or pressed a key once, so before that nothing plays.

const KEY = "ae-sfx";
const CEILING = 0.2; // hard volume ceiling for every sound
const QUIET_MS = 140; // no wheel turn for this long counts as stopped
const SPIN_DOWN = 0.18; // seconds it takes the pitch and volume to fall by about two thirds after the wheel stops
const PITCH_IDLE = 450; // whirr pitch (Hz) as it starts and as it dies away
const PITCH_MAX = 1800; // whirr pitch (Hz) at the fastest wheel turn

// On by default, and the visitor's choice is saved
let on = true;
try { on = localStorage.getItem(KEY) !== "off"; } catch { /* storage blocked, keep the default */ }

export const sfxOn = () => on;

// One shared audio context for the whole site
let ctx = null;
const audio = () => {
  ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
};

// A short soft tick for button clicks
const tick = () => {
  try {
    const c = audio();
    const t = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(900, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.04);
    gain.gain.setValueAtTime(CEILING / 2, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    osc.connect(gain).connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.06);
  } catch { /* no audio support, stay silent */ }
};

// Two seconds of white noise, made once. Looping it is not audible because noise has no pattern to notice.
let noise = null;
const noiseBuffer = (c) => {
  if (noise) return noise;
  noise = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return noise;
};

// The one whirr voice: noise -> band-pass filter (its pitch) -> gain (its volume). null when silent.
let voice = null;
let state = "idle"; // "idle", "running" (wheel scrolling) or "winding" (spinning down)
let quietTimer = 0;
let killTimer = 0;

// Stops the voice right now
const silence = () => {
  clearTimeout(quietTimer);
  clearTimeout(killTimer);
  state = "idle";
  if (!voice) return;
  try { voice.src.stop(); voice.src.disconnect(); voice.gain.disconnect(); } catch { /* already stopped */ }
  voice = null;
};

export const setSfx = (value) => {
  on = value;
  try { localStorage.setItem(KEY, value ? "on" : "off"); } catch { /* storage blocked */ }
  if (!value) silence();
};

// Spins up: fades in and rises in pitch. If the voice is still spinning down, it picks back up instead of restarting.
const spinUp = (speed) => {
  const c = audio();
  const t = c.currentTime;
  clearTimeout(killTimer);
  if (!voice) {
    const src = c.createBufferSource();
    const filter = c.createBiquadFilter();
    const gain = c.createGain();
    src.buffer = noiseBuffer(c);
    src.loop = true;
    filter.type = "bandpass";
    filter.Q.value = 1.4;
    filter.frequency.value = PITCH_IDLE;
    gain.gain.value = 0;
    src.connect(filter).connect(gain).connect(c.destination);
    src.start();
    voice = { src, filter, gain };
  }
  voice.gain.gain.cancelScheduledValues(t);
  voice.filter.frequency.cancelScheduledValues(t);
  voice.gain.gain.setTargetAtTime(CEILING, t, 0.03);
  voice.filter.frequency.setTargetAtTime(speed, t, 0.06);
  state = "running";
};

// Follows the wheel speed while scrolling, so a faster turn sounds higher
const follow = (speed) => {
  if (!voice) return;
  voice.filter.frequency.setTargetAtTime(speed, ctx.currentTime, 0.08);
};

// Wheel stopped: volume and pitch both fall away, then the voice is removed
const coast = () => {
  if (state !== "running" || !voice) return;
  state = "winding";
  const t = ctx.currentTime;
  voice.gain.gain.cancelScheduledValues(t);
  voice.filter.frequency.cancelScheduledValues(t);
  voice.gain.gain.setTargetAtTime(0, t, SPIN_DOWN);
  voice.filter.frequency.setTargetAtTime(PITCH_IDLE / 2, t, SPIN_DOWN * 1.5);
  killTimer = setTimeout(silence, SPIN_DOWN * 1000 * 6);
};

// Wheel speed to pitch: a gentle notch is low, a hard flick is high
const pitchOf = (e) => PITCH_IDLE + Math.min(Math.abs(e.deltaY), 300) / 300 * (PITCH_MAX - PITCH_IDLE);

// Starts listening for scrolling. Returns the function that stops it.
export const startScrollSounds = () => {
  let lastWheel = 0;
  let pitch = PITCH_IDLE;

  // Only wheel turns count, so jumps made by the site (like going to the top on a new page) stay silent.
  // The quiet timer follows the wheel, not the page: the browser's smooth scrolling and trackpad
  // momentum keep firing scroll events after the hand stops, and those must not stretch the sound.
  const armQuiet = () => {
    clearTimeout(quietTimer);
    quietTimer = setTimeout(coast, QUIET_MS);
  };
  const onWheel = (e) => {
    if (Math.abs(e.deltaY) < 4) return; // trackpad momentum tail, not a real turn
    lastWheel = Date.now();
    pitch = pitchOf(e);
    if (state === "running") { follow(pitch); armQuiet(); }
  };
  // The sound starts only when a wheel turn actually moved the page (not at the top or bottom).
  // Leftover scroll events from smooth scrolling are ignored, because they come after the wheel stopped.
  const onScroll = () => {
    if (!on || state === "running" || Date.now() - lastWheel > 100) return;
    try { spinUp(pitch); armQuiet(); } catch { state = "idle"; /* no audio support, stay silent */ }
  };
  // A hidden tab should be quiet
  const onHide = () => { if (document.hidden) silence(); };
  // Buttons and links tick when clicked, unless the tick is switched off
  const onClick = (e) => { if (on && e.target.closest?.("button, a, [role=button]")) tick(); };

  document.addEventListener("click", onClick, true);
  window.addEventListener("wheel", onWheel, { passive: true });
  window.addEventListener("scroll", onScroll, { capture: true, passive: true });
  document.addEventListener("visibilitychange", onHide);
  return () => {
    document.removeEventListener("click", onClick, true);
    window.removeEventListener("wheel", onWheel);
    window.removeEventListener("scroll", onScroll, true);
    document.removeEventListener("visibilitychange", onHide);
    silence();
  };
};
