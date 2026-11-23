// The tape's expanded controls: previous, next and shuffle, the track list, a Skip
// button for errors, and the credit link back to the song's own page (the services ask for it).
const Panel = ({ list, index, info, fx, listOpen, error, playing, volume, on }) => {
  const url = list[index].url;
  const service = /soundcloud/.test(url) ? "SoundCloud" : "YouTube";

  return (
    <div className="ae-tape-panel" role="group" aria-label="Music controls">
      <div className="ae-tape-row">
        <button type="button" className="ae-button ae-button--small" onClick={on.play}>{playing ? "Pause" : "Play"}</button>
        <button type="button" className="ae-button ae-button--small" aria-label="Previous track" onClick={on.prev}>Prev</button>
        <button type="button" className="ae-button ae-button--small" aria-label="Shuffle, play a random track" onClick={on.shuffle}>Shuffle</button>
        <button type="button" className="ae-button ae-button--small" aria-pressed={fx} onClick={on.fx}>Scroll sound {fx ? "on" : "off"}</button>
        <button type="button" className="ae-button ae-button--small" aria-label="Next track" onClick={on.next}>Next</button>
        <button type="button" className="ae-button ae-button--small" aria-expanded={listOpen} onClick={on.list}>List</button>
        {on.editor && <button type="button" className="ae-button ae-button--small" onClick={on.editor}>View in editor</button>}
        {error && <button type="button" className="ae-button ae-button--small" onClick={on.next}>Skip</button>}
      </div>
      <input type="range" className="ae-tape-vol" min="0" max="100" value={volume} aria-label="Volume"
        onChange={(e) => on.volume(Number(e.target.value))} />
      {listOpen && (
        <ol className="ae-tape-list">
          {list.map((t, i) => (
            <li key={`${t.url}-${i}`}>
              <button type="button" className={i === index ? "is-current" : ""} aria-current={i === index ? "true" : undefined} onClick={() => on.pick(i)}>
                {t.title || `Track ${i + 1}`}
                {t.tag && <span className="ae-tape-tag">{t.tag}</span>}
              </button>
            </li>
          ))}
        </ol>
      )}
      <a className="ae-tape-credit" href={url} target="_blank" rel="noopener noreferrer">
        {info.title || "Open the song"} on {service}
      </a>
      {list[index].tag && <span className="ae-tape-tag">{list[index].tag}</span>}
    </div>
  );
};

export default Panel;
