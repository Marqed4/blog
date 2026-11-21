// The volume knob art: a round knurled knob with a notch and a scale of tick marks.
// It only draws. The real control is a range input laid over it (see tape.js), and this
// just turns to match the volume it is given (0 to 100 turns it -135 to +135 degrees).
const RIDGES = Array.from({ length: 28 }, (_, i) => i * (360 / 28));
const TICKS = Array.from({ length: 11 }, (_, i) => -135 + i * 27);

const Knob = ({ volume }) => (
  <g transform="translate(42 160)">
    <defs>
      <radialGradient id="ae-g-knob" cx=".35" cy=".28" r=".9">
        <stop offset="0" stopColor="#8a8a98" />
        <stop offset=".6" stopColor="#34343e" />
        <stop offset="1" stopColor="#17171d" />
      </radialGradient>
    </defs>
    <circle r="21" cy="3" fill="#000" opacity=".45" />
    <g transform={`rotate(${-135 + volume * 2.7})`}>
      <circle r="19" fill="url(#ae-g-knob)" stroke="#0a0a0d" />
      <g stroke="#000" strokeOpacity=".55" strokeWidth="1.2">
        {RIDGES.map((a) => <line key={a} y1="-19" y2="-15" transform={`rotate(${a})`} />)}
      </g>
      <circle r="12" fill="url(#ae-g-knob)" stroke="#fff" strokeOpacity=".14" />
      <rect className="ae-tape-notch" x="-1.4" y="-12" width="2.8" height="8" rx="1.4" />
    </g>
    <g aria-hidden="true" className="ae-tape-deco" stroke="#aaa" strokeOpacity=".5">
      {TICKS.map((a, i) => <line key={a} y1="-27" y2={i % 5 === 0 ? -23 : -25} transform={`rotate(${a})`} />)}
    </g>
  </g>
);

export default Knob;
