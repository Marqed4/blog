// One decorative screw. It does nothing, so it is hidden from screen readers and the mouse.
// The slot angle is passed in so the four screws do not all look the same.
const Screw = ({ cx, cy, angle }) => (
  <g aria-hidden="true" className="ae-tape-deco">
    <defs>
      <radialGradient id={`ae-g-screw-${cx}-${cy}`} cx=".35" cy=".3" r=".8">
        <stop offset="0" stopColor="#d8d8e0" />
        <stop offset="1" stopColor="#4a4a55" />
      </radialGradient>
    </defs>
    <circle cx={cx} cy={cy} r="5" fill={`url(#ae-g-screw-${cx}-${cy})`} />
    <line x1={cx - 3} y1={cy} x2={cx + 3} y2={cy} stroke="#222" strokeWidth="1.4" transform={`rotate(${angle} ${cx} ${cy})`} />
  </g>
);

export default Screw;
