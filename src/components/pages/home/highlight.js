// Colors Java code for the LeetCode solution panel. Splits the text into keywords, types,
// strings, comments, numbers and macros, and wraps each kind in a span the CSS can color.

// Words that count as Java keywords. Everything else that starts with a capital is a type.
const KEYWORDS = new Set((
  "abstract assert boolean break byte case catch char class const continue default do double else " +
  "enum extends final finally float for goto if implements import instanceof int interface long " +
  "native new package private protected public return short static super switch synchronized this " +
  "throw throws transient try var void volatile while true false null"
).split(" "));

// One regex finds every colorable piece. Order matters: comments and strings come first so a "//"
// inside a string, or a quote inside a comment, is never read as the wrong kind.
const PIECES = new RegExp([
  "(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)",              // 1: comment
  "(\"\"\"[\\s\\S]*?\"\"\"|\"(?:\\\\.|[^\"\\\\\\n])*\"|'(?:\\\\.|[^'\\\\\\n])*')", // 2: string
  "(@[A-Za-z_]\\w*|[A-Za-z_]\\w*!(?=[(\\[{])|^[ \\t]*#[ \\t]*[a-z]+)", // 3: macro: @Annotation, name!(...) or #include
  "(\\b(?:0[xX][0-9a-fA-F]+|\\d[\\d_]*(?:\\.\\d+)?)[LlFfDd]?\\b)", // 4: number
  "([A-Za-z_$][\\w$]*)",                               // 5: word
].join("|"), "gm");

const KINDS = [null, "tok-com", "tok-str", "tok-mac", "tok-num"];

// Returns React children. Text between matches stays plain, so the text on screen
// is always exactly the source text, only the colors change.
const Highlight = ({ code }) => {
  const out = [];
  let last = 0;
  for (const m of code.matchAll(PIECES)) {
    let kind = KINDS[m.findIndex((g, i) => i > 0 && g !== undefined)];
    if (m[5]) {
      kind = KEYWORDS.has(m[0]) ? "tok-kw" : /^[A-Z]/.test(m[0]) ? "tok-type" : null;
    }
    if (!kind) continue;
    if (m.index > last) out.push(code.slice(last, m.index));
    out.push(<span key={m.index} className={kind}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
};

export default Highlight;
