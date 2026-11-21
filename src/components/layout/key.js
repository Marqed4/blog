// The play key art: a pink key in a dark well with a play triangle. It drops 2.5px when
// "down" is true, which tape.js sets while music plays. The real control is the button over it.
const Key = ({ down }) => (
  <>
    <defs>
      <linearGradient id="ae-g-key" x1="0" y1="0" x2="0" y2="1">
        <stop className="ae-tape-stop-a" offset="0" />
        <stop className="ae-tape-stop-b" offset=".5" />
        <stop className="ae-tape-stop-c" offset="1" />
      </linearGradient>
    </defs>
    <rect x="176" y="145" width="64" height="30" rx="6" fill="#06060a" />
    <g className={down ? "ae-tape-key is-down" : "ae-tape-key"}>
      <rect x="176" y="142" width="64" height="28" rx="6" fill="#0a0a0d" />
      <rect x="177" y="141" width="62" height="26" rx="5" fill="url(#ae-g-key)" />
      <rect x="177" y="141" width="62" height="26" rx="5" fill="url(#ae-g-bevel)" />
      <path d="M200 147 L200 161 L214 154 Z" fill="#fff" fillOpacity=".92" />
    </g>
  </>
);

export default Key;
