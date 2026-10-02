/**
 * Prova automatizada do classificador de invariancia.
 *
 * O ponto central: a classificacao compara uma representacao CANONICA de alias
 * e valor final. Objetos JavaScript distintos, com ordem de chave diferente,
 * mas equivalentes em conteudo, tem de ser classificados como invariantes.
 * Igualdade por identidade (===) reprovaria nos casos 3 e 4.
 *
 * Rode com: npm run test:tokens
 */
import { canon, classify, buildIndex, NS } from './tokens-lib.mjs';

const MODES = ['claro', 'escuro'];
const DEFAULT_MODES = { core: null, theme: 'sistemas', semantic: null };

const modes = (light, dark) => ({ $extensions: { [NS]: { modes: { claro: light, escuro: dark } } } });

/* Objetos DISTINTOS na memoria, com ordem de chave trocada, mesmo conteudo. */
const durA = { value: 250, unit: 'ms' };
const durB = { unit: 'ms', value: 250 };
const durC = { value: 150, unit: 'ms' };
const dimA = { unit: 'px', value: 16 };
const dimB = { value: 16, unit: 'px' };

/* Sombra: A e B tem o MESMO conteudo com a ordem de chave trocada, dentro e
   fora da camada. C muda a geometria. Nenhum dos tres e o mesmo objeto. */
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
    // 1. mesmo objeto literal repetido -> invariante
    'mesmo-objeto': { $type: 'duration', $value: durA, ...modes(durA, durA) },
    // 2. valores estruturados DIFERENTES -> variante
    'valores-diferentes': { $type: 'duration', $value: durA, ...modes(durA, durC) },
    // 3. objetos DISTINTOS, ordem de chave trocada, conteudo igual -> invariante
    'objetos-distintos-ordem-trocada': { $type: 'duration', $value: durA, ...modes(durA, durB) },
    // 4. idem para dimension
    'dimension-objetos-distintos': { $type: 'dimension', $value: dimA, ...modes(dimA, dimB) },
    // 5. alias igual nos dois modos -> invariante
    'alias-igual': { $type: 'color', $value: '{core.base.white}', ...modes('{core.base.white}', '{core.base.white}') },
    // 6. alias diferente, valor final diferente -> variante
    'alias-diferente': { $type: 'color', $value: '{core.base.white}', ...modes('{core.base.white}', '{core.surface.900}') },
    // 7. alias dependente de marca, igual nos dois modos -> invariante
    'alias-de-marca': { $type: 'color', $value: '{theme.brand-600}', ...modes('{theme.brand-600}', '{theme.brand-600}') },
    // 8. sem bloco modes -> invariante por definicao
    'sem-modes': { $type: 'number', $value: 0.5 },
    // 9. cubicBezier em arrays distintos, conteudo igual -> invariante
    'bezier-arrays-distintos': { $type: 'cubicBezier', $value: [0, 0, 0.2, 1], ...modes([0, 0, 0.2, 1], [0, 0, 0.2, 1]) },
    // 10. cubicBezier com conteudo diferente -> variante
    'bezier-diferente': { $type: 'cubicBezier', $value: [0, 0, 0.2, 1], ...modes([0, 0, 0.2, 1], [0.4, 0, 1, 1]) },
    // 11. shadow: camadas distintas na memoria, ordem de chave trocada, conteudo igual -> invariante
    'shadow-ordem-trocada': { $type: 'shadow', $value: shadowA, ...modes(shadowA, shadowB) },
    // 12. shadow com geometria diferente entre os modos -> variante
    'shadow-diferente': { $type: 'shadow', $value: shadowA, ...modes(shadowA, shadowC) },
  },
};

const EXPECTED = {
  'a.mesmo-objeto': 'invariante',
  'a.valores-diferentes': 'variante',
  'a.objetos-distintos-ordem-trocada': 'invariante',
  'a.dimension-objetos-distintos': 'invariante',
  'a.alias-igual': 'invariante',
  'a.alias-diferente': 'variante',
  'a.alias-de-marca': 'invariante',
  'a.sem-modes': 'invariante',
  'a.bezier-arrays-distintos': 'invariante',
  'a.bezier-diferente': 'variante',
  'a.shadow-ordem-trocada': 'invariante',
  'a.shadow-diferente': 'variante',
};

const idx = buildIndex([core, theme, cases]);
const { invariants, variants } = classify(cases, MODES, idx, DEFAULT_MODES);

let failures = 0;
console.log('=== PROVA: classificacao por forma canonica, nao por identidade de objeto ===');
for (const [name, expected] of Object.entries(EXPECTED)) {
  const actual = invariants.has(name) ? 'invariante' : variants.has(name) ? 'variante' : 'NAO CLASSIFICADO';
  const ok = actual === expected;
  if (!ok) failures++;
  console.log((ok ? 'PASSOU ' : 'FALHOU ') + name.padEnd(36) + ' esperado=' + expected + ' obtido=' + actual);
}

/* Guardas explicitas sobre identidade de objeto. */
const guards = [
  ['durA !== durB (objetos realmente distintos)', durA !== durB],
  ['canon(durA) === canon(durB) (forma canonica igual)', canon(durA) === canon(durB)],
  ['dimA !== dimB (objetos realmente distintos)', dimA !== dimB],
  ['canon(dimA) === canon(dimB)', canon(dimA) === canon(dimB)],
  ['canon(durA) !== canon(durC) (conteudo diferente)', canon(durA) !== canon(durC)],
  ['sombraA !== sombraB (objetos realmente distintos)', shadowA !== shadowB],
  ['canon(sombraA) === canon(sombraB) (ordem de chave nao importa, em qualquer profundidade)', canon(shadowA) === canon(shadowB)],
  ['canon(sombraA) !== canon(sombraC) (geometria diferente)', canon(shadowA) !== canon(shadowC)],
];
console.log('\n=== GUARDAS ===');
for (const [n, ok] of guards) {
  if (!ok) failures++;
  console.log((ok ? 'PASSOU ' : 'FALHOU ') + n);
}

console.log('\n' + (failures === 0
  ? 'RESULTADO: ' + (Object.keys(EXPECTED).length + guards.length) + ' verificacoes, todas passaram.'
  : 'RESULTADO: ' + failures + ' falha(s).'));
process.exit(failures === 0 ? 0 : 1);
