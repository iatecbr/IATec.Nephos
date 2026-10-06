/**
 * Generates src/tokens/generated/tokens.css from src/tokens/source/*.tokens.json.
 *
 * DTCG does not have native modes yet. Modes live in
 * $extensions["com.iatec.nephos"].modes and are applied here, before Style
 * Dictionary: for each mode, the token's $value becomes that mode's value.
 * Style Dictionary then resolves the references and emits one CSS block per
 * mode, with the selector declared in the source file itself.
 *
 * A token is INVARIANT when alias and final value are equivalent in all modes —
 * compared by canonical form, never by object identity and never by $type. An
 * invariant is emitted once. Invariant does NOT mean fixed: an alias to
 * theme/* or to a variant keeps switching with the brand and the scheme. That
 * DEPENDENT invariant is emitted on :root and on each scheme root
 * ([data-nph-color-scheme]), to resolve the local brand and scheme there (P67).
 * The others stay on :root only, where the consumer can customize them (P02).
 *
 * NEVER edit src/tokens/generated/. Edit the source and run `npm run build:tokens`.
 */
import StyleDictionary from 'style-dictionary';
import fs from 'node:fs';
import path from 'node:path';
import { NS, HANDLED_TYPES, aliasOf, leaves, refs, buildIndex, classify, dependents } from './tokens-lib.mjs';

const SRC = 'src/tokens/source';
const OUT = 'src/tokens/generated/tokens.css';

const errors = [];
const fail = (m) => errors.push(m);

const load = (f) => JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8'));
const core = load('core.tokens.json');
const theme = load('theme.tokens.json');
const semantic = load('semantic.tokens.json');
const sources = [core, theme, semantic];

const idx = buildIndex(sources);
const declared = new Set(idx.keys());

const tm = theme.$extensions[NS].modeSet;
const sm = semantic.$extensions[NS].modeSet;
/** Default mode per layer prefix, used when resolving the alias chain. */
const DEFAULT_MODES = { core: null, theme: tm.default, ...Object.fromEntries(
  Object.keys(semantic).filter((k) => !k.startsWith('$')).map((k) => [k, sm.default]),
) };

// ---------------------------------------------------------------
// SOURCE VALIDATIONS - they fail before generating anything
// ---------------------------------------------------------------
for (const source of sources) {
  const ext = (source.$extensions && source.$extensions[NS]) || {};
  const layer = ext.layer || '(no layer)';
  const modes = ext.modeSet ? ext.modeSet.modes : null;
  const list = leaves(source);

  if (ext.expectedCount !== undefined && list.length !== ext.expectedCount) {
    fail('layer "' + layer + '": ' + list.length + ' tokens, expected ' + ext.expectedCount);
  }

  for (const [p, t] of list) {
    const name = p.join('.');

    if (!HANDLED_TYPES.has(t.$type)) {
      fail('token "' + name + '": $type "' + t.$type + '" not handled. Handled: ' + [...HANDLED_TYPES].join(', '));
    }

    const m = t.$extensions && t.$extensions[NS] && t.$extensions[NS].modes;
    if (m) {
      if (!modes) {
        fail('token "' + name + '": declares modes, but layer "' + layer + '" does not declare modeSet');
      } else {
        for (const mode of modes) {
          if (!(mode in m)) fail('token "' + name + '": missing value for mode "' + mode + '"');
        }
      }
    }

    const targets = refs(t.$value).concat(Object.values(m || {}).flatMap(refs));
    for (const a of targets) {
      if (!declared.has(a)) fail('token "' + name + '": reference "{' + a + '}" does not exist in any source');
    }
  }
}

if (errors.length) {
  console.error('FAILURE in source validation:\n' + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}

// ---------------------------------------------------------------
// GENERATION
// ---------------------------------------------------------------

/**
 * Style Dictionary 5.5.2 serializes `duration` in the DTCG structured form
 * ({ value, unit }) as "[object Object]". The source stays structured, as DTCG
 * requires; the conversion to `250ms` happens only in the CSS output.
 */
StyleDictionary.registerTransform({
  name: 'nephos/duration/css',
  type: 'value',
  transitive: false,
  filter: (t) => (t.$type || t.type) === 'duration' && t.$value && typeof t.$value === 'object',
  transform: (t) => String(t.$value.value) + String(t.$value.unit),
});

/**
 * P62.4 — Elvys's decision on 28/08/2026: the generator emits `rem`, and
 * `design.md` does not change. Until then every `dimension` came out in `px`,
 * and the contract already promised `rem`; the code was the one in the wrong.
 *
 * The root is 16px, as `unidade_css: rem, root 16px` in `design.md` declares in
 * `tipografia_regras` and `espacamento_regras`.
 *
 * FAMILIES IN PX BY THEIR OWN RULE, not by omission. There are TWO, and each
 * has its rule written in the contract:
 *
 * - `core/radius`, by `raio_regras.unidade_css: px` in `design.md`. Radius in
 *   rem would grow with the user's font and the piece would change SHAPE, not
 *   size: a 6px button would become a capsule (P62.5).
 * - `core/shadow-*`, by `elevacao_regras.unidade_css: px`. The foundation says,
 *   in so many words: "offset, blur and spread in px, like the radius. Shadow
 *   must not grow with the user's font". Added on 03-09-2026, with PF-15.
 *
 * The text that called radius the only foundation in px had been wrong since
 * `elevacao_regras` existed. Fixed in `design.md` in the same PR.
 */
const REM_ROOT = 16;
const NO_CONVERSION = ['radius', 'shadow-y', 'shadow-blur', 'shadow-spread'];

/** Short number: 1.75, not 1.7500000000000002; 0, not 0.0000. */
function shortNumber(n) {
  return String(Number(n.toFixed(6)));
}

/**
 * By the time this transform runs, Style Dictionary has already serialized the
 * structured DTCG `dimension` into the string "16px" — unlike `duration`, which
 * it does not handle. That is why we read the string, not { value, unit }.
 */
const PX = /^(-?\d+(?:\.\d+)?)px$/;

const inPx = (t) => {
  const v = t.$value;
  if (typeof v === 'string') return PX.exec(v);
  if (v && typeof v === 'object' && v.unit === 'px') return [null, String(v.value)];
  return null;
};

StyleDictionary.registerTransform({
  name: 'nephos/dimension/rem',
  type: 'value',
  transitive: false,
  filter: (t) =>
    (t.$type || t.type) === 'dimension' &&
    !t.path.some((seg) => NO_CONVERSION.includes(seg)) &&
    inPx(t) !== null,
  transform: (t) => {
    const px = Number(inPx(t)[1]);
    if (px === 0) return '0';
    return shortNumber(px / REM_ROOT) + 'rem';
  },
});

/**
 * SHADOW - why the transform is our own, and not Style Dictionary's
 * `shadow/css/shorthand`.
 *
 * The built-in builds the right shorthand, but what writes the references is
 * `outputReferences`, which works by VALUE: it searches for the resolved value
 * inside the finished string and swaps in the `var()`. On a shadow that picks
 * the wrong position whenever two parts have the same value - and they do. In
 * `elevation/hairline` (0 1 0 0) the X offset, the blur and the spread are all
 * zero, and the output came out with `var(--nph-core-shadow-blur-0)` in place
 * of X. The computed CSS was right by coincidence and the binding wrong:
 * changing the blur would move the offset.
 *
 * Here the shorthand is built from `original.$value`, which still has the
 * references, and each part goes to ITS position. The file's `outputReferences`
 * is turned off for `shadow` - otherwise it would try to substitute again.
 */
const varOf = (ref) => 'var(--nph-' + ref.split('.').join('-') + ')';

function shadowPart(v) {
  const a = aliasOf(v);
  if (a) return varOf(a);
  if (v !== null && typeof v === 'object' && 'value' in v) return String(v.value) + String(v.unit);
  return String(v);
}

StyleDictionary.registerTransform({
  name: 'nephos/shadow/css',
  type: 'value',
  // transitive: the value has a reference, and a non-transitive transform is skipped in that case.
  transitive: true,
  filter: (t) => (t.$type || t.type) === 'shadow',
  transform: (t) => {
    const raw = t.original && t.original.$value !== undefined ? t.original.$value : t.$value;
    if (typeof raw === 'string') return raw;
    const layers = Array.isArray(raw) ? raw : [raw];
    return layers
      .map((c) => [c.offsetX, c.offsetY, c.blur, c.spread, c.color].map(shadowPart).join(' '))
      .join(', ');
  },
});

const TRANSFORMS = [
  ...StyleDictionary.hooks.transformGroups.css.filter((n) => n !== 'shadow/css/shorthand'),
  'nephos/duration/css',
  'nephos/dimension/rem',
  'nephos/shadow/css',
];

function applyMode(node, mode) {
  if (Array.isArray(node)) return node.slice();
  if (node === null || typeof node !== 'object') return node;
  const out = {};
  for (const [k, v] of Object.entries(node)) out[k] = applyMode(v, mode);
  if ('$value' in out && mode) {
    const m = out.$extensions && out.$extensions[NS] && out.$extensions[NS].modes;
    if (m && mode in m) out.$value = m[mode];
  }
  return out;
}

const semanticFamily = new Set(Object.keys(semantic).filter((k) => !k.startsWith('$')));

async function block(layer, mode, selector, subset) {
  const tokens = Object.assign(
    {},
    applyMode(core, null),
    applyMode(theme, layer === 'theme' ? mode : null),
    applyMode(semantic, layer === 'semantic' ? mode : null),
  );
  const ofLayer =
    layer === 'core' ? (t) => t.path[0] === 'core'
    : layer === 'theme' ? (t) => t.path[0] === 'theme'
    : (t) => semanticFamily.has(t.path[0]);
  const filterFn = subset
    ? (t) => ofLayer(t) && subset.has(t.path.join('.'))
    : ofLayer;

  const sd = new StyleDictionary({
    tokens,
    usesDtcg: true,
    platforms: {
      css: {
        transforms: TRANSFORMS,
        prefix: 'nph',
        files: [{
          destination: 'x.css',
          format: 'css/variables',
          filter: filterFn,
          options: {
            outputReferences: (t) => (t.$type || t.type) !== 'shadow',
            selector: selector,
            showFileHeader: false,
            formatting: { commentStyle: 'none' },
          },
        }],
      },
    },
  }, { verbosity: 'silent', warnings: 'silent' });
  await sd.hasInitialized;
  const files = await sd.formatPlatform('css');
  return files[0].output.trim();
}

const sel = (set, mode, publicValue) => {
  const s = set.selector.replace('{mode}', publicValue || mode);
  return mode === set.default ? ':root,\n' + s : s;
};

const { invariants, variants } = classify(semantic, sm.modes, idx, DEFAULT_MODES);
const dependentInvariants = dependents(semantic, invariants, variants);
const independentInvariants = new Set([...invariants].filter((n) => !dependentInvariants.has(n)));
/** Every scheme root redeclares the dependents; with the brand on the same element, it resolves both. */
const DEPENDENT_SELECTOR = ':root,\n[data-nph-color-scheme]';

const parts = [];
parts.push('/* camada 1 - core: primitivos, valores literais. Nenhum componente consome daqui. */');
parts.push(await block('core', null, ':root'));

parts.push('\n/* camada de marca - um bloco por vertical da IATec. */');
for (const m of tm.modes) parts.push(await block('theme', m, sel(tm, m)));

parts.push(
  '\n/* camada 2 - semantic, invariantes: alias e valor final iguais em claro e escuro,\n' +
  '   emitidos uma vez, em :root. Aqui o consumidor pode personaliza-los (P02). */',
);
parts.push(await block('semantic', sm.default, ':root', independentInvariants));

parts.push(
  '\n/* camada 2 - semantic, invariantes dependentes: o alias aponta para theme/* ou\n' +
  '   para um variante. Saem tambem em cada raiz de esquema, para resolver ali a\n' +
  '   marca e o esquema locais. Numa parte da tela com outra marca,\n' +
  '   data-nph-brand e data-nph-color-scheme vao no mesmo elemento (P67). */',
);
parts.push(await block('semantic', sm.default, DEPENDENT_SELECTOR, dependentInvariants));

parts.push('\n/* camada 2 - semantic, variantes: um bloco por esquema de cor. */');
for (const m of sm.modes) parts.push(await block('semantic', m, sel(sm, m, sm.publicValue[m]), variants));

const header = [
  '/**',
  ' * ARQUIVO GERADO - NAO EDITE.',
  ' * Fonte: src/tokens/source/*.tokens.json',
  ' * Gere de novo com: npm run build:tokens',
  ' */',
  '',
].join('\n');

const css = header + parts.join('\n') + '\n';

// ---------------------------------------------------------------
// OUTPUT VALIDATIONS
// ---------------------------------------------------------------
const outputErrors = [];

const unresolved = css.match(/\{[^}\n]+\}/g);
if (unresolved) {
  outputErrors.push('unresolved references in the output: ' + [...new Set(unresolved)].join(', '));
}
if (css.includes('[object Object]')) {
  outputErrors.push('value serialized as "[object Object]" - DTCG type that Style Dictionary did not convert');
}

// No alias may be flattened. The rule is per token: what is a reference in the
// source MUST come out as var(--nph-...). What is a literal in the source comes
// out literal.
//
// A SCALAR value has a single reference, and it is the whole value: it is enough
// to require that the output start with `var(`. A COMPOSITE value - `shadow` -
// keeps one reference per part of each layer, and the output is a shorthand with
// several `var()` amid literals. For that one the rule is COUNTING: as many
// `var(--nph-` in the output as references the source declares. A single one
// flattened into a literal would break the count.
const cssName = (p) => '--nph-' + p.join('-');
const scalars = new Set();
const composites = new Map();
for (const source of [theme, semantic]) {
  for (const [p, t] of leaves(source)) {
    const m = (t.$extensions && t.$extensions[NS] && t.$extensions[NS].modes) || {};
    const values = [t.$value].concat(Object.values(m));
    if (!values.some((v) => refs(v).length > 0)) continue;
    if (Array.isArray(t.$value)) composites.set(cssName(p), refs(t.$value).length);
    else scalars.add(cssName(p));
  }
}
for (const line of css.match(/--nph-[\w-]+:[^;]+;/g) || []) {
  const name = line.slice(0, line.indexOf(':'));
  const value = line.slice(line.indexOf(':') + 1, -1).trim();
  if (scalars.has(name) && !value.startsWith('var(')) {
    outputErrors.push('alias flattened into a literal: ' + name + ' emitted as "' + value + '"');
  }
  if (composites.has(name)) {
    const emitted = value.split('var(--nph-').length - 1;
    const expected = composites.get(name);
    if (emitted !== expected) {
      outputErrors.push('alias flattened in a composite value: ' + name + ' declares ' + expected +
        ' reference(s) in the source and emitted ' + emitted + ' var() in "' + value + '"');
    }
  }
}

// Each semantic token must appear: invariant once, variant once per mode.
for (const name of invariants) {
  const n = (css.match(new RegExp('^\\s*' + cssName(name.split('.')) + ':', 'gm')) || []).length;
  if (n !== 1) outputErrors.push('invariant "' + name + '" emitted ' + n + ' time(s), expected 1');
}
for (const name of variants) {
  const n = (css.match(new RegExp('^\\s*' + cssName(name.split('.')) + ':', 'gm')) || []).length;
  if (n !== sm.modes.length) outputErrors.push('variant "' + name + '" emitted ' + n + ' time(s), expected ' + sm.modes.length);
}

// A dependent invariant comes out in the scheme-roots block; an independent one,
// never (P67). Outside it, the dependent resolves the root's brand and scheme in
// a subtree; inside it, the independent would lose the root's customization (P02).
const dependentBlockStart = css.indexOf(DEPENDENT_SELECTOR + ' {');
const dependentBlock = dependentBlockStart < 0 ? '' : css.slice(dependentBlockStart, css.indexOf('}', dependentBlockStart));
const inDependentBlock = new Set((dependentBlock.match(/--nph-[\w-]+(?=:)/g) || []));
for (const name of dependentInvariants) {
  if (!inDependentBlock.has(cssName(name.split('.')))) {
    outputErrors.push('dependent invariant "' + name + '" outside the block ' + JSON.stringify(DEPENDENT_SELECTOR));
  }
}
for (const name of independentInvariants) {
  if (inDependentBlock.has(cssName(name.split('.')))) {
    outputErrors.push('independent invariant "' + name + '" in the block ' + JSON.stringify(DEPENDENT_SELECTOR));
  }
}

if (outputErrors.length) {
  console.error('FAILURE in output validation:\n' + outputErrors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, css, 'utf8');

const count = (f) => leaves(f).length;
console.log('generated: ' + OUT);
console.log('source OK: handled types, complete modes, existing references, count per layer');
console.log('output OK: no pending reference, no [object Object], no flattened alias, correct occurrences per mode');
console.log('layers: core ' + count(core) + ' + theme ' + count(theme) + ' + semantic ' + count(semantic) +
  ' = ' + (count(core) + count(theme) + count(semantic)));
console.log('semantic: ' + invariants.size + ' invariants (' + independentInvariants.size + ' on :root, ' +
  dependentInvariants.size + ' dependents also on each scheme root) + ' + variants.size + ' variants (one block per mode)');
