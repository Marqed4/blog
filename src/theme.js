// Site theme: two colors picked in the Character panel on Home.
//
// How it works: the CSS does not hold fixed purple and teal values. Each one is
// written as an hsl() whose hue is shifted by a CSS variable, and whose
// saturation is scaled by another:
//   hsl(calc(254 + var(--a-shift)) calc(100% * var(--a-sat)) 82%)
// Stroke drives group "a" (everything purple). Fill drives group "b" (the
// blue/teal accents). Lightness is never changed, so a bad pick cannot make
// text unreadable. With the default colors the shift is 0 and the scale is 1,
// so the site looks exactly as it did before.

const STORAGE_KEY = "ae-theme";
const LEGACY_STROKE_KEY = "ae-stroke-color";

export const DEFAULT_THEME = { stroke: "#8d7cf7", fill: "#3f8fb5" };

const MAX_SAT_SCALE = 1.25;
// Below this saturation a color is basically grey and its hue means nothing.
const MIN_SAT_FOR_HUE = 0.05;

// Checks a saved value is a real "#rrggbb" color before trusting it
const isHex = (value) => typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value);

// Converts "#rrggbb" to [hue 0-360, saturation 0-1, lightness 0-1]
const hexToHsl = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  let h;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  h *= 60;
  if (h < 0) h += 360;
  return [h, s, l];
};

// Hue/saturation of the default colors; picks are measured against these
const BASE = {
  stroke: hexToHsl(DEFAULT_THEME.stroke),
  fill: hexToHsl(DEFAULT_THEME.fill),
};

// How far a color is from the default: hue shift in degrees (wrapped to -180..180) and a saturation ratio
const measure = (hex, base) => {
  const [h, s] = hexToHsl(hex);
  const scale = Math.min(MAX_SAT_SCALE, s / base[1]);
  if (s < MIN_SAT_FOR_HUE) return { shift: 0, scale };
  let shift = h - base[0];
  if (shift > 180) shift -= 360;
  if (shift <= -180) shift += 360;
  return { shift, scale };
};

// Reads the saved colors from localStorage, falling back to the defaults
export const loadTheme = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && (isHex(saved.stroke) || isHex(saved.fill))) {
      return {
        stroke: isHex(saved.stroke) ? saved.stroke : DEFAULT_THEME.stroke,
        fill: isHex(saved.fill) ? saved.fill : DEFAULT_THEME.fill,
      };
    }
    // The old navbar picker saved only a stroke color. Keep that choice.
    const legacy = localStorage.getItem(LEGACY_STROKE_KEY);
    if (isHex(legacy)) return { ...DEFAULT_THEME, stroke: legacy };
  } catch {
    /* storage can be blocked or empty; use the defaults */
  }
  return { ...DEFAULT_THEME };
};

// Remembers the chosen colors between visits
export const saveTheme = (theme) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch {
    /* noop */
  }
};

// Writes the shifts into CSS variables on <html>; every hsl() in the CSS picks them up
export const applyTheme = (theme) => {
  const root = document.documentElement;
  const a = measure(theme.stroke, BASE.stroke);
  const b = measure(theme.fill, BASE.fill);
  root.style.setProperty("--a-shift", a.shift.toFixed(1));
  root.style.setProperty("--a-sat", a.scale.toFixed(3));
  root.style.setProperty("--b-shift", b.shift.toFixed(1));
  root.style.setProperty("--b-sat", b.scale.toFixed(3));
  root.style.setProperty("--ae-accent", theme.stroke);
};

// Clears saved colors, applies the defaults, returns them
export const resetTheme = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STROKE_KEY);
  } catch {
    /* noop */
  }
  const theme = { ...DEFAULT_THEME };
  applyTheme(theme);
  return theme;
};
