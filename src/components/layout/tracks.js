// The music list for the tape lives in tracks.json. Add one { "url": ..., "title": ... } per song.
// url is a YouTube or SoundCloud link, title and tag (like "indie") are optional.
// Single YouTube videos only, not playlists. JSON has no comments, so the notes are here.
//
// Shuffling: the list is reordered once each time the site loads, so every visit gets a new order.
// It walks the list from the end and swaps each track with a random earlier one (Fisher-Yates),
// using Math.random. The copy is shuffled, tracks.json itself is never changed.
import list from "./tracks.json";

const shuffled = [...list];
for (let i = shuffled.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
}

export const tracks = shuffled;
