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
import { NS, TIPOS_TRATADOS, aliasDe, folhas, refs, indexar, classifica } from './tokens-lib.mjs';

const SRC = 'src/tokens/source';
const OUT = 'src/tokens/generated/tokens.css';

const erros = [];
const falha = (m) => erros.push(m);

const load = (f) => JSON.parse(fs.readFileSync(path.join(SRC, f), 'utf8'));
const core = load('core.tokens.json');
const theme = load('theme.tokens.json');
const semantic = load('semantic.tokens.json');
const fontes = [core, theme, semantic];

const idx = indexar(fontes);
const declarados = new Set(idx.keys());

const tm = theme.$extensions[NS].modeSet;
const sm = semantic.$extensions[NS].modeSet;
/** Modo padrao por prefixo de camada, usado ao resolver a cadeia de alias. */
const PADROES = { core: null, theme: tm.padrao, ...Object.fromEntries(
  Object.keys(semantic).filter((k) => !k.startsWith('$')).map((k) => [k, sm.padrao]),
) };

// ---------------------------------------------------------------
// VALIDACOES DE FONTE - falham antes de gerar qualquer coisa
// ---------------------------------------------------------------
for (const fonte of fontes) {
  const ext = (fonte.$extensions && fonte.$extensions[NS]) || {};
  const camada = ext.camada || '(sem camada)';
  const modos = ext.modeSet ? ext.modeSet.modos : null;
  const lista = folhas(fonte);

  if (ext.contagemEsperada !== undefined && lista.length !== ext.contagemEsperada) {
    falha('camada "' + camada + '": ' + lista.length + ' tokens, esperado ' + ext.contagemEsperada);
  }

  for (const [p, t] of lista) {
    const nome = p.join('.');

    if (!TIPOS_TRATADOS.has(t.$type)) {
      falha('token "' + nome + '": $type "' + t.$type + '" nao tratado. Tratados: ' + [...TIPOS_TRATADOS].join(', '));
    }

    const m = t.$extensions && t.$extensions[NS] && t.$extensions[NS].modes;
    if (m) {
      if (!modos) {
        falha('token "' + nome + '": declara modes, mas a camada "' + camada + '" nao declara modeSet');
      } else {
        for (const modo of modos) {
          if (!(modo in m)) falha('token "' + nome + '": falta valor para o modo "' + modo + '"');
        }
      }
    }

    const alvos = refs(t.$value).concat(Object.values(m || {}).flatMap(refs));
    for (const a of alvos) {
      if (!declarados.has(a)) falha('token "' + nome + '": referencia "{' + a + '}" nao existe em nenhuma fonte');
    }
  }
}

if (erros.length) {
  console.error('FALHA na validacao da fonte:\n' + erros.map((e) => '  - ' + e).join('\n'));
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
const REM_RAIZ = 16;
const SEM_CONVERSAO = ['radius', 'shadow-y', 'shadow-blur', 'shadow-spread'];

/** Numero curto: 1.75 e nao 1.7500000000000002, 0 e nao 0.0000. */
function numeroCurto(n) {
  return String(Number(n.toFixed(6)));
}

/**
 * Quando este transform roda, o Style Dictionary ja serializou o `dimension`
 * estruturado do DTCG na string "16px" — diferente do `duration`, que ele nao
 * trata. Por isso lemos a string, e nao { value, unit }.
 */
const PX = /^(-?\d+(?:\.\d+)?)px$/;

const emPx = (t) => {
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
    !t.path.some((seg) => SEM_CONVERSAO.includes(seg)) &&
    emPx(t) !== null,
  transform: (t) => {
    const px = Number(emPx(t)[1]);
    if (px === 0) return '0';
    return numeroCurto(px / REM_RAIZ) + 'rem';
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
const varDe = (ref) => 'var(--nph-' + ref.split('.').join('-') + ')';

function parteDaSombra(v) {
  const a = aliasDe(v);
  if (a) return varDe(a);
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
    const bruto = t.original && t.original.$value !== undefined ? t.original.$value : t.$value;
    if (typeof bruto === 'string') return bruto;
    const camadas = Array.isArray(bruto) ? bruto : [bruto];
    return camadas
      .map((c) => [c.offsetX, c.offsetY, c.blur, c.spread, c.color].map(parteDaSombra).join(' '))
      .join(', ');
  },
});

const TRANSFORMS = [
  ...StyleDictionary.hooks.transformGroups.css.filter((n) => n !== 'shadow/css/shorthand'),
  'nephos/duration/css',
  'nephos/dimension/rem',
  'nephos/shadow/css',
];

function applyMode(node, modo) {
  if (Array.isArray(node)) return node.slice();
  if (node === null || typeof node !== 'object') return node;
  const out = {};
  for (const [k, v] of Object.entries(node)) out[k] = applyMode(v, modo);
  if ('$value' in out && modo) {
    const m = out.$extensions && out.$extensions[NS] && out.$extensions[NS].modes;
    if (m && modo in m) out.$value = m[modo];
  }
  return out;
}

const famSemantic = new Set(Object.keys(semantic).filter((k) => !k.startsWith('$')));

async function bloco(camada, modo, seletor, subconjunto) {
  const tokens = Object.assign(
    {},
    applyMode(core, null),
    applyMode(theme, camada === 'theme' ? modo : null),
    applyMode(semantic, camada === 'semantic' ? modo : null),
  );
  const daCamada =
    camada === 'core' ? (t) => t.path[0] === 'core'
    : camada === 'theme' ? (t) => t.path[0] === 'theme'
    : (t) => famSemantic.has(t.path[0]);
  const filtro = subconjunto
    ? (t) => daCamada(t) && subconjunto.has(t.path.join('.'))
    : daCamada;

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
          filter: filtro,
          options: {
            outputReferences: (t) => (t.$type || t.type) !== 'shadow',
            selector: seletor,
            showFileHeader: false,
            formatting: { commentStyle: 'none' },
          },
        }],
      },
    },
  }, { verbosity: 'silent', warnings: 'silent' });
  await sd.hasInitialized;
  const arquivos = await sd.formatPlatform('css');
  return arquivos[0].output.trim();
}

const sel = (set, modo, publico) => {
  const s = set.seletor.replace('{modo}', publico || modo);
  return modo === set.padrao ? ':root,\n' + s : s;
};

const { invariantes, variantes } = classifica(semantic, sm.modos, idx, PADROES);

const partes = [];
partes.push('/* camada 1 - core: primitivos, valores literais. Nenhum componente consome daqui. */');
partes.push(await bloco('core', null, ':root'));

partes.push('\n/* camada de marca - um bloco por vertical da IATec. */');
for (const m of tm.modos) partes.push(await bloco('theme', m, sel(tm, m)));

partes.push(
  '\n/* camada 2 - semantic, invariantes: alias e valor final iguais em claro e escuro,\n' +
  '   emitidos uma vez. Invariante entre modos NAO quer dizer fixo: um alias para\n' +
  '   theme/* continua trocando com data-nph-brand. */',
);
partes.push(await bloco('semantic', sm.padrao, ':root', invariantes));

partes.push('\n/* camada 2 - semantic, variantes: um bloco por esquema de cor. */');
for (const m of sm.modos) partes.push(await bloco('semantic', m, sel(sm, m, sm.valorPublico[m]), variantes));

const cabecalho = [
  '/**',
  ' * ARQUIVO GERADO - NAO EDITE.',
  ' * Fonte: src/tokens/source/*.tokens.json',
  ' * Gere de novo com: npm run build:tokens',
  ' */',
  '',
].join('\n');

const css = cabecalho + partes.join('\n') + '\n';

// ---------------------------------------------------------------
// VALIDACOES DE SAIDA
// ---------------------------------------------------------------
const posErros = [];

const naoResolvidas = css.match(/\{[^}\n]+\}/g);
if (naoResolvidas) {
  posErros.push('referencias nao resolvidas na saida: ' + [...new Set(naoResolvidas)].join(', '));
}
if (css.includes('[object Object]')) {
  posErros.push('valor serializado como "[object Object]" - tipo DTCG que o Style Dictionary nao converteu');
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
const nomeCss = (p) => '--nph-' + p.join('-');
const escalares = new Set();
const compostos = new Map();
for (const fonte of [theme, semantic]) {
  for (const [p, t] of folhas(fonte)) {
    const m = (t.$extensions && t.$extensions[NS] && t.$extensions[NS].modes) || {};
    const valores = [t.$value].concat(Object.values(m));
    if (!valores.some((v) => refs(v).length > 0)) continue;
    if (Array.isArray(t.$value)) compostos.set(nomeCss(p), refs(t.$value).length);
    else escalares.add(nomeCss(p));
  }
}
for (const linha of css.match(/--nph-[\w-]+:[^;]+;/g) || []) {
  const nome = linha.slice(0, linha.indexOf(':'));
  const valor = linha.slice(linha.indexOf(':') + 1, -1).trim();
  if (escalares.has(nome) && !valor.startsWith('var(')) {
    posErros.push('alias achatado em literal: ' + nome + ' emitido como "' + valor + '"');
  }
  if (compostos.has(nome)) {
    const emitidas = valor.split('var(--nph-').length - 1;
    const esperadas = compostos.get(nome);
    if (emitidas !== esperadas) {
      posErros.push('alias achatado em valor composto: ' + nome + ' declara ' + esperadas +
        ' referencia(s) na fonte e emitiu ' + emitidas + ' var() em "' + valor + '"');
    }
  }
}

// Cada token semantico tem de aparecer: invariante uma vez, variante uma por modo.
for (const nome of invariantes) {
  const n = (css.match(new RegExp('^\\s*' + nomeCss(nome.split('.')) + ':', 'gm')) || []).length;
  if (n !== 1) posErros.push('invariante "' + nome + '" emitido ' + n + ' vez(es), esperado 1');
}
for (const nome of variantes) {
  const n = (css.match(new RegExp('^\\s*' + nomeCss(nome.split('.')) + ':', 'gm')) || []).length;
  if (n !== sm.modos.length) posErros.push('variante "' + nome + '" emitido ' + n + ' vez(es), esperado ' + sm.modos.length);
}

if (posErros.length) {
  console.error('FALHA na validacao da saida:\n' + posErros.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, css, 'utf8');

const conta = (f) => folhas(f).length;
console.log('gerado: ' + OUT);
console.log('fonte OK: tipos tratados, modos completos, referencias existentes, contagem por camada');
console.log('saida OK: sem referencia pendente, sem [object Object], sem alias achatado, ocorrencias por modo corretas');
console.log('camadas: core ' + conta(core) + ' + theme ' + conta(theme) + ' + semantic ' + conta(semantic) +
  ' = ' + (conta(core) + conta(theme) + conta(semantic)));
console.log('semantic: ' + invariantes.size + ' invariantes (uma vez em :root) + ' + variantes.size + ' variantes (um bloco por modo)');
