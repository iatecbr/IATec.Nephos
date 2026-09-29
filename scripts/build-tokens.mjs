/**
 * Gera src/tokens/generated/tokens.css a partir de src/tokens/source/*.tokens.json.
 *
 * O DTCG ainda nao tem modos nativos. Os modos vivem em
 * $extensions["com.iatec.nephos"].modes e sao aplicados aqui, antes do Style
 * Dictionary: para cada modo, o $value do token passa a ser o valor daquele modo.
 * O Style Dictionary entao resolve as referencias e emite um bloco CSS por modo,
 * com o seletor declarado no proprio arquivo-fonte.
 *
 * Um token e INVARIANTE quando alias e valor final sao equivalentes em todos os
 * modos — comparados pela forma canonica, nunca por identidade de objeto e nunca
 * pelo $type. Invariante sai uma vez em :root. Invariante NAO quer dizer fixo: um
 * alias para theme/* continua trocando com data-nph-brand.
 *
 * NUNCA edite src/tokens/generated/. Edite a fonte e rode `npm run build:tokens`.
 */
import StyleDictionary from 'style-dictionary';
import fs from 'node:fs';
import path from 'node:path';
import { NS, HANDLED_TYPES, aliasOf, leaves, refs, buildIndex, classify } from './tokens-lib.mjs';

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
/** Modo padrao por prefixo de camada, usado ao resolver a cadeia de alias. */
const DEFAULT_MODES = { core: null, theme: tm.padrao, ...Object.fromEntries(
  Object.keys(semantic).filter((k) => !k.startsWith('$')).map((k) => [k, sm.padrao]),
) };

// ---------------------------------------------------------------
// VALIDACOES DE FONTE - falham antes de gerar qualquer coisa
// ---------------------------------------------------------------
for (const source of sources) {
  const ext = (source.$extensions && source.$extensions[NS]) || {};
  const layer = ext.camada || '(sem camada)';
  const modes = ext.modeSet ? ext.modeSet.modos : null;
  const list = leaves(source);

  if (ext.contagemEsperada !== undefined && list.length !== ext.contagemEsperada) {
    fail('camada "' + layer + '": ' + list.length + ' tokens, esperado ' + ext.contagemEsperada);
  }

  for (const [p, t] of list) {
    const name = p.join('.');

    if (!HANDLED_TYPES.has(t.$type)) {
      fail('token "' + name + '": $type "' + t.$type + '" nao tratado. Tratados: ' + [...HANDLED_TYPES].join(', '));
    }

    const m = t.$extensions && t.$extensions[NS] && t.$extensions[NS].modes;
    if (m) {
      if (!modes) {
        fail('token "' + name + '": declara modes, mas a camada "' + layer + '" nao declara modeSet');
      } else {
        for (const mode of modes) {
          if (!(mode in m)) fail('token "' + name + '": falta valor para o modo "' + mode + '"');
        }
      }
    }

    const targets = refs(t.$value).concat(Object.values(m || {}).flatMap(refs));
    for (const a of targets) {
      if (!declared.has(a)) fail('token "' + name + '": referencia "{' + a + '}" nao existe em nenhuma fonte');
    }
  }
}

if (errors.length) {
  console.error('FALHA na validacao da fonte:\n' + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}

// ---------------------------------------------------------------
// GERACAO
// ---------------------------------------------------------------

/**
 * O Style Dictionary 5.5.2 serializa `duration` na forma estruturada do DTCG
 * ({ value, unit }) como "[object Object]". A fonte permanece estruturada, como
 * manda o DTCG; a conversao para `250ms` acontece so na saida CSS.
 */
StyleDictionary.registerTransform({
  name: 'nephos/duration/css',
  type: 'value',
  transitive: false,
  filter: (t) => (t.$type || t.type) === 'duration' && t.$value && typeof t.$value === 'object',
  transform: (t) => String(t.$value.value) + String(t.$value.unit),
});

/**
 * P62.4 — decisao de Elvys em 28/08/2026: o gerador emite `rem`, e o
 * `design.md` nao muda. Ate aqui todo `dimension` saia em `px`, e o contrato
 * ja prometia `rem`; quem estava errado era o codigo.
 *
 * A raiz e 16px, como `unidade_css: rem, raiz 16px` do `design.md` declara em
 * tipografia_regras e espacamento_regras.
 *
 * FAMILIAS EM PX POR REGRA PROPRIA, e nao por omissao. Sao DUAS, e cada uma
 * tem a regra escrita no contrato:
 *
 * - `core/radius`, por `raio_regras.unidade_css: px` do `design.md`. Raio em
 *   rem cresceria com a fonte do usuario e a peca mudaria de FORMA, nao de
 *   tamanho: um botao de 6px viraria capsula (P62.5).
 * - `core/shadow-*`, por `elevacao_regras.unidade_css: px`. A fundacao diz,
 *   com todas as letras: "deslocamento, desfoque e spread em px, como o
 *   raio. Sombra nao deve crescer com a fonte do usuario". Entrou em
 *   03-09-2026, com a PF-15.
 *
 * O texto que chamava o raio de unica fundacao em px estava errado desde que
 * `elevacao_regras` existe. Corrigido no `design.md` no mesmo PR.
 */
const REM_ROOT = 16;
const NO_CONVERSION = ['radius', 'shadow-y', 'shadow-blur', 'shadow-spread'];

/** Numero curto: 1.75 e nao 1.7500000000000002, 0 e nao 0.0000. */
function shortNumber(n) {
  return String(Number(n.toFixed(6)));
}

/**
 * Quando este transform roda, o Style Dictionary ja serializou o `dimension`
 * estruturado do DTCG na string "16px" — diferente do `duration`, que ele nao
 * trata. Por isso lemos a string, e nao { value, unit }.
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
 * SOMBRA - por que o transform e proprio, e nao o `shadow/css/shorthand` do
 * Style Dictionary.
 *
 * O built-in monta a shorthand certa, mas quem escreve as referencias e o
 * `outputReferences`, que trabalha por VALOR: ele procura o valor resolvido
 * dentro da string pronta e troca pela `var()`. Numa sombra isso erra de
 * posicao sempre que duas partes tem o mesmo valor - e elas tem. Em
 * `elevation/hairline` (0 1 0 0) o deslocamento X, o desfoque e o spread sao
 * todos zero, e a saida saia com `var(--nph-core-shadow-blur-0)` no lugar do
 * X. O CSS computado ficava certo por coincidencia e a ligacao, errada:
 * mudar o desfoque mexeria no deslocamento.
 *
 * Aqui a shorthand e montada a partir de `original.$value`, que ainda tem as
 * referencias, e cada parte vai para a SUA posicao. O `outputReferences` do
 * arquivo desliga para `shadow` - senao ele tentaria substituir de novo.
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
  // transitivo: o valor tem referencia, e transform nao-transitivo e pulado nesse caso.
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
  const s = set.seletor.replace('{modo}', publicValue || mode);
  return mode === set.padrao ? ':root,\n' + s : s;
};

const { invariants, variants } = classify(semantic, sm.modos, idx, DEFAULT_MODES);

const parts = [];
parts.push('/* camada 1 - core: primitivos, valores literais. Nenhum componente consome daqui. */');
parts.push(await block('core', null, ':root'));

parts.push('\n/* camada de marca - um bloco por vertical da IATec. */');
for (const m of tm.modos) parts.push(await block('theme', m, sel(tm, m)));

parts.push(
  '\n/* camada 2 - semantic, invariantes: alias e valor final iguais em claro e escuro,\n' +
  '   emitidos uma vez. Invariante entre modos NAO quer dizer fixo: um alias para\n' +
  '   theme/* continua trocando com data-nph-brand. */',
);
parts.push(await block('semantic', sm.padrao, ':root', invariants));

parts.push('\n/* camada 2 - semantic, variantes: um bloco por esquema de cor. */');
for (const m of sm.modos) parts.push(await block('semantic', m, sel(sm, m, sm.valorPublico[m]), variants));

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
// VALIDACOES DE SAIDA
// ---------------------------------------------------------------
const outputErrors = [];

const unresolved = css.match(/\{[^}\n]+\}/g);
if (unresolved) {
  outputErrors.push('referencias nao resolvidas na saida: ' + [...new Set(unresolved)].join(', '));
}
if (css.includes('[object Object]')) {
  outputErrors.push('valor serializado como "[object Object]" - tipo DTCG que o Style Dictionary nao converteu');
}

// Nenhum alias pode ser achatado. A regra e por token: quem e referencia na
// fonte TEM de sair como var(--nph-...). Quem e literal na fonte sai literal.
//
// Valor ESCALAR tem uma referencia so, e ela e o valor inteiro: basta exigir
// que a saida comece com `var(`. Valor COMPOSTO - `shadow` - guarda uma
// referencia por parte de cada camada, e a saida e uma shorthand com varias
// `var()` no meio de literais. Para esse, a regra e de CONTAGEM: tantas
// `var(--nph-` na saida quantas referencias a fonte declara. Uma so que
// achatasse em literal derrubaria a conta.
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
    outputErrors.push('alias achatado em literal: ' + name + ' emitido como "' + value + '"');
  }
  if (composites.has(name)) {
    const emitted = value.split('var(--nph-').length - 1;
    const expected = composites.get(name);
    if (emitted !== expected) {
      outputErrors.push('alias achatado em valor composto: ' + name + ' declara ' + expected +
        ' referencia(s) na fonte e emitiu ' + emitted + ' var() em "' + value + '"');
    }
  }
}

// Cada token semantico tem de aparecer: invariante uma vez, variante uma por modo.
for (const name of invariants) {
  const n = (css.match(new RegExp('^\\s*' + cssName(name.split('.')) + ':', 'gm')) || []).length;
  if (n !== 1) outputErrors.push('invariante "' + name + '" emitido ' + n + ' vez(es), esperado 1');
}
for (const name of variants) {
  const n = (css.match(new RegExp('^\\s*' + cssName(name.split('.')) + ':', 'gm')) || []).length;
  if (n !== sm.modos.length) outputErrors.push('variante "' + name + '" emitido ' + n + ' vez(es), esperado ' + sm.modos.length);
}

if (outputErrors.length) {
  console.error('FALHA na validacao da saida:\n' + outputErrors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, css, 'utf8');

const count = (f) => leaves(f).length;
console.log('gerado: ' + OUT);
console.log('fonte OK: tipos tratados, modos completos, referencias existentes, contagem por camada');
console.log('saida OK: sem referencia pendente, sem [object Object], sem alias achatado, ocorrencias por modo corretas');
console.log('camadas: core ' + count(core) + ' + theme ' + count(theme) + ' + semantic ' + count(semantic) +
  ' = ' + (count(core) + count(theme) + count(semantic)));
console.log('semantic: ' + invariants.size + ' invariantes (uma vez em :root) + ' + variants.size + ' variantes (um bloco por modo)');
