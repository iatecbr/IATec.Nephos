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
import { canon, classify, buildIndex, dependents, NS } from './tokens-lib.mjs';

const MODES = ['claro', 'escuro'];
const DEFAULT_MODES = { core: null, theme: 'sistemas', semantic: null };

const modes = (light, dark) => ({ $extensions: { [NS]: { modes: { claro: light, escuro: dark } } } });

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
    'different-alias': { $type: 'color', $value: '{core.base.white}', ...modes('{core.base.white}', '{core.surface.900}') },
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

console.log('\n' + (failures === 0
  ? 'RESULT: ' + (Object.keys(EXPECTED).length + Object.keys(EXPECTED_DEPENDENTS).length + guards.length) + ' checks, all passed.'
  : 'RESULT: ' + failures + ' failure(s).'));
process.exit(failures === 0 ? 0 : 1);
