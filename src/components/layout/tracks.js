// The music list for the tape lives in tracks.json. Add one { "url": ..., "title": ... } per song.
// url is a YouTube or SoundCloud link, title and tag (like "indie") are optional.
// Single YouTube videos only, not playlists. JSON has no comments, so the notes are here.
import list from "./tracks.json";

export const tracks = list;
