// Tiny shared store: the tape says which song is playing, and the Home timeline listens.
// It is plain functions, so no extra library is needed.
let now = { title: "", playing: false };
const listeners = new Set();

export const setNow = (next) => {
  now = next;
  listeners.forEach((fn) => fn(now));
};

// Calls fn with the current song at once, then on every change. Returns the function that stops listening.
export const subscribeNow = (fn) => {
  listeners.add(fn);
  fn(now);
  return () => listeners.delete(fn);
};
