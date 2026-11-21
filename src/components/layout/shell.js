// The cassette shell drawn as SVG: body, label strip, tape window and the glass glint.
// Pure drawing. Whatever is passed as children (the reels) sits inside the window, under the glint.
// The ellipse at the top is a soft shadow on the ground under the tape.
const Shell = ({ children }) => (
  <>
    <defs>
      <linearGradient id="ae-g-body" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#5b5b68" />
        <stop offset=".55" stopColor="#2c2c35" />
        <stop offset="1" stopColor="#15151b" />
      </linearGradient>
      <linearGradient id="ae-g-bevel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".35" />
        <stop offset=".12" stopColor="#fff" stopOpacity="0" />
        <stop offset=".85" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity=".55" />
      </linearGradient>
      <linearGradient id="ae-g-window" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#050507" />
        <stop offset="1" stopColor="#26262e" />
      </linearGradient>
      <linearGradient id="ae-g-glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity=".22" />
        <stop offset=".4" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
    </defs>
    <ellipse cx="132" cy="190" rx="112" ry="6" fill="#000" opacity=".35" />
    <rect className="ae-tape-rim" x="6" y="6" width="252" height="124" rx="12" fill="url(#ae-g-body)" />
    <rect x="6" y="6" width="252" height="124" rx="12" fill="url(#ae-g-bevel)" />
    <rect x="8.5" y="8.5" width="247" height="119" rx="10" fill="none" stroke="#fff" strokeOpacity=".12" />
    <rect x="30" y="16" width="204" height="30" rx="4" fill="#efe4c8" />
    <rect x="46" y="54" width="172" height="46" rx="8" fill="url(#ae-g-window)" stroke="#000" strokeOpacity=".7" />
    <line className="ae-tape-line" x1="92" y1="77" x2="172" y2="77" strokeWidth="2" />
    {children}
    <rect x="46" y="54" width="172" height="46" rx="8" fill="url(#ae-g-glass)" />
  </>
);

export default Shell;
