/**
 * Pure functions shared by build-tokens.mjs and test-invariance.mjs.
 * No side effects: importing this file reads no disk and generates nothing.
 */

export const NS = 'com.iatec.nephos';

/**
 * DTCG types the generator knows how to emit. Any other is an error.
 *
 * `fontFamily` was added on 27-08-2026, with the `text` layer. Style Dictionary
 * already ships the `fontFamily/css` transform in the `css` group: it joins the
 * list with commas and quotes the name that needs quotes.
 *
 * Font weight stays a `number`, not `fontWeight`: DTCG accepts a word or a
 * number for that type, and the Nephos source always writes a number.
 *
 * `shadow` was added on 03-09-2026, with the 11 effect styles (PF-15). Style
 * Dictionary already ships `shadow/css/shorthand` in the `css` group: it builds
 * the shorthand and preserves each part's reference. No new dependency came
 * in - the type just had to be on this list.
 */
export const HANDLED_TYPES = new Set([
  'color', 'dimension', 'duration', 'cubicBezier', 'number', 'fontFamily', 'shadow',
]);

/**
 * Canonical representation of a value, stable and independent of object
 * identity and key order. `{value:250,unit:'ms'}` and `{unit:'ms',value:250}`
 * produce the SAME string.
 */
export function canon(v) {
  if (v === null || v === undefined) return 'null';
  if (Array.isArray(v)) return '[' + v.map(canon).join(',') + ']';
  if (typeof v === 'object') {
    return '{' + Object.keys(v).sort().map((k) => JSON.stringify(k) + ':' + canon(v[k])).join(',') + '}';
  }
  if (typeof v === 'number') return String(v);
  return JSON.stringify(v);
}

/** If the value is a `{a.b.c}` reference, returns `a.b.c`; otherwise, null. */
export function aliasOf(v) {
  if (typeof v !== 'string') return null;
  const m = /^\{([^}]+)\}$/.exec(v.trim());
  return m ? m[1] : null;
}

/**
 * All references contained in a value, at any depth.
 *
 * It walks arrays and objects because a composite value keeps references INSIDE
 * itself: a `shadow` token has one reference per layer, in `offsetY`, `blur`,
 * `spread` and `color`. While this function only read strings, none of them was
 * validated - neither the target's existence nor the flattening in the output.
 */
export function refs(v) {
  if (typeof v === 'string') return [...v.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
  if (Array.isArray(v)) return v.flatMap(refs);
  if (v !== null && typeof v === 'object') return Object.values(v).flatMap(refs);
  return [];
}

/** Walks leaves ($value) returning [path, token]. */
export function leaves(node, base = []) {
  const out = [];
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith('$')) continue;
    if (v && typeof v === 'object' && '$value' in v) out.push([base.concat(k), v]);
    else if (v && typeof v === 'object') out.push(...leaves(v, base.concat(k)));
  }
  return out;
}

/** Raw value of a token in a mode: the mode's value, or the $value when invariant. */
export function valueInMode(token, mode) {
  const m = token.$extensions && token.$extensions[NS] && token.$extensions[NS].modes;
  return m && mode in m ? m[mode] : token.$value;
}

/** Indexes all tokens from several sources by dotted path. */
export function buildIndex(sources) {
  const idx = new Map();
  for (const f of sources) for (const [p, t] of leaves(f)) idx.set(p.join('.'), t);
  return idx;
}

/**
 * Resolves the reference chain down to the literal.
 * When the target has its own modes (the brand layer has seven), it uses that
 * layer's default mode — the same criterion as reading from Figma.
 */
export function finalValue(value, idx, defaultsByPrefix, depth = 0) {
  if (depth > 12) return 'CYCLE';
  const a = aliasOf(value);
  if (!a) return canon(value);
  const target = idx.get(a);
  if (!target) return 'MISSING:' + a;
  const prefix = a.split('.')[0];
  const defaultMode = defaultsByPrefix[prefix];
  return finalValue(valueInMode(target, defaultMode), idx, defaultsByPrefix, depth + 1);
}

/**
 * Classifies each token of a source as invariant or variant across modes.
 *
 * Criterion: invariant only when ALIAS and FINAL VALUE are equivalent in all
 * modes. The comparison uses the canonical form — never object identity, never
 * key order, never the $type.
 */
export function classify(source, modes, idx, defaultsByPrefix) {
  const invariants = new Set();
  const variants = new Set();
  const detail = new Map();
  for (const [p, t] of leaves(source)) {
    const name = p.join('.');
    const keys = modes.map((m) => {
      const raw = valueInMode(t, m);
      return canon(aliasOf(raw)) + '::' + finalValue(raw, idx, defaultsByPrefix);
    });
    const equal = keys.every((c) => c === keys[0]);
    (equal ? invariants : variants).add(name);
    detail.set(name, { equal, keys });
  }
  return { invariants, variants, detail };
}

/**
 * Invariants that DEPEND on brand or scheme (P67).
 *
 * An invariant is dependent when any of its references points to `theme.*`, to
 * a variant or to another dependent invariant. The set comes out by fixed
 * point, to catch the invariant -> invariant -> theme chain.
 *
 * Why it matters: a custom property with `var()` resolves on the element that
 * declares it, and the child inherits the already-resolved value. A dependent
 * declared only on `:root` keeps the root's brand and scheme in a subtree that
 * switches both.
 */
export function dependents(source, invariants, variants) {
  const tokens = new Map(leaves(source).map(([p, t]) => [p.join('.'), t]));
  const references = (name) => {
    const t = tokens.get(name);
    const m = (t.$extensions && t.$extensions[NS] && t.$extensions[NS].modes) || {};
    return refs(t.$value).concat(Object.values(m).flatMap(refs));
  };
  const out = new Set();
  let changed = true;
  while (changed) {
    changed = false;
    for (const name of invariants) {
      if (out.has(name)) continue;
      const hit = references(name).some((r) => r.startsWith('theme.') || variants.has(r) || out.has(r));
      if (hit) {
        out.add(name);
        changed = true;
      }
    }
  }
  return out;
}
