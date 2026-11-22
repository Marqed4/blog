// Builds a prefix tree (trie) of my finished LeetCode solutions and reports what is new.
// It runs before every deploy (see "predeploy" in package.json). It only READS my solutions
// folder and writes one small file next to it, so deploying never changes this repo.
// A solution counts as finished when it sits in a language folder and not in "unfinished".
const fs = require("fs");
const path = require("path");

// Where my solutions live. LEETCODE_DIR and LEETCODE_TREE let me point somewhere else to test.
const DIR = process.env.LEETCODE_DIR || "C:\\Leetcode";
const TREE_FILE = process.env.LEETCODE_TREE || path.join(DIR, "completed-tree.json");
const SITE_FILE = path.join(__dirname, "..", "src", "components", "pages", "home", "problems.json");
const SHOW_ALL = process.argv.includes("--all");

// File types that hold a solution, folders that never do, and project files that are not solutions
const EXT = new Set([".java", ".py", ".rs", ".cs", ".cpp", ".sql"]);
const SKIP = new Set([".git", ".venv", "venv", "target", "out", "bin", "obj", "__pycache__", "node_modules", "unfinished", "tried but incomplete"]);
const NOT_SOLUTIONS = new Set(["main.rs", "lib.rs", "mod.rs", "program.cs", "main.java"]);

// The key for a name: lowercase letters and digits only, so AddBinary, add_binary and the
// site slug add-binary all become "addbinary".
const keyOf = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

// ---- the prefix tree: one node per letter, a key ends where "files" is set ----
const node = () => ({ c: {}, files: null });

function insert(root, key, file) {
  let n = root;
  for (const ch of key) n = n.c[ch] || (n.c[ch] = node());
  (n.files || (n.files = [])).push(file);
}

function find(root, key) {
  let n = root;
  for (const ch of key) {
    n = n.c[ch];
    if (!n) return null;
  }
  return n;
}

const has = (root, key) => !!(find(root, key) && find(root, key).files);

// Every key stored at or below a node
function keysUnder(n, prefix, out = []) {
  if (n.files) out.push(prefix);
  for (const ch of Object.keys(n.c)) keysUnder(n.c[ch], prefix + ch, out);
  return out;
}

// Keys on the way down that are a prefix of the key (AddBinary2 finds addbinary)
// plus keys that start with it (a short file name finds the longer site slug)
function near(root, key) {
  const out = [];
  let n = root;
  for (let i = 0; i < key.length; i++) {
    n = n.c[key[i]];
    if (!n) break;
    if (n.files && i + 1 < key.length) out.push(key.slice(0, i + 1));
  }
  const end = find(root, key);
  if (end) out.push(...keysUnder(end, key).filter((k) => k !== key));
  return out.slice(0, 3);
}

// ---- scan the solutions folder ----
function scan(dir, root, base = dir, seen = { count: 0, ignored: [] }) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP.has(entry.name) && !entry.name.startsWith(".venv") && !entry.name.startsWith("cmake-build")) scan(full, root, base, seen);
    } else if (EXT.has(path.extname(entry.name).toLowerCase())) {
      if (NOT_SOLUTIONS.has(entry.name.toLowerCase())) { seen.ignored.push(entry.name); continue; }
      insert(root, keyOf(path.basename(entry.name, path.extname(entry.name))), path.relative(base, full));
      seen.count++;
    }
  }
  return seen;
}

// Never block a deploy: if anything goes wrong, say so and carry on
try {
  if (!fs.existsSync(DIR)) {
    console.log(`LeetCode tree: skipped, folder not found (${DIR}).`);
    process.exit(0);
  }
  const tree = node();
  const seen = scan(DIR, tree);
  const keys = keysUnder(tree, "");
  console.log(`LeetCode tree: ${keys.length} finished problems from ${seen.count} solution files.`);
  if (seen.ignored.length) console.log(`  Ignored project files: ${seen.ignored.join(", ")}`);

  // New since the last run: look each key up in the tree I saved last time
  if (fs.existsSync(TREE_FILE)) {
    const old = JSON.parse(fs.readFileSync(TREE_FILE, "utf8"));
    const fresh = keys.filter((k) => !has(old, k));
    console.log(`  New since last run: ${fresh.length}`);
    fresh.forEach((k) => console.log(`    + ${find(tree, k).files.join(", ")}`));
  } else {
    console.log("  First run: no earlier tree to compare with.");
  }

  // Finished here but not on the site yet: look each key up in a tree of the site's slugs
  const site = node();
  const slugs = JSON.parse(fs.readFileSync(SITE_FILE, "utf8")).map((p) => p.slug);
  slugs.forEach((s) => insert(site, keyOf(s), s));
  const missing = keys.filter((k) => !has(site, k));
  console.log(`  Not on the site yet: ${missing.length} of ${keys.length} (site lists ${slugs.length} problems)`);
  (SHOW_ALL ? missing : missing.slice(0, 10)).forEach((k) => {
    const hint = near(site, k).map((h) => find(site, h).files[0]);
    console.log(`    ${find(tree, k).files[0]}${hint.length ? `  (maybe: ${hint.join(", ")})` : ""}`);
  });
  if (!SHOW_ALL && missing.length > 10) console.log("    ... run with --all to see every one");

  fs.writeFileSync(TREE_FILE, JSON.stringify(tree));
  console.log(`  Saved tree: ${TREE_FILE}`);
} catch (err) {
  console.log(`LeetCode tree: skipped (${err.message}).`);
}
