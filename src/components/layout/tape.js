// The music tape: a cassette fixed at the bottom right that plays the links in tracks.js.
// It sits outside the routes in app.js, so the music keeps going when the page changes.
import { useEffect, useRef, useState } from "react";
import { tracks } from "./tracks.js";
import { createPlayer, providerOf } from "./players.js";
import Shell from "./shell.js";
import Reel from "./reel.js";
import Screw from "./screw.js";
import Deck from "./deck.js";
import Knob from "./knob.js";
import Key from "./key.js";
import Panel from "./panel.js";

const SAVED = "ae-tape";
const read = () => { try { return JSON.parse(localStorage.getItem(SAVED)) || {}; } catch { return {}; } };

const Tape = () => {
  const list = tracks.filter((t) => providerOf(t.url));
  const saved = useRef(read()).current;
  const [index, setIndex] = useState(Math.min(saved.index || 0, Math.max(list.length - 1, 0)));
  const [volume, setVolume] = useState(saved.volume ?? 70);
  const [backdrop, setBackdrop] = useState(saved.backdrop || "image");
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
      end: guard(() => start((i + 1) % list.length)),
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
    if (status === "idle" || status === "error") start(index);
    else if (status === "playing") player.current.pause();
    else if (status === "paused") player.current.play();
  };
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
    localStorage.setItem(SAVED, JSON.stringify({ volume, index, backdrop }));
  }, [volume, index, backdrop]);

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

  // Unmounting stops the music and removes the player
  useEffect(() => () => { run.current++; if (player.current) player.current.destroy(); }, []);

  if (!list.length) return null;

  // Which look wins when several apply, strongest first. Only "idle" fades the tape.
  const playing = status === "playing";
  const look = status === "error" ? "error" : status === "loading" ? "loading" : busy ? "busy"
    : hover || focus ? "solid" : !playing ? "paused" : flash ? "changed" : "idle";
  const shown = expanded || status === "error";
  const isVideo = status !== "idle" && providerOf(list[index].url) === "youtube";
  const label = status === "error" ? "Can't play this. Skipping" : status === "loading" ? "Loading"
    : status === "idle" ? "Press play" : look === "idle" ? "" : info.title || "";

  // Escape closes the controls and puts focus back on the toggle. Arrows on the toggle change track.
  const keys = (e) => {
    if (e.key === "Escape" && shown) { setExpanded(false); setListOpen(false); toggleBtn.current.focus(); }
    if (e.target === toggleBtn.current && e.key === "ArrowRight") go(1);
    if (e.target === toggleBtn.current && e.key === "ArrowLeft") go(-1);
  };
  const classes = ["ae-site ae-tape", `is-${look}`, isVideo && "is-video", playing && "is-playing", away && "is-away"];

  // Layout, top to bottom: YouTube card, SoundCloud player (hidden), screen reader line, controls
  // panel (only when expanded), then the cassette: the drawing with the real controls over it.
  return (
    <div className={classes.filter(Boolean).join(" ")} ref={root} onKeyDown={keys}
      onPointerDown={(e) => { lastType.current = e.pointerType; setTouched((n) => n + 1); }}>
      <div className="ae-tape-video" ref={video} />
      <div ref={sound} />
      <p className="ae-tape-live" role="status" aria-live="polite">{info.title ? `Now playing: ${info.title}` : ""}</p>
      {shown && (
        <Panel list={list} index={index} info={info} backdrop={backdrop} listOpen={listOpen} error={status === "error"}
          on={{ prev: () => go(-1), next: () => go(1), pick: (i) => { start(i); setListOpen(false); },
            list: () => setListOpen(!listOpen), backdrop: () => setBackdrop(backdrop === "image" ? "none" : "image") }} />
      )}
      <div className="ae-tape-frame"
        onPointerEnter={(e) => { if (e.pointerType !== "touch") setHover(true); }} onPointerLeave={() => setHover(false)}
        onFocus={(e) => { if (e.target.matches(":focus-visible")) setFocus(true); }}
        onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setFocus(false); }}>
        {backdrop === "image" && info.art && <img className="ae-tape-art" src={info.art} alt="" />}
        <svg viewBox="0 0 264 196" aria-hidden="true">
          <Shell><Reel cx={76} /><Reel cx={188} /></Shell>
          <Screw cx={20} cy={20} angle={0} /><Screw cx={244} cy={20} angle={35} />
          <Screw cx={20} cy={116} angle={-20} /><Screw cx={244} cy={116} angle={70} />
          <Deck><Knob volume={volume} /><Key down={playing} /></Deck>
        </svg>
        <span className="ae-tape-title"><span>{label}</span></span>
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
