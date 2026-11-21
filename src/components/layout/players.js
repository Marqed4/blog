// Loads the YouTube and SoundCloud player scripts the first time a track is played, and wraps
// both in the same small set of calls (play, pause, volume, destroy) so tape.js never cares which.

// One script tag per service, added only once, and only when the first Play is pressed
const scripts = {};
const loadScript = (src) => {
  if (!scripts[src]) {
    scripts[src] = new Promise((resolve, reject) => {
      const tag = document.createElement("script");
      tag.src = src;
      tag.async = true;
      tag.onload = resolve;
      tag.onerror = () => reject(new Error("script blocked"));
      document.head.appendChild(tag);
    });
  }
  return scripts[src];
};

// YouTube calls this global function when its script is ready, so wait for it
const loadYouTube = () => new Promise((resolve, reject) => {
  if (window.YT && window.YT.Player) return resolve(window.YT);
  window.onYouTubeIframeAPIReady = () => resolve(window.YT);
  return loadScript("https://www.youtube.com/iframe_api").catch(reject);
});

// "youtube" or "soundcloud", guessed from the link host. Anything else is null.
export const providerOf = (url) => {
  if (/^https?:\/\/([\w-]+\.)?(youtube\.com|youtu\.be)\//.test(url)) return "youtube";
  return /^https?:\/\/([\w-]+\.)?soundcloud\.com\//.test(url) ? "soundcloud" : null;
};

export const youtubeId = (url) => (url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/) || [])[1];

// YouTube: its player has to stay visible, at least 200px tall, with nothing on top (their rules)
const youtube = async (url, host, on) => {
  const YT = await loadYouTube();
  const mount = host.appendChild(document.createElement("div"));
  const id = youtubeId(url);
  let ready;
  const whenReady = new Promise((resolve) => { ready = resolve; });
  const player = new YT.Player(mount, {
    width: "100%", height: "100%", videoId: id,
    playerVars: { autoplay: on.auto ? 1 : 0, playsinline: 1, rel: 0 },
    events: {
      onReady: ready,
      onAutoplayBlocked: () => on.pause(),
      onError: () => on.error(),
      onStateChange: (e) => {
        if (e.data === 1) {
          on.play({ title: player.getVideoData().title, art: `https://i.ytimg.com/vi/${id}/hqdefault.jpg` });
        } else if (e.data === 2) on.pause();
        else if (e.data === 0) on.end();
        else if (e.data === 3) on.buffer();
      },
    },
  });
  // The player has no destroy before it is ready, so then we just empty the card
  return {
    play: () => whenReady.then(() => player.playVideo()),
    pause: () => whenReady.then(() => player.pauseVideo()),
    setVolume: (v) => whenReady.then(() => player.setVolume(v)),
    destroy: () => (player.destroy ? player.destroy() : host.replaceChildren()),
  };
};

// SoundCloud: the widget is an iframe we keep out of sight. The tape shows the credit link instead.
const soundcloud = async (url, host, on) => {
  await loadScript("https://w.soundcloud.com/player/api.js");
  const frame = host.appendChild(document.createElement("iframe"));
  frame.className = "ae-tape-sc";
  frame.allow = "autoplay";
  frame.title = "SoundCloud player";
  frame.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=${on.auto}&show_comments=false&hide_related=true`;
  const widget = window.SC.Widget(frame);
  const E = window.SC.Widget.Events;
  const whenReady = new Promise((resolve) => widget.bind(E.READY, resolve));
  widget.bind(E.PLAY, () => widget.getCurrentSound((s) => on.play({
    title: s && s.title,
    art: s && s.artwork_url && s.artwork_url.replace("-large", "-t500x500"),
  })));
  widget.bind(E.PAUSE, () => on.pause());
  widget.bind(E.FINISH, () => on.end());
  widget.bind(E.ERROR, () => on.error());
  return {
    play: () => whenReady.then(() => widget.play()),
    pause: () => whenReady.then(() => widget.pause()),
    setVolume: (v) => whenReady.then(() => widget.setVolume(v)),
    destroy: () => frame.remove(),
  };
};

// Makes the right player for a link. "on" holds the callbacks: play, pause, buffer, end, error.
export const createPlayer = (url, host, on) =>
  (providerOf(url) === "youtube" ? youtube : soundcloud)(url, host, on);
