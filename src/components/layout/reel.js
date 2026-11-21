// One reel for the tape window: a ring, a hub and a cross. The CSS spins it while music plays.
const Reel = ({ cx }) => (
  <g className="ae-tape-reel">
    <circle className="ae-tape-ring" cx={cx} cy="77" r="15" fill="#15151a" strokeWidth="2" strokeDasharray="4 3" />
    <circle cx={cx} cy="77" r="5" fill="#2a2a32" />
    <g stroke="#ccc" strokeWidth="2">
      <line x1={cx} y1="72" x2={cx} y2="82" />
      <line x1={cx - 5} y1="77" x2={cx + 5} y2="77" />
    </g>
  </g>
);

export default Reel;
