// The music tape: a cassette fixed at the bottom right that plays the links in tracks.json.
// It sits outside the routes in app.js, so the music keeps going when the page changes.
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { tracks } from "./tracks.js";
import { setNow } from "./nowplaying.js";
import { startScrollSounds, sfxOn, setSfx } from "./sounds.js";
import { createPlayer, providerOf } from "./players.js";
import Shell from "./shell.js";
import Reel from "./reel.js";
import Screw from "./screw.js";
import Deck from "./deck.js";
import Knob from "./knob.js";
import Key from "./key.js";
import Panel from "./panel.js";

// Shown on the cassette label until the first track has played (the surfer emoji is written as code points)
const VIBES = "vibes & scores \u{1F3C4}\u200D\u2642\uFE0F";
const SAVED = "ae-tape";
const read = () => { try { return JSON.parse(localStorage.getItem(SAVED)) || {}; } catch { return {}; } };

const Tape = () => {
  const list = tracks.filter((t) => providerOf(t.url));
  const saved = useRef(read()).current;
  const [index, setIndex] = useState(Math.min(saved.index || 0, Math.max(list.length - 1, 0)));
  const [volume, setVolume] = useState(saved.volume ?? 70);
  // idle (never pressed), loading, playing, paused or error
  const [status, setStatus] = useState("idle");
  const [info, setInfo] = useState({});
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [flash, setFlash] = useState(false);
  const [away, setAway] = useState(false);
  const [touched, setTouched] = useState(0);
  // The video plays over the cassette, except on Home where it can take the stage (slot, below)
  const onHome = useLocation().pathname === "/";
  const navigate = useNavigate();
  // Where the video sits on Home: a box over the intro in the stage, or null for the card by the cassette
  const [slot, setSlot] = useState(null);
  const wantSlot = onHome && (status === "playing" || status === "paused") && list.length > 0 && providerOf(list[index].url) === "youtube";
  const root = useRef(null);
  const toggleBtn = useRef(null);
  const video = useRef(null);
  const sound = useRef(null);
  const player = useRef(null);
  const run = useRef(0);
  const errors = useRef(0);
  const lastType = useRef("mouse");
  // Always holds the newest volume. A track that ends calls an old start(), so it reads this, not its own copy.
  const volumeNow = useRef(volume);
  volumeNow.current = volume;

  // Starts track i: removes the old player, builds the new one, and ignores late callbacks
  // from a track we already left (that is what the run number is for).
  const start = async (i) => {
    if (player.current) player.current.destroy();
    player.current = null;
    const mine = ++run.current;
    const guard = (fn) => (...a) => { if (mine === run.current) fn(...a); };
    setIndex(i);
    setInfo({});
    setStatus("loading");
    const url = list[i].url;
    const on = {
      auto: 1,
      play: guard((m) => { errors.current = 0; setStatus("playing"); setInfo({ title: list[i].title || m.title, art: m.art }); }),
      pause: guard(() => setStatus("paused")),
      buffer: guard(() => setStatus("loading")),
      end: guard(() => start(randomOther(i))),
      error: guard(() => setStatus("error")),
    };
    try {
      const p = await createPlayer(url, providerOf(url) === "youtube" ? video.current : sound.current, on);
      if (mine !== run.current) return p.destroy();
      player.current = p;
      p.setVolume(volumeNow.current);
    } catch (e) {
      if (mine === run.current) setStatus("error");
    }
  };

  // The play key: the first press loads the scripts, after that it pauses and resumes
  const press = () => {
    if (status === "idle" || status === "error") shuffle();
    else if (status === "playing") player.current.pause();
    else if (status === "paused") player.current.play();
  };
  // Left click on the cassette body pauses or resumes, and flashes a badge: two bars for pause, a triangle for play
  const [badge, setBadge] = useState(null);
  const bodyClick = (e) => {
    if (e.target.closest("button, input")) return;
    if (status === "playing" || status === "paused") setBadge({ n: Date.now(), pause: status === "playing" });
    press();
  };
  // Shuffle: picks a random track other than the current one and starts it right away (the click must start
  // the player, or the browser blocks autoplay). Meanwhile the label flips through random titles, slowing down.
  const [spin, setSpin] = useState(null);
  const spinTimer = useRef(0);
  const randomOther = (not) => {
    if (list.length < 2) return 0;
    let i = Math.floor(Math.random() * (list.length - 1));
    return i >= not ? i + 1 : i;
  };
  const shuffle = () => {
    const pick = randomOther(index);
    start(pick);
    clearTimeout(spinTimer.current);
    let step = 0;
    const flip = () => {
      if (step >= 12) { setSpin(null); return; }
      const n = step === 11 ? pick : Math.floor(Math.random() * list.length);
      setSpin(list[n].title || `Track ${n + 1}`);
      spinTimer.current = setTimeout(flip, 60 + step * 18);
      step += 1;
    };
    flip();
  };
  useEffect(() => () => clearTimeout(spinTimer.current), []);
  const go = (step) => start((index + step + list.length) % list.length);

  // A track that fails is skipped after 3 seconds, unless every track has failed in a row
  useEffect(() => {
    if (status !== "error" || ++errors.current >= list.length) return undefined;
    const t = setTimeout(() => start((index + 1) % list.length), 3000);
    return () => clearTimeout(t);
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  // Loading that never ends (blocked embed, offline) becomes an error after 15 seconds
  useEffect(() => {
    if (status !== "loading") return undefined;
    const t = setTimeout(() => setStatus("error"), 15000);
    return () => clearTimeout(t);
  }, [status]);

  // Volume, last track and art switch are remembered between visits
  useEffect(() => {
    if (player.current) player.current.setVolume(volume);
    localStorage.setItem(SAVED, JSON.stringify({ volume, index }));
  }, [volume, index]);

  // A new title keeps the tape solid for 3 seconds so you can read it
  useEffect(() => {
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 3000);
    return () => clearTimeout(t);
  }, [info.title]);

  // Dwelling on the tape for 200ms expands it, so a mouse sliding past does not pop it open
  useEffect(() => {
    if (!hover || expanded) return undefined;
    const t = setTimeout(() => setExpanded(true), 200);
    return () => clearTimeout(t);
  }, [hover, expanded]);

  // Collapses 1.5s after the mouse leaves (4s after a touch), never while it is in use
  const busy = dragging || listOpen;
  useEffect(() => {
    if (!expanded || busy || hover || focus) return undefined;
    const t = setTimeout(() => setExpanded(false), lastType.current === "touch" ? 4000 : 1500);
    return () => clearTimeout(t);
  }, [expanded, busy, hover, focus, touched]);

  // A volume drag counts as in use even if the pointer leaves the tape, until the button is released
  useEffect(() => {
    if (!dragging) return undefined;
    const stop = () => setDragging(false);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);
    return () => { window.removeEventListener("pointerup", stop); window.removeEventListener("pointercancel", stop); };
  }, [dragging]);

  // A tap outside closes the controls. The reels also stop spinning while the tab is hidden.
  useEffect(() => {
    const outside = (e) => {
      if (root.current && !root.current.contains(e.target)) { setExpanded(false); setListOpen(false); }
    };
    const vis = () => setAway(document.hidden);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("visibilitychange", vis);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("visibilitychange", vis); };
  }, []);

  // Tells the page how tall the tape is, so the last line and footer links stay clear of it
  useEffect(() => {
    if (!root.current) return undefined;
    const watch = new ResizeObserver(([e]) => document.body.style.setProperty("--tape-clear", `${e.contentRect.height + 32}px`));
    watch.observe(root.current);
    return () => { watch.disconnect(); document.body.style.removeProperty("--tape-clear"); };
  }, [list.length]);

  // On Home the video takes exactly the checkered canvas box and the tiles slide below it (the body class below).
  // It needs a wide window and the top of the box clear of the navbar, or it stays a card by the cassette.
  useEffect(() => {
    if (!wantSlot) { setSlot(null); return undefined; }
    const place = () => {
      const stage = document.querySelector(".home-content");
      const nav = document.querySelector(".ae-top-nav");
      const r = stage && stage.getBoundingClientRect();
      let next = null;
      if (r && window.innerWidth > 980) {
        // The canvas size comes from the stage CSS (its ::before box), and it is centered in the stage
        const cs = getComputedStyle(stage, "::before");
        let width = parseFloat(cs.width);
        let height = parseFloat(cs.height);
        if (cs.boxSizing === "content-box") { width += 2 * parseFloat(cs.borderLeftWidth); height += 2 * parseFloat(cs.borderTopWidth); }
        const top = Math.round(r.top + (r.height - height) / 2);
        const left = Math.round(r.left + (r.width - width) / 2);
        width = Math.round(width);
        height = Math.round(height);
        const navBottom = nav ? nav.getBoundingClientRect().bottom + 8 : 0;
        if (width >= 200 && height >= 200 && top >= navBottom) next = { top, left, width, height };
        // The stage grows so the tile row (82px tall, 7% from the bottom) sits below the canvas, not on it
        document.body.style.setProperty("--home-stage-min", Math.max(560, Math.ceil((104 + height / 2) / 0.43)) + "px");
      }
      // Only change state when the box really moved, so scrolling does not re-render for nothing
      setSlot((old) => (old && next && old.top === next.top && old.left === next.left && old.width === next.width && old.height === next.height) || (!old && !next) ? old : next);
    };
    // Checked every frame, so the box follows the stage while it grows and while the page scrolls
    let frame = requestAnimationFrame(function loop() { place(); frame = requestAnimationFrame(loop); });
    return () => { cancelAnimationFrame(frame); document.body.style.removeProperty("--home-stage-min"); };
  }, [wantSlot]);

  // Tells the Home page to slide its tiles out of the way while the video is in the stage
  const inSlot = !!slot;
  useEffect(() => {
    document.body.classList.toggle("has-home-video", inSlot);
    return () => document.body.classList.remove("has-home-video");
  }, [inSlot]);

  // Unmounting stops the music and removes the player
  useEffect(() => () => { run.current++; if (player.current) player.current.destroy(); }, []);

  // Space bar pauses or resumes the song, but only when focus is not on a field, button, link or slider
  const spaceAct = useRef(null);
  spaceAct.current = () => {
    if (status !== "playing" && status !== "paused") return false;
    setBadge({ n: Date.now(), pause: status === "playing" });
    press();
    return true;
  };
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== "Space" || e.repeat || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.defaultPrevented) return;
      const el = e.target;
      if (el && el.closest && el.closest('input, textarea, select, button, a, summary, [contenteditable], [role="button"], [role="slider"]')) return;
      if (spaceAct.current()) e.preventDefault();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Scroll sounds, with a switch in the controls panel
  const [fx, setFx] = useState(sfxOn());
  useEffect(() => startScrollSounds(), []);

  // Tell the Home timeline which song is on, and clear it when the tape goes away
  useEffect(() => { setNow({ title: info.title || "", playing: status === "playing" }); }, [info.title, status]);
  useEffect(() => () => setNow({ title: "", playing: false }), []);

  if (!list.length) return null;

  // Which look wins when several apply, strongest first. Only "idle" fades the tape.
  const playing = status === "playing";
  const look = status === "error" ? "error" : status === "loading" ? "loading" : busy ? "busy"
    : hover || focus ? "solid" : !playing ? "paused" : flash ? "changed" : "idle";
  const shown = expanded || status === "error";
  const isVideo = status !== "idle" && providerOf(list[index].url) === "youtube";
  const over = isVideo && !slot;
  const label = spin ? spin : status === "error" ? "Can't play this. Skipping" : status === "loading" ? "Loading"
    : status === "idle" ? VIBES : look === "idle" ? "" : info.title || "";

  // Escape closes the controls and puts focus back on the toggle. Arrows on the toggle change track.
  const keys = (e) => {
    if (e.key === "Escape" && shown) { setExpanded(false); setListOpen(false); toggleBtn.current.focus(); }
    if (e.target === toggleBtn.current && e.key === "ArrowRight") go(1);
    if (e.target === toggleBtn.current && e.key === "ArrowLeft") go(-1);
  };
  const classes = ["ae-site ae-tape", `is-${look}`, isVideo && "is-video", over && "is-over", slot && "is-home-slot", playing && "is-playing", away && "is-away"];

  // Layout, top to bottom: YouTube card, SoundCloud player (hidden), screen reader line, controls
  // panel (only when expanded), then the cassette: the drawing with the real controls over it.
  return (
    <div className={classes.filter(Boolean).join(" ")} ref={root} onKeyDown={keys}
      onPointerDown={(e) => { lastType.current = e.pointerType; setTouched((n) => n + 1); }}>
      <div className="ae-tape-video" ref={video} style={slot || undefined} />
      <div ref={sound} />
      <p className="ae-tape-live" role="status" aria-live="polite">{info.title ? `Now playing: ${info.title}` : ""}</p>
      {over && playing && hover && <span className="ae-tape-hint"><span>move your mouse</span></span>}
      {shown && (
        <Panel list={list} index={index} info={info} fx={fx} listOpen={listOpen} error={status === "error"} playing={playing} volume={volume}
          on={{ prev: () => go(-1), next: () => go(1), pick: (i) => { start(i); setListOpen(false); },
            list: () => setListOpen(!listOpen), shuffle, fx: () => { setSfx(!fx); setFx(!fx); },
            editor: isVideo && !slot ? () => navigate("/", { state: { tab: "composition" } }) : null, play: press, volume: setVolume }} />
      )}
      <div className="ae-tape-frame" onClick={bodyClick}
        onPointerEnter={(e) => { if (e.pointerType !== "touch") setHover(true); }} onPointerLeave={() => setHover(false)}
        onFocus={(e) => { if (e.target.matches(":focus-visible")) setFocus(true); }}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocus(false); }}>
        <svg viewBox="0 0 264 196" aria-hidden="true">
          <Shell><Reel cx={76} /><Reel cx={188} /></Shell>
          <Screw cx={20} cy={20} angle={0} /><Screw cx={244} cy={20} angle={35} />
          <Screw cx={20} cy={116} angle={-20} /><Screw cx={244} cy={116} angle={70} />
          <Deck><Knob volume={volume} /><Key down={playing} /></Deck>
        </svg>
        {badge && (
          <span key={badge.n} className={badge.pause ? "ae-tape-flash is-pause" : "ae-tape-flash"} aria-hidden="true">
            <i /><i />
          </span>
        )}
        <span className="ae-tape-title"><span className={status === "idle" && !spin ? "ae-tape-vibes" : spin ? "ae-tape-spin" : undefined}>{label}</span></span>
        <button type="button" className="ae-tape-toggle" ref={toggleBtn} aria-expanded={shown} aria-label="Music tape controls"
          onClick={() => setExpanded(!shown)} />
        <input type="range" className="ae-tape-knob" min="0" max="100" value={volume} aria-label="Volume"
          onChange={(e) => setVolume(Number(e.target.value))} onPointerDown={() => setDragging(true)} />
        <button type="button" className="ae-tape-play" aria-label={playing ? "Pause" : "Play"} onClick={press} />
      </div>
    </div>
  );
};

export default Tape;
