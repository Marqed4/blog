// Colors code for the LeetCode solution panel. Splits the text into keywords, types, strings,
// comments, numbers and macros, and wraps each kind in a span the CSS can color.
// It knows Java, Python, Rust and C#. Any other language name is colored like Java.

const words = (text) => new Set(text.split(" "));

// Words that count as keywords. A capitalized word that is not in the list is a type.
const KEYWORDS = {
  Java: words(
    "abstract assert boolean break byte case catch char class const continue default do double else " +
    "enum extends final finally float for goto if implements import instanceof int interface long " +
    "native new package private protected public return short static super switch synchronized this " +
    "throw throws transient try var void volatile while true false null"
  ),
  "C#": words(
    "abstract as base bool break byte case catch char checked class const continue decimal default " +
    "delegate do double else enum event explicit extern false finally fixed float for foreach goto if " +
    "implicit in int interface internal is lock long namespace new null object operator out override " +
    "params private protected public readonly ref return sbyte sealed short sizeof static string " +
    "struct switch this throw true try typeof uint ulong unchecked unsafe ushort using var virtual " +
    "void volatile while"
  ),
  Python: words(
    "and as assert async await break class continue def del elif else except finally for from global " +
    "if import in is lambda nonlocal not or pass raise return try while with yield True False None self"
  ),
  Rust: words(
    "as async await break const continue crate dyn else enum extern false fn for if impl in let loop " +
    "match mod move mut pub ref return self Self static struct super trait true type unsafe use where while"
  ),
};

// Rust number types read like types, so they get the type color too
const RUST_TYPES = words("i8 i16 i32 i64 i128 isize u8 u16 u32 u64 u128 usize f32 f64 bool char str");

// Pieces of text that get a color. Order matters: comments and strings come first, so a "//"
// inside a string, or a quote inside a comment, is never read as the wrong kind.
// Python docstrings count as comments, since they are the notes about the solution.
const PARTS = {
  Python: {
    comment: "#[^\\n]*|'''[\\s\\S]*?'''|\"\"\"[\\s\\S]*?\"\"\"",
    string: "\"(?:\\\\.|[^\"\\\\\\n])*\"|'(?:\\\\.|[^'\\\\\\n])*'",
    macro: "@[A-Za-z_]\\w*",
  },
  Rust: {
    comment: "\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/",
    string: "\"(?:\\\\.|[^\"\\\\])*\"|'(?:\\\\.|[^'\\\\\\n])'",
    macro: "#!?\\[[^\\]\\n]*\\]|[A-Za-z_]\\w*!(?=[(\\[{])",
  },
  Java: {
    comment: "\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/",
    string: "\"\"\"[\\s\\S]*?\"\"\"|\"(?:\\\\.|[^\"\\\\\\n])*\"|'(?:\\\\.|[^'\\\\\\n])*'",
    macro: "@[A-Za-z_]\\w*|^[ \\t]*#[ \\t]*[a-z]+",
  },
};
PARTS["C#"] = PARTS.Java;

const KINDS = [null, "tok-com", "tok-str", "tok-mac", "tok-num"];
const cache = {};

const pieces = (language) => {
  if (!cache[language]) {
    const p = PARTS[language];
    cache[language] = new RegExp([
      `(${p.comment})`,                                              // 1: comment
      `(${p.string})`,                                               // 2: string
      `(${p.macro})`,                                                // 3: macro or annotation
      "(\\b(?:0[xX][0-9a-fA-F]+|\\d[\\d_]*(?:\\.\\d+)?)(?:[LlFfDdUu]|usize|i32|i64|u32|u64|f64)?\\b)", // 4: number
      "([A-Za-z_$][\\w$]*)",                                         // 5: word
    ].join("|"), "gm");
  }
  return cache[language];
};

// Returns React children. Text between matches stays plain, so the text on screen
// is always exactly the source text, only the colors change.
const Highlight = ({ code, language = "Java" }) => {
  const lang = PARTS[language] ? language : "Java";
  const keywords = KEYWORDS[lang];
  const out = [];
  let last = 0;
  for (const m of code.matchAll(pieces(lang))) {
    let kind = KINDS[m.findIndex((g, i) => i > 0 && g !== undefined)];
    if (m[5]) {
      kind = keywords.has(m[0])
        ? "tok-kw"
        : /^[A-Z]/.test(m[0]) || (lang === "Rust" && RUST_TYPES.has(m[0]))
          ? "tok-type"
          : null;
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
