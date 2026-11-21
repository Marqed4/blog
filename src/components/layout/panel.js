// The tape's expanded controls: previous and next, the track list, the backdrop switch, a Skip
// button for errors, and the credit link back to the song's own page (the services ask for it).
const Panel = ({ list, index, info, backdrop, listOpen, error, on }) => {
  const url = list[index].url;
  const service = /soundcloud/.test(url) ? "SoundCloud" : "YouTube";

  return (
    <div className="ae-tape-panel" role="group" aria-label="Music controls">
      <div className="ae-tape-row">
        <button type="button" className="ae-button ae-button--small" aria-label="Previous track" onClick={on.prev}>Prev</button>
        <button type="button" className="ae-button ae-button--small" aria-label="Next track" onClick={on.next}>Next</button>
        <button type="button" className="ae-button ae-button--small" aria-expanded={listOpen} onClick={on.list}>List</button>
        <button type="button" className="ae-button ae-button--small" aria-pressed={backdrop === "image"} onClick={on.backdrop}>
          Art {backdrop === "image" ? "on" : "off"}
        </button>
        {error && <button type="button" className="ae-button ae-button--small" onClick={on.next}>Skip</button>}
      </div>
      {listOpen && (
        <ol className="ae-tape-list">
          {list.map((t, i) => (
            <li key={t.url}>
              <button type="button" className={i === index ? "is-current" : ""} onClick={() => on.pick(i)}>
                {t.title || `Track ${i + 1}`}
              </button>
            </li>
          ))}
        </ol>
      )}
      <a className="ae-tape-credit" href={url} target="_blank" rel="noopener noreferrer">
        {info.title || "Open the song"} on {service}
      </a>
    </div>
  );
};

export default Panel;
