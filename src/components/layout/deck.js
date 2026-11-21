// The deck strip under the cassette. It holds the knob and the key (passed as children)
// and draws the groove with its small light, which is decoration only.
const Deck = ({ children }) => (
  <>
    <defs>
      <linearGradient id="ae-g-deck" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3a3a45" />
        <stop offset="1" stopColor="#1b1b22" />
      </linearGradient>
    </defs>
    <rect x="6" y="134" width="252" height="52" rx="10" fill="url(#ae-g-deck)" stroke="#0a0a0d" />
    <rect x="6" y="134" width="252" height="52" rx="10" fill="url(#ae-g-bevel)" opacity=".7" />
    <g aria-hidden="true" className="ae-tape-deco">
      <rect x="92" y="152" width="70" height="16" rx="8" fill="#0b0b0f" stroke="#fff" strokeOpacity=".1" />
      <rect className="ae-tape-light" x="98" y="158" width="14" height="4" rx="2" />
    </g>
    {children}
  </>
);

export default Deck;
