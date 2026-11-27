/**
 * Automated proof of the invariance classifier.
 *
 * The central point: the classification compares a CANONICAL representation of
 * alias and final value. Distinct JavaScript objects, with different key order
 * but equivalent content, must be classified as invariants. Identity equality
 * (===) would fail cases 3 and 4.
 *
 * Run with: npm run test:tokens
 */
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { canon, classify, buildIndex, dependents, dimensionProblem, NS } from './tokens-lib.mjs';

const MODES = ['light', 'dark'];
const DEFAULT_MODES = { core: null, theme: 'sistemas', semantic: null };

const modes = (light, dark) => ({ $extensions: { [NS]: { modes: { light, dark } } } });

/* DISTINCT objects in memory, with swapped key order, same content. */
const durA = { value: 250, unit: 'ms' };
const durB = { unit: 'ms', value: 250 };
const durC = { value: 150, unit: 'ms' };
const dimA = { unit: 'px', value: 16 };
const dimB = { value: 16, unit: 'px' };

/* Shadow: A and B have the SAME content with swapped key order, inside and
   outside the layer. C changes the geometry. None of the three is the same object. */
const layer = (y, blur, spread) => ({ offsetX: { value: 0, unit: 'px' }, offsetY: { value: y, unit: 'px' }, blur: { value: blur, unit: 'px' }, spread: { value: spread, unit: 'px' }, color: '{core.base.white}' });
const shadowA = [layer(1, 2, -1)];
const shadowB = [{ color: '{core.base.white}', spread: { unit: 'px', value: -1 }, blur: { unit: 'px', value: 2 }, offsetY: { unit: 'px', value: 1 }, offsetX: { unit: 'px', value: 0 } }];
const shadowC = [layer(4, 6, -4)];

const core = {
  core: {
    space: { 400: { $type: 'dimension', $value: { value: 16, unit: 'px' } } },
    duration: { 300: { $type: 'duration', $value: { value: 250, unit: 'ms' } } },
    base: { white: { $type: 'color', $value: '#ffffff' } },
    surface: { 900: { $type: 'color', $value: '#0f1114' } },
  },
};
const theme = {
  theme: {
    'brand-600': {
      $type: 'color',
      $value: '{core.base.white}',
      $extensions: { [NS]: { modes: { sistemas: '{core.base.white}' } } },
    },
  },
};

const cases = {
  a: {
    // 1. same literal object repeated -> invariant
    'same-object': { $type: 'duration', $value: durA, ...modes(durA, durA) },
    // 2. DIFFERENT structured values -> variant
    'different-values': { $type: 'duration', $value: durA, ...modes(durA, durC) },
    // 3. DISTINCT objects, swapped key order, same content -> invariant
    'distinct-objects-swapped-order': { $type: 'duration', $value: durA, ...modes(durA, durB) },
    // 4. same for dimension
    'dimension-distinct-objects': { $type: 'dimension', $value: dimA, ...modes(dimA, dimB) },
    // 5. same alias in both modes -> invariant
    'same-alias': { $type: 'color', $value: '{core.base.white}', ...modes('{core.base.white}', '{core.base.white}') },
    // 6. different alias, different final value -> variant
    'different-alias': { $type: 'color', $value: '{core.base.white}', ...modes('{core.base.white}', '{core.slate.900}') },
    // 7. brand-dependent alias, same in both modes -> invariant
    'brand-alias': { $type: 'color', $value: '{theme.brand-600}', ...modes('{theme.brand-600}', '{theme.brand-600}') },
    // 8. no modes block -> invariant by definition
    'no-modes': { $type: 'number', $value: 0.5 },
    // 9. cubicBezier in distinct arrays, same content -> invariant
    'bezier-distinct-arrays': { $type: 'cubicBezier', $value: [0, 0, 0.2, 1], ...modes([0, 0, 0.2, 1], [0, 0, 0.2, 1]) },
    // 10. cubicBezier with different content -> variant
    'different-bezier': { $type: 'cubicBezier', $value: [0, 0, 0.2, 1], ...modes([0, 0, 0.2, 1], [0.4, 0, 1, 1]) },
    // 11. shadow: layers distinct in memory, swapped key order, same content -> invariant
    'shadow-swapped-order': { $type: 'shadow', $value: shadowA, ...modes(shadowA, shadowB) },
    // 12. shadow with different geometry between modes -> variant
    'different-shadow': { $type: 'shadow', $value: shadowA, ...modes(shadowA, shadowC) },
  },
};

const EXPECTED = {
  'a.same-object': 'invariant',
  'a.different-values': 'variant',
  'a.distinct-objects-swapped-order': 'invariant',
  'a.dimension-distinct-objects': 'invariant',
  'a.same-alias': 'invariant',
  'a.different-alias': 'variant',
  'a.brand-alias': 'invariant',
  'a.no-modes': 'invariant',
  'a.bezier-distinct-arrays': 'invariant',
  'a.different-bezier': 'variant',
  'a.shadow-swapped-order': 'invariant',
  'a.different-shadow': 'variant',
};

const idx = buildIndex([core, theme, cases]);
const { invariants, variants } = classify(cases, MODES, idx, DEFAULT_MODES);

let failures = 0;
console.log('=== PROOF: classification by canonical form, not by object identity ===');
for (const [name, expected] of Object.entries(EXPECTED)) {
  const actual = invariants.has(name) ? 'invariant' : variants.has(name) ? 'variant' : 'UNCLASSIFIED';
  const ok = actual === expected;
  if (!ok) failures++;
  console.log((ok ? 'PASSED ' : 'FAILED ') + name.padEnd(36) + ' expected=' + expected + ' got=' + actual);
}

/*
 * DEPENDENT invariants (P67): those that must also come out on each scheme
 * root. Uses the cases above plus three chains of its own.
 */
const chains = {
  b: {
    // via variant: points to a token that changes between light and dark
    'via-variant': { $type: 'color', $value: '{a.different-alias}' },
    // transitive: invariant -> invariant that points to theme
    'transitive': { $type: 'color', $value: '{a.brand-alias}' },
    // core only: depends on neither brand nor scheme
    'core-only': { $type: 'color', $value: '{a.same-alias}' },
  },
};
const chainSource = { ...cases, ...chains };
const chainIdx = buildIndex([core, theme, chainSource]);
const chainClass = classify(chainSource, MODES, chainIdx, DEFAULT_MODES);
const dep = dependents(chainSource, chainClass.invariants, chainClass.variants);

const EXPECTED_DEPENDENTS = {
  'a.brand-alias': true, // directly on theme
  'b.via-variant': true,
  'b.transitive': true,
  'b.core-only': false,
  'a.same-alias': false,
};
console.log('\n=== PROOF: invariants dependent on brand or scheme ===');
for (const [name, expected] of Object.entries(EXPECTED_DEPENDENTS)) {
  const actual = dep.has(name);
  const ok = actual === expected;
  if (!ok) failures++;
  console.log((ok ? 'PASSED ' : 'FAILED ') + name.padEnd(36) + ' expected=' + expected + ' got=' + actual);
}

/* Explicit guards on object identity. */
const guards = [
  ['durA !== durB (really distinct objects)', durA !== durB],
  ['canon(durA) === canon(durB) (same canonical form)', canon(durA) === canon(durB)],
  ['dimA !== dimB (really distinct objects)', dimA !== dimB],
  ['canon(dimA) === canon(dimB)', canon(dimA) === canon(dimB)],
  ['canon(durA) !== canon(durC) (different content)', canon(durA) !== canon(durC)],
  ['shadowA !== shadowB (really distinct objects)', shadowA !== shadowB],
  ['canon(shadowA) === canon(shadowB) (key order does not matter, at any depth)', canon(shadowA) === canon(shadowB)],
  ['canon(shadowA) !== canon(shadowC) (different geometry)', canon(shadowA) !== canon(shadowC)],
];
console.log('\n=== GUARDS ===');
for (const [n, ok] of guards) {
  if (!ok) failures++;
  console.log((ok ? 'PASSED ' : 'FAILED ') + n);
}

/*
 * The units of a dimension (DSA-85, DSA-80 D-1): `px` becomes `rem`, `%` comes out as it is, and any other unit
 * stops the build. The first part checks the rule; the second builds a copy of the real sources with a
 * percentage in it and reads the CSS, so the proof is the output and not the function.
 */
const unitChecks = [
  ['a px dimension is valid', dimensionProblem({ value: 16, unit: 'px' }) === null],
  ['a percentage dimension is valid', dimensionProblem({ value: 16, unit: '%' }) === null],
  ['a reference is left to the check of its target', dimensionProblem('{core.space.400}') === null],
  ['a vh dimension is refused', dimensionProblem({ value: 16, unit: 'vh' }) !== null],
  ['an em dimension is refused', dimensionProblem({ value: 1, unit: 'em' }) !== null],
  ['a dimension with no unit is refused', dimensionProblem({ value: 16 }) !== null],
  ['a dimension that is not a number is refused', dimensionProblem({ value: '16', unit: '%' }) !== null],
  ['a literal string is refused', dimensionProblem('16%') !== null],
];

/** Builds a copy of the sources, with the core changed by `edit`, and returns the exit code, the CSS and the log. */
function buildCopy(edit) {
  const dir = mkdtempSync(join(tmpdir(), 'nephos-tokens-'));
  try {
    cpSync('src/tokens/source', join(dir, 'source'), { recursive: true });
    const corePath = join(dir, 'source', 'core.tokens.json');
    const core = JSON.parse(readFileSync(corePath, 'utf8'));
    edit(core);
    writeFileSync(corePath, JSON.stringify(core, null, 2));
    const run = spawnSync(process.execPath, ['scripts/build-tokens.mjs'], {
      encoding: 'utf8',
      env: { ...process.env, NEPHOS_TOKENS_SRC: join(dir, 'source'), NEPHOS_TOKENS_OUT: join(dir, 'tokens.css') },
    });
    let css = '';
    try { css = readFileSync(join(dir, 'tokens.css'), 'utf8'); } catch { /* the build stopped before writing */ }
    return { status: run.status, css, log: run.stdout + run.stderr };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const addDimension = (unit) => (core) => {
  core.core['fixture-offset'] = { top: { $type: 'dimension', $value: { value: 16, unit } } };
  core.$extensions[NS].expectedCount += 1;
};

const percent = buildCopy(addDimension('%'));
const vh = buildCopy(addDimension('vh'));
unitChecks.push(
  ['the build accepts a percentage', percent.status === 0],
  ['a percentage comes out as 16%, with no conversion', /--nph-core-fixture-offset-top: 16%;/.test(percent.css)],
  ['a px dimension still comes out in rem next to it', /--nph-core-space-400: 1rem;/.test(percent.css)],
  ['the build stops on a vh dimension and names the token', vh.status !== 0 && /core\.fixture-offset\.top/.test(vh.log) && /unit "vh" is not handled/.test(vh.log)],
);

console.log('\n=== PROOF: the units of a dimension ===');
for (const [n, ok] of unitChecks) {
  if (!ok) failures++;
  console.log((ok ? 'PASSED ' : 'FAILED ') + n);
}

/*
 * The strokeStyle type (DSA-74): the build writes the keyword as it is. The fixture lives in a group that does not
 * exist in the source (`fixture-stroke`), so it never replaces the real `border-style` group and keeps passing when
 * the real tokens come in. A token of another, unknown type still stops the build.
 */
const stroke = buildCopy((core) => {
  core.core['fixture-stroke'] = {
    dashed: { $type: 'strokeStyle', $value: 'dashed' },
    alias: { $type: 'strokeStyle', $value: '{core.fixture-stroke.dashed}' },
  };
  core.$extensions[NS].expectedCount += 2;
});
const unknownType = buildCopy((core) => {
  core.core['fixture-stroke'] = { dashed: { $type: 'borderStyle', $value: 'dashed' } };
  core.$extensions[NS].expectedCount += 1;
});
const strokeChecks = [
  ['the build accepts a strokeStyle token', stroke.status === 0],
  ['a strokeStyle comes out as the keyword, with no conversion', /--nph-core-fixture-stroke-dashed: dashed;/.test(stroke.css)],
  ['a strokeStyle reference keeps its reference', /--nph-core-fixture-stroke-alias: var\(--nph-core-fixture-stroke-dashed\);/.test(stroke.css)],
  ['the build stops on a type it does not handle and names the token', unknownType.status !== 0 && /core\.fixture-stroke\.dashed/.test(unknownType.log) && /not handled/.test(unknownType.log)],
];
console.log('\n=== PROOF: the strokeStyle type ===');
for (const [n, ok] of strokeChecks) {
  if (!ok) failures++;
  console.log((ok ? 'PASSED ' : 'FAILED ') + n);
}
console.log('\n' + (failures === 0
  ? 'RESULT: ' + (Object.keys(EXPECTED).length + Object.keys(EXPECTED_DEPENDENTS).length + guards.length + unitChecks.length + strokeChecks.length) + ' checks, all passed.'
  : 'RESULT: ' + failures + ' failure(s).'));
process.exit(failures === 0 ? 0 : 1);
