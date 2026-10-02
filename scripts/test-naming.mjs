#!/usr/bin/env node
/**
 * Prova da P64: nome tecnico em portugues reprova.
 *
 * Confere, em src/, stories/, .storybook/ e scripts/:
 *   - todo identificador do codigo (.ts, .js, .mjs, .cjs), pelo AST do TypeScript;
 *   - todo literal e regex literal sem espaco (valor tecnico: id, chave, estado,
 *     caminho), inclusive template com ${...};
 *   - em marcacao (template html``/svg``, .html, string com atributo ou fecho de tag): tag de componente,
 *     nome de atributo, de evento (@x) e de propriedade (.x, ?x), valor de atributo
 *     de id (class, part, id, for, slot, name, aria-* de id, data-*), valor de
 *     atributo de componente, href="#id", e o CSS do style="..." e do <style>;
 *   - em CSS (.css, <style>, style="...", css``, folha de estilo em string,
 *     unsafeCSS/replaceSync/insertRule e argumento de seletor): seletor de classe,
 *     de id e de tipo de custom element, ::part, :state, ::highlight, atributo,
 *     custom property, @keyframes, animation, @container, @layer, contadores e grid;
 *   - lista de classe montada: className, setAttribute('class'|'part'|'id'...),
 *     clsx/cn/cx/classnames, { className }; estilo por propriedade (el.style.x,
 *     setProperty, objeto de estilo), inclusive por ternario e concatenacao;
 *   - argumento de seletor: querySelector(All), closest, matches (e .call), os
 *     decorators @query/@queryAll/@queryAsync, `selector:` e constante *Selector;
 *   - o <script> e os on* de .html, pelo AST;
 *   - o nome de cada pasta e arquivo; os nomes de script do package.json.
 *
 * Extensao fora de KNOWN_EXTENSIONS reprova: arquivo de tipo novo (.tsx, .scss, .mdx,
 * .svg...) so entra depois que esta regra aprender a le-lo, com caso no autoteste.
 * Arquivo sem extensao (LICENSE, script com #!) tambem reprova. Arquivo oculto vale pela
 * extensao (.config.yaml reprova); oculto sem extensao (.gitkeep) e conferido so pelo nome.
 *
 * Fica fora, pela P64: comentario, mensagem (argumento direto de console, throw,
 * Error, saida do processo, fail/warn com texto), descricao de teste, o texto dos
 * dicionarios de .storybook/i18n/ e as chaves de sidebar (IDs de story), title e
 * name da propria story e texto corrido (literal com espaco que nao e lista de
 * classe, seletor, estilo nem marcacao).
 *
 * Fica fora por ser contrato ou documentacao: o conteudo de .json (chaves dos
 * tokens, P20; Metadata gerada, P63) e de .md.
 *
 * Limite conhecido: palavra colada sem separador (modoescuro, botaoprimario) e palavra
 * que nao esta no vocabulario nem tem fim tipico do portugues passam. Toda palavra que
 * uma revisao achar entra em scripts/naming-vocabulary.json, e o caso entra em
 * scripts/fixtures/naming/cases.json, que roda antes da varredura.
 *
 * Contrato que continua em portugues entra em scripts/naming-exceptions.json,
 * com uma classe da lista fechada CLASSES. Excecao sem uso tambem reprova, para
 * a lista nao guardar nome que ja saiu do codigo.
 *
 * Rode com: npm run test:naming
 * Listar tudo o que a regra ve, com ou sem excecao: npm run test:naming -- --list
 */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ts = require('typescript');

/** Raiz do repositorio: o script roda igual de qualquer pasta. */
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const ROOTS = ['src', 'stories', '.storybook', 'scripts'];
/** Gerados: o nome sai de outra fonte, que ja e conferida (tokens JSON, ficha). */
const SKIPPED_DIRS = new Set(['node_modules', 'storybook-static', 'src/tokens/generated', 'src/shared/metadata']);
/** Tipos de arquivo que esta regra sabe ler. Outro tipo reprova ate a regra aprender. */
const CODE_EXTENSIONS = new Set(['ts', 'js', 'mjs', 'cjs']);
const KNOWN_EXTENSIONS = new Set([...CODE_EXTENSIONS, 'css', 'html', 'json', 'md']);
/** Diretorios do contrato do verificador (V28, V30, V31): isentos so em scripts/fixtures/operations/. */
const CONTRACT_DIRS = new Set(['tarefas', 'evidencias', 'contextos', 'fichas']);
const OPERATIONS_FIXTURES = 'scripts/fixtures/operations/';
/** Nome de evidencia: <gate>-<AAAA-MM-DD>.md (docs/operacao/README.md). */
const EVIDENCE_NAME = /^[a-z0-9-]+-\d{4}-\d{2}-\d{2}\.md$/;
const DICTIONARIES = new Set(['.storybook/i18n/pt-BR.js', '.storybook/i18n/en.js', '.storybook/i18n/es.js']);
const EXCEPTIONS_FILE = 'scripts/naming-exceptions.json';
const SELF_TEST_FILE = 'scripts/fixtures/naming/cases.json';

const CLASSES = {
  'story-export': 'exportacao de story: gera o ID e o permalink',
  'storybook-id': 'ID, titulo ou chave de navegacao do Storybook',
  anchor: 'id de secao usado como ancora de URL',
  'operation-schema': 'chave ou valor do schema de docs/operacao (P64, fora da regra)',
  'token-schema': 'chave, modo ou marca do JSON dos tokens (P20, P64)',
  'spec-schema': 'chave ou valor do YAML da ficha e da Metadata (P63, P64)',
  'design-md': 'chave lida do design.md',
  'i18n-header': 'formato do cabecalho das traducoes (test-i18n)',
  cli: 'nome de script npm, bandeira ou arquivo citado em comando gravado em docs/operacao/',
  'contract-path': 'diretorio do contrato do verificador, citado pelo proprio verificador',
  'output-text': 'palavra impressa na saida de um script',
  'ui-text': 'texto exibido ou de exemplo, numa palavra so',
};

/*
 * Vocabulario PT, fins tipicos e a lista fechada de palavras inglesas com esses fins
 * ficam em scripts/naming-vocabulary.json, que diz tambem o que fica de fora e por que.
 */
const VOCABULARY = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'scripts/naming-vocabulary.json'), 'utf8'));
const PT_WORDS = new Set(VOCABULARY.portuguese);
/** Fim tipico do portugues; palavra inglesa com o mesmo fim fica numa lista FECHADA, palavra a palavra. */
const PT_ENDING = new RegExp(`(?:${VOCABULARY.portugueseEndings.join('|')})$`);
const EN_SAME_ENDING = new Set(VOCABULARY.englishSameEnding);
/** Palavra inglesa de codigo que as regras acima confundiriam (indices = plural de indice). */
const EN_WORDS = new Set(VOCABULARY.english);

function isPtWord(word) {
  const w = word.toLowerCase();
  if (w.length < 2) return false;
  if (EN_WORDS.has(w)) return false;
  if (/[à-ÿ]/.test(w)) return true;
  if (PT_WORDS.has(w)) return true;
  /* Plural em -s de palavra do vocabulario (rodape → rodapes, seta → setas). */
  if (w.endsWith('s') && PT_WORDS.has(w.slice(0, -1))) return true;
  return w.length > 3 && PT_ENDING.test(w) && !isEnglishSameEnding(w);
}

/** Palavra inglesa da lista, ou o plural dela em -s/-es (tornados, avocados, potatoes). */
function isEnglishSameEnding(w) {
  return EN_SAME_ENDING.has(w) || (w.endsWith('s') && EN_SAME_ENDING.has(w.slice(0, -1))) ||
    (w.endsWith('es') && EN_SAME_ENDING.has(w.slice(0, -2)));
}

function words(name) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .split(/[^A-Za-z\u00C0-\u00FF]+/)
    .filter(Boolean);
}
const hasPt = (name) => words(name).some(isPtWord);

/** Atributos cujo valor e nome tecnico (classe, part, id ou referencia a id). aria-label e texto. */
const ID_ATTRS = ['class', 'part', 'exportparts', 'id', 'for', 'slot', 'name', 'aria-labelledby', 'aria-describedby',
  'aria-controls', 'aria-owns', 'aria-activedescendant', 'aria-details', 'aria-errormessage', 'popovertarget', 'list',
  'form', 'headers', 'commandfor', 'interestfor', 'anchor', 'itemref'];
const ID_ATTR_NAME = new RegExp(`^(?:${ID_ATTRS.join('|')})$|^data-`);
/**
 * Atributos cujo valor e texto exibido: ficam fora, pela P64. `text` e o texto do
 * nph-label (API da P62.3). value e content sao valor tecnico e continuam na regra.
 */
const TEXT_ATTRS = new Set(['title', 'alt', 'placeholder', 'aria-label', 'aria-description', 'aria-roledescription',
  'aria-valuetext', 'label', 'text']);
/**
 * Elementos HTML, SVG e MathML. Fora deles, tag sem hifen e texto: '<nome do arquivo>' num texto de
 * ajuda nao tem atributos.
 */
const HTML_ELEMENTS = new Set(`a abbr address area article aside audio b base bdi bdo blockquote body br button
canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset
figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd label
legend li link main map mark menu meta meter nav noscript object ol optgroup option output p picture pre
progress q rp rt ruby s samp script search section select slot small source span strong style sub summary sup
table tbody td template textarea tfoot th thead time title tr track u ul var video wbr svg g path circle rect
line polyline polygon ellipse text tspan textpath use symbol defs clippath mask pattern lineargradient
radialgradient stop image foreignobject filter marker desc metadata switch view set animate animatemotion
animatetransform mpath feblend fecolormatrix fecomponenttransfer fecomposite feconvolvematrix fediffuselighting
fedisplacementmap fedistantlight fedropshadow feflood fefunca fefuncb fefuncg fefuncr fegaussianblur feimage
femerge femergenode femorphology feoffset fepointlight fespecularlighting fespotlight fetile feturbulence math
mi mn mo ms mtext mrow msub msup msubsup mfrac msqrt mroot mtable mtr mtd semantics annotation selectedcontent`.split(/\s+/));
/**
 * Propriedades CSS conhecidas, em kebab-case: as de CSSStyleDeclaration no lib.dom do
 * TypeScript. Folha de estilo em string so conta se toda declaracao usar uma delas.
 */
const CSS_PROPERTIES = (() => {
  const dom = fs.readFileSync(require.resolve('typescript/lib/lib.dom.d.ts'), 'utf8');
  const start = dom.indexOf('interface CSSStyleDeclaration {');
  const block = dom.slice(start, dom.indexOf('\n}', start));
  return new Set([...block.matchAll(/^\s+(\w+): string;/gm)].map((m) => m[1].replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)));
})();
/** Propriedades CSS cujo valor tem nomes; o estilo por propriedade (el.style.x) usa o mesmo mapa. */
const STYLE_PROPS = {
  animation: 'animation', animationName: 'animation-name', gridTemplateAreas: 'grid-template-areas',
  gridTemplate: 'grid-template', grid: 'grid', gridArea: 'grid-area', gridRow: 'grid-row', gridColumn: 'grid-column',
  gridRowStart: 'grid-row-start', gridRowEnd: 'grid-row-end', gridColumnStart: 'grid-column-start',
  gridColumnEnd: 'grid-column-end', container: 'container', containerName: 'container-name',
  viewTransitionName: 'view-transition-name', viewTransitionClass: 'view-transition-class',
  counterReset: 'counter-reset', counterIncrement: 'counter-increment', counterSet: 'counter-set',
  listStyle: 'list-style', listStyleType: 'list-style-type', fontFamily: 'font-family',
};
const CSS_NAMES = new Set(Object.values(STYLE_PROPS));

const blank = (c) => c.replace(/[^\n]/g, ' ');
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\/|<!--[\s\S]*?-->/g, blank);

/**
 * Tokens tecnicos de um texto com espaco. Devolve { value, index } para o chamador achar a
 * linha. `css`: o texto e CSS; so nele valem os seletores e os nomes de CSS. `markup`: le tag,
 * atributo e valor; o style="..." e o <style> sao lidos como CSS.
 */
function technicalTokensAt(rawText, { css = false, markup = true } = {}) {
  const text = stripComments(rawText);
  const out = [];
  const push = (value, index) => { if (value) out.push({ value, index }); };
  const each = (re, fn) => { for (const m of text.matchAll(re)) fn(m); };
  const idents = (chunk, index) => {
    for (const v of chunk.split(/[\s,/]+/)) if (/^[a-zA-Z_\u0001][\w\u0001-]*$/.test(v)) push(v, index);
  };
  const sub = (chunk, start) => { for (const t of technicalTokensAt(chunk, { css: true })) push(t.value, start + t.index); };

  each(/(--[a-z\u0001][\w\u0001-]*)/g, (m) => push(m[1], m.index));
  /* data-x so em CSS ou marcacao: '<data-inicial>' num texto de uso nao e atributo. */
  if (css || markup) each(/\b(data-[a-z\u0001][\w\u0001-]*)/g, (m) => push(m[1], m.index));

  if (css) {
    /* Valor de declaracao sem string: para no ; } { e na aspa ou no < de um style="..." */
    const VALUE = `([^;}{"'<>]+)`;
    /* Seletor de tipo de custom element: ident com hifen em posicao de seletor, numa lista que
     * abre bloco ({ adiante; [atributo] e string contam como parte do seletor; ; e } fecham).
     * O ident pode ter o marcador de ${} (nph-rotulo-${v}). */
    each(/(?:^|[\s,>+~(){};])([a-z][a-z0-9]*-[\w\u0001-]*)(?=(?:[^};"'[]|\[(?:[^\]"']|"[^"]*"|'[^']*')*\]|"[^"]*"|'[^']*')*\{)(?=\s*[,{.:#[>+~)]|\s+[a-z*&\u0001])/g,
      (m) => push(m[1], m.index + m[0].length - m[1].length));
    /* Classe e id: ponto ou # que nao e parte de numero isolado (1.5rem, #1f2). */
    each(/(?<!(?:^|[^\w.-])\d+)\.([a-zA-Z_\u0001][\w\u0001-]*)/g, (m) => push('.' + m[1], m.index));
    /* Cor hex tem 3, 4, 6 ou 8 digitos e nao abre bloco: #decada { } e id, color: #decada e cor. */
    each(/#([a-zA-Z\u0001][\w\u0001-]*)(?=(\s*\{)?)/g, (m) => {
      if (m[2] || !/^(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(m[1])) push('#' + m[1], m.index);
    });
    each(/::part\(([^)]*)\)|:state\(([^)]*)\)|::highlight\(([^)]*)\)/g, (m) => idents(m[1] ?? m[2] ?? m[3], m.index));
    each(/\[([\w-]+)\s*[~|^$*]?=\s*["']?([^"'\]]+)/g, (m) => { push(m[1], m.index); idents(m[2], m.index); });
    each(/@keyframes\s+["']?([\w\u0001-]+)/g, (m) => push(m[1], m.index));
    each(/@counter-style\s+([\w\u0001-]+)/g, (m) => push(m[1], m.index));
    each(/@page\s+([a-zA-Z_\u0001][\w\u0001-]*)/g, (m) => push(m[1], m.index));
    each(/@container\s+([a-zA-Z_\u0001][\w\u0001-]*)/g, (m) => push(m[1], m.index));
    each(/@layer\s+([^{;]+)/g, (m) => idents(m[1].replace(/\./g, ' '), m.index));
    each(/\blayer\(([^)]*)\)/g, (m) => idents(m[1].replace(/\./g, ' '), m.index));
    each(/\bcounters?\(\s*([a-zA-Z_\u0001][\w\u0001-]*)/g, (m) => push(m[1], m.index));
    /* Linha nomeada de grid: [inicio] 1fr [fim]. */
    each(/\[([a-zA-Z_\u0001][\w\u0001-]*(?:\s+[a-zA-Z_\u0001][\w\u0001-]*)*)\]/g, (m) => idents(m[1], m.index));
    each(new RegExp(`\\b(?:animation|animation-name|container|container-name|grid-area|grid-row|grid-row-start|grid-row-end|grid-column|grid-column-start|grid-column-end|view-transition-name|view-transition-class|list-style-type|counter-reset|counter-increment|counter-set)\\s*:\\s*${VALUE}`, 'g'),
      (m) => idents(m[1], m.index));
    each(/\b(?:list-style|font-family)\s*:\s*([^;}{<>]+)/g, (m) => idents(m[1].replace(/"[^"]*"|'[^']*'/g, ' '), m.index));
    /* Areas de grid: grid-template-areas e os atalhos grid-template e grid, com as strings. */
    each(/\b(?:grid-template-areas|grid-template|grid)\s*:\s*([^;}{<>]+)/g, (m) => {
      for (const q of m[1].matchAll(/"([^"]*)"|'([^']*)'/g)) idents(q[1] ?? q[2], m.index);
    });
  }

  /* Marcacao: tag, atributos, valores de id, href="#x", style="..." e <style>. A aspa pode ficar
   * aberta no fim do texto: '<i class="botao-ativo ' + x + '">' parte o atributo em dois literais. */
  if (markup) each(/<\/?([a-zA-Z][\w-]*)((?:[^<>"']|"[^"]*"|'[^']*'|"[^"]*$|'[^']*$)*)/g, (m) => {
    const tag = m[1];
    const attrs = m[2];
    const at = m.index;
    if (!tag.includes('-') && !HTML_ELEMENTS.has(tag.toLowerCase())) return;
    if (tag.includes('-')) push(tag, at);
    for (const a of attrs.matchAll(/([@?.]?)([a-zA-Z_][\w:.-]*)(?:\s*=\s*(?:"([^"]*)"?|'([^']*)'?|([^\s"'=`]+)))?/g)) {
      const [, prefix, name, d, s, bare] = a;
      const value = d ?? s ?? bare;
      push(name, at);
      if (value === undefined || prefix) continue;
      const valueAt = at + tag.length + 1 + a.index + a[0].length - value.length;
      if (name === 'style') sub(value, valueAt);
      else if (/(?:^|:)href$/.test(name)) { const frag = /^#([\w-]+)$/.exec(value); if (frag) push(frag[1], at); }
      else if (ID_ATTR_NAME.test(name)) for (const v of value.split(/[\s,:]+/)) push(v, at);
      /* Valor de componente: um valor tecnico (variant="primary"); com espaco e texto (hint="Digite o nome"). */
      else if (tag.includes('-') && !TEXT_ATTRS.has(name) && !/\s/.test(value.trim())) push(value.trim(), at);
    }
  });
  if (!css) {
    for (const m of text.matchAll(/(<style\b[^>]*>)([\s\S]*?)(?:<\/style>|$)/gi)) sub(m[2], m.index + m[1].length);
  }
  return out;
}
const technicalTokens = (text, options) => technicalTokensAt(text, options).map((t) => t.value);

/**
 * Folha de estilo em string, onde quer que esteja: sem comentario, o literal inteiro e uma
 * sequencia de regras seletor { ... } com chaves balanceadas, aninhadas ou vazias, e ao menos
 * uma declaracao usa propriedade conhecida: do lib.dom, de fornecedor (-webkit-x) ou --custom.
 * Propriedade que o lib.dom ainda nao tem passa se nao for palavra PT; composta (anchor-name) conta
 * como conhecida.
 * Texto corrido com chaves ("Seja bem-vindo, {usuario: nome}") nao e folha.
 */
function isStylesheetText(raw) {
  const text = stripComments(raw);
  if (!/^\s*[^\s{}<;]/.test(text) || !/\}\s*$/.test(text)) return false;
  let depth = 0;
  for (const ch of text) {
    if (ch === '{') depth++;
    else if (ch === '}' && --depth < 0) return false;
    else if (depth === 0 && (ch === ';' || ch === '<')) return false;
  }
  if (depth !== 0) return false;
  /* Declaracao: prop: valor ate ; ou }. Seletor aninhado com pseudo (a:hover {) nao e declaracao. */
  const props = [...text.matchAll(/[{;]\s*(-?[\w-]+)\s*:[^;{}]*(?=[;}])/g)].map((m) => m[1]);
  /* Conhecida: do lib.dom, de fornecedor, --custom, ou composta com hifen e sem palavra PT (anchor-name). */
  const known = (p) => p.startsWith('-') || CSS_PROPERTIES.has(p) || (p.includes('-') && !hasPt(p));
  return props.some(known) && props.every((p) => known(p) || !hasPt(p));
}

function walk(dir, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.posix.join(dir, entry.name);
    if (SKIPPED_DIRS.has(entry.name) || SKIPPED_DIRS.has(rel)) continue;
    if (entry.isDirectory()) walk(rel, acc);
    else acc.push(rel);
  }
  return acc;
}

/** Sobe pelas expressoes que so repassam o valor: parenteses, ternario, + && || ??. */
const PASS_OPERATORS = new Set([ts.SyntaxKind.PlusToken, ts.SyntaxKind.AmpersandAmpersandToken,
  ts.SyntaxKind.BarBarToken, ts.SyntaxKind.QuestionQuestionToken]);
function climb(start) {
  let node = start;
  while (node.parent && (ts.isParenthesizedExpression(node.parent) || ts.isConditionalExpression(node.parent) ||
    ts.isAsExpression(node.parent) || ts.isNonNullExpression(node.parent) ||
    (ts.isBinaryExpression(node.parent) && PASS_OPERATORS.has(node.parent.operatorToken.kind)))) node = node.parent;
  return node;
}
const calleeOf = (call) => call.expression.getText().replace(/\?\./g, '.');

const MESSAGE_CALLEE = /^(console\.\w+|process\.(stdout|stderr)\.write|describe|it|test)(\.\w+)?$/;
/** Funcoes locais de relato (verificar-operacao: fail; e afins): so texto corrido conta como mensagem. */
const LOCAL_MESSAGE_CALLEE = /^(fail|warn)$/;
/**
 * Mensagem e so o argumento DIRETO de console, throw, Error, saida do processo ou
 * descricao de teste, inclusive montado por template, concatenacao ou ternario. Literal
 * dentro de objeto, array, comparacao ou funcao passada como argumento nao e mensagem.
 * Em fail/warn, so o texto com espaco: fail('rotulo') e valor tecnico.
 */
function isInsideMessage(node, text = '') {
  let child = node;
  for (let p = node.parent; p; child = p, p = p.parent) {
    if (ts.isThrowStatement(p)) return true;
    if (ts.isNewExpression(p) && /Error$/.test(p.expression.getText())) return (p.arguments ?? []).includes(child);
    if (ts.isCallExpression(p)) {
      if (!p.arguments.includes(child)) return false;
      const callee = calleeOf(p);
      return MESSAGE_CALLEE.test(callee) || (LOCAL_MESSAGE_CALLEE.test(callee) && /\s/.test(text));
    }
    const passThrough = ts.isTemplateSpan(p) || ts.isTemplateExpression(p) || ts.isParenthesizedExpression(p) ||
      (ts.isBinaryExpression(p) && p.operatorToken.kind === ts.SyntaxKind.PlusToken) ||
      (ts.isConditionalExpression(p) && p.condition !== child);
    if (!passThrough) return false;
  }
  return false;
}

/**
 * Literal que e seletor CSS: 1o argumento de querySelector, querySelectorAll, closest,
 * matches (2o em .call), dos decorators @query/@queryAll/@queryAsync; `selector:`; ou o
 * valor de uma constante ou propriedade cujo nome termina em Selector/SELECTOR.
 */
function isSelectorArgument(start) {
  const node = climb(start);
  const p = node.parent;
  if (!p) return false;
  if ((ts.isPropertyAssignment(p) || ts.isVariableDeclaration(p) || ts.isPropertyDeclaration(p)) && p.initializer === node) {
    return /selector$/i.test(p.name.getText().replace(/['"]/g, ''));
  }
  if (!ts.isCallExpression(p)) return false;
  const callee = calleeOf(p);
  if (/\.(?:querySelector|querySelectorAll|closest|matches)\.call$/.test(callee)) return p.arguments[1] === node;
  return p.arguments[0] === node && /(?:\.(?:querySelector|querySelectorAll|closest|matches)|^(?:query|queryAll|queryAsync))$/.test(callee);
}

/** Literal que e CSS por ser argumento de unsafeCSS, replaceSync ou insertRule. */
function isCssArgument(start) {
  const node = climb(start);
  const p = node.parent;
  return Boolean(p && ts.isCallExpression(p) && p.arguments[0] === node &&
    /(?:(?:^|\.)unsafeCSS|\.(?:replaceSync|insertRule))$/.test(calleeOf(p)));
}

/** Texto do template logo antes de uma interpolacao ${...}. */
function textBeforeSpan(span) {
  const template = span.parent;
  const i = template.templateSpans.indexOf(span);
  return i === 0 ? template.head.text : template.templateSpans[i - 1].literal.text;
}

/** Literal com espaco que vira lista de classe, part ou id: el.className = '...', setAttribute('class', '...'). */
function isClassList(start) {
  const node = climb(start);
  const p = node.parent;
  if (!p) return false;
  /* Classe condicional do Lit: class=${c ? 'a b' : 'c'} ou class="x ${...}". O texto antes da
   * interpolacao abre o atributo e ainda nao o fechou. */
  if (ts.isTemplateSpan(p) && p.expression === node) {
    return new RegExp(`\\b(?:${ID_ATTRS.join('|')}|data-[\\w-]+)\\s*=\\s*(?:"[^"]*|'[^']*)?$`).test(textBeforeSpan(p));
  }
  if (ts.isBinaryExpression(p) && p.right === node) return /\.className$/.test(p.left.getText());
  /* Objeto de props ou de classMap: { className: 'a b' }, { class: 'a b' }. */
  if (ts.isPropertyAssignment(p) && p.initializer === node) return /^['"]?(className|class)['"]?$/.test(p.name.getText());
  if (ts.isCallExpression(p) && p.arguments.includes(node)) {
    const callee = calleeOf(p);
    if (/(^|\.)(clsx|cn|cx|classnames|classNames)$/.test(callee)) return true;
    if (/\.setAttribute$/.test(callee) && p.arguments[1] === node) {
      const attrName = p.arguments[0];
      return ts.isStringLiteralLike(attrName) && ID_ATTR_NAME.test(attrName.text);
    }
  }
  return false;
}

/**
 * Propriedade de estilo cujo valor tem nomes: el.style.x = '...' (ou +=), el.style['x'] = '...',
 * setProperty('x', '...') ou { x: '...' } num objeto de estilo. Devolve o nome CSS, ou
 * 'cssText' quando o valor e uma lista de declaracoes (el.style.cssText, setAttribute('style')):
 * "cssText: grid-area: x;" le os nomes de cada declaracao do mesmo jeito.
 */
const ASSIGN_OPERATORS = new Set([ts.SyntaxKind.EqualsToken, ts.SyntaxKind.PlusEqualsToken]);
function styleProperty(start) {
  const node = climb(start);
  const p = node.parent;
  if (!p) return null;
  /* style=${'grid-area: x'} ou style="${...}" num template do Lit: lista de declaracoes. */
  if (ts.isTemplateSpan(p) && p.expression === node) return /\bstyle\s*=\s*(?:"[^"]*|'[^']*)?$/.test(textBeforeSpan(p)) ? 'cssText' : null;
  const cssName = (key) => (key === 'cssText' ? key : key ? STYLE_PROPS[key] ?? (CSS_NAMES.has(key) ? key : null) : null);
  if (ts.isCallExpression(p) && /\.setAttribute$/.test(calleeOf(p)) && p.arguments[1] === node) {
    const a = p.arguments[0];
    return ts.isStringLiteralLike(a) && a.text === 'style' ? 'cssText' : null;
  }
  if (ts.isBinaryExpression(p) && p.right === node && ASSIGN_OPERATORS.has(p.operatorToken.kind)) {
    /* (el.style as any)['x'] tambem: sem a conversao de tipo e sem os parenteses. */
    const left = p.left.getText().replace(/\s+as\s+[^)]*/g, '').replace(/\)/g, '');
    const m = /\.style(?:\.(\w+)|\[\s*['"`]([\w-]+)['"`]\s*\])$/.exec(left);
    return m ? cssName(m[1] ?? m[2]) : null;
  }
  if (ts.isPropertyAssignment(p) && p.initializer === node) return cssName(p.name.getText().replace(/['"]/g, ''));
  if (ts.isCallExpression(p) && /\.setProperty$/.test(calleeOf(p)) && p.arguments[1] === node) {
    const a = p.arguments[0];
    return ts.isStringLiteralLike(a) ? cssName(a.text) : null;
  }
  return null;
}

/**
 * title e name da PROPRIA story ficam fora (texto do Storybook): propriedade direta do
 * objeto do `export default`, de uma constante exportada de nivel 1 (a story) ou da
 * constante que o `export default` exporta (meta). `args.name`, e name de qualquer outro
 * objeto, e valor de propriedade e continua na regra.
 */
function isStoryTitleOrName(node) {
  const p = node.parent;
  if (!(p && ts.isPropertyAssignment(p) && p.initializer === node)) return false;
  if (!['title', 'name'].includes(p.name.getText().replace(/['"]/g, ''))) return false;
  let holder = p.parent;
  while (holder.parent && (ts.isAsExpression(holder.parent) || ts.isSatisfiesExpression(holder.parent) || ts.isParenthesizedExpression(holder.parent))) {
    holder = holder.parent;
  }
  const owner = holder.parent;
  if (ts.isExportAssignment(owner)) return true;
  if (!(ts.isVariableDeclaration(owner) && ts.isVariableStatement(owner.parent?.parent) && ts.isSourceFile(owner.parent.parent.parent))) return false;
  const statement = owner.parent.parent;
  const exported = statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
  const isDefaultExported = statement.parent.statements.some((st) => ts.isExportAssignment(st) && st.expression.getText() === owner.name.getText());
  return Boolean(exported || isDefaultExported);
}

function insideProperty(node, names) {
  for (let p = node.parent; p; p = p.parent) {
    if (ts.isPropertyAssignment(p) && names.includes(p.name.getText().replace(/['"]/g, ''))) return true;
  }
  return false;
}

function scan(root = '.') {
  const prev = process.cwd();
  process.chdir(root);
  try {
    const hits = [];
    /* O marcador de ${...} sai como ${} em todo papel: visivel na saida e escrevivel na excecao.
     * NFC: acento decomposto (nome de arquivo vindo do macOS) vira a letra acentuada. */
    const add = (file, line, raw, role) => {
      const name = raw.replace(/\u0001/g, '${}').normalize('NFC');
      if (hasPt(name)) hits.push({ file, line, name, role });
    };
    const lineAt = (src, index) => src.slice(0, index).split('\n').length;
    const files = ROOTS.filter((r) => fs.existsSync(r)).flatMap((r) => walk(r, []));

    /* Pasta, arquivo e extensao. Diretorio do contrato do verificador e nome de evidencia so ficam
     * fora dentro de scripts/fixtures/operations/, onde o verificador os exige. */
    for (const file of files) {
      const parts = file.split('/');
      const inOperations = file.startsWith(OPERATIONS_FIXTURES);
      const base = parts[parts.length - 1];
      /* O ponto inicial de um arquivo oculto nao separa extensao: .config.yaml tem extensao yaml.
       * Oculto sem extensao (.gitkeep) e marcador de ferramenta: vale so o nome. */
      const stem = base.replace(/^\./, '');
      const ext = stem.includes('.') ? stem.split('.').pop() : '';
      const marker = !ext && base.startsWith('.');
      if (!marker && !KNOWN_EXTENSIONS.has(ext)) hits.push({ file, line: 0, name: ext ? `*.${ext}` : '(sem extensao)', role: 'extension' });
      parts.forEach((seg, i) => {
        const isLast = i === parts.length - 1;
        if (!isLast && inOperations && CONTRACT_DIRS.has(seg)) return;
        if (isLast && inOperations && EVIDENCE_NAME.test(seg)) return;
        add(file, 0, isLast && ext ? seg.slice(0, -(ext.length + 1)) : seg, isLast ? 'file' : 'folder');
      });
    }

    /* Codigo: um arquivo .ts/.js, ou um pedaco de codigo dentro de .html (<script> e on*). */
    const scanCode = (file, src, lineOffset = 0) => {
      const kind = file.endsWith('.ts') ? ts.ScriptKind.TS : ts.ScriptKind.JS;
      const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, kind);
      const line = (n) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1 + lineOffset;
      const isDictionary = DICTIONARIES.has(file);
      const isStory = /\.stories\.\w+$/.test(file);
      const visit = (node) => {
        if (ts.isIdentifier(node) || ts.isPrivateIdentifier(node)) {
          /* Nome de propriedade (acesso, chave, assinatura, campo, metodo, desestruturacao com
           * alias) tem papel proprio: excecao de chave de schema nao cobre variavel local. */
          const p = node.parent;
          const isProperty = p && (
            (ts.isPropertyAccessExpression(p) && p.name === node) ||
            ((ts.isPropertyAssignment(p) || ts.isPropertySignature(p) || ts.isPropertyDeclaration(p) ||
              ts.isMethodDeclaration(p) || ts.isMethodSignature(p)) && p.name === node) ||
            (ts.isBindingElement(p) && p.propertyName === node));
          if (!(isDictionary && insideProperty(node, ['sidebar']))) add(file, line(node), node.text, isProperty ? 'property' : 'identifier');
        } else if (ts.isRegularExpressionLiteral(node)) {
          /* Regex literal: o corpo, sem as barras e as flags. */
          if (!isInsideMessage(node)) add(file, line(node), node.text.slice(1, node.text.lastIndexOf('/')), 'regex');
        } else if (ts.isStringLiteralLike(node) || ts.isTemplateExpression(node) || ts.isTemplateLiteralTypeNode(node)) {
          /* Template com ${...} (valor ou tipo): o texto inteiro, com cada interpolacao trocada
           * por um marcador que nao e espaco. Assim um caminho montado continua sendo valor
           * tecnico, e um atributo cortado por ${...} continua inteiro. */
          const text = ts.isTemplateExpression(node) || ts.isTemplateLiteralTypeNode(node)
            ? node.head.text + node.templateSpans.map((span) => '\u0001' + span.literal.text).join('')
            : (node.text ?? '');
          const p = node.parent;
          const isKey = p && (ts.isPropertyAssignment(p) || ts.isPropertySignature(p)) && p.name === node;
          const isStoryName = p && ts.isBinaryExpression(p) && p.right === node && /\.storyName$/.test(p.left.getText());
          const skip =
            isInsideMessage(node, text) ||
            (isDictionary && (!isKey || insideProperty(node, ['sidebar']))) ||
            (isStory && (isStoryTitleOrName(node) || isStoryName));
          if (!skip) {
            const cssName = styleProperty(node);
            if (cssName) for (const t of technicalTokens(`${cssName}: ${text};`, { css: true })) add(file, line(node), t, 'style');
            /* Argumento de seletor e seletor CSS: le como bloco. */
            if (isSelectorArgument(node)) for (const t of technicalTokens(`${text} {}`, { css: true })) add(file, line(node), t, 'selector');
            /* CSS: css`` do Lit, argumento de unsafeCSS/replaceSync/insertRule, ou folha de estilo inteira. */
            const tag = p && ts.isTaggedTemplateExpression(p) && p.template === node ? p.tag.getText() : '';
            const css = tag === 'css' || isCssArgument(node) || isStylesheetText(text);
            if (text && !/\s/.test(text)) add(file, line(node), text, isKey ? 'key' : 'literal');
            else if (isClassList(node)) for (const t of text.split(/\s+/).filter(Boolean)) add(file, line(node), t, 'class-list');
            /* Marcacao: em html``/svg``, ou quando o texto tem forma de marcacao (tag com atributo,
             * fecho de tag). '<id-da-tarefa>' num texto de uso nao e tag. */
            else if (!cssName) {
              const markup = tag === 'html' || tag === 'svg' || /<[a-zA-Z][\w-]*\s[^<>]*=|<\/|\/>/.test(text);
              for (const t of technicalTokens(text, { css, markup })) add(file, line(node), t, 'template');
            }
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(sf);
    };

    for (const file of files.filter((f) => CODE_EXTENSIONS.has(f.split('.').pop()))) {
      scanCode(file, fs.readFileSync(file, 'utf8'));
    }

    /* Estilo e marcacao: o arquivo inteiro, sem comentario, para pegar construcao em varias
     * linhas. A linha sai do indice do token. */
    for (const file of files.filter((f) => /\.(css|html)$/.test(f))) {
      let src = stripComments(fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n'));
      if (file.endsWith('.html')) {
        /* <script> e atributo on*: codigo, pelo AST. O corpo do <script> sai da marcacao. */
        src = src.replace(/(<script\b[^>]*>)([\s\S]*?)(<\/script>)/gi, (whole, open, body, close, index) => {
          scanCode(file, body, lineAt(src, index + open.length) - 1);
          return open + blank(body) + close;
        });
        for (const m of src.matchAll(/\son[a-z]+\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
          scanCode(file, m[1] ?? m[2] ?? m[3], lineAt(src, m.index) - 1);
        }
      }
      for (const t of technicalTokensAt(src, { css: file.endsWith('.css') })) add(file, lineAt(src, t.index), t.value, 'css-html');
    }

    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    for (const name of Object.keys(pkg.scripts || {})) add('package.json', 0, name, 'npm-script');
    return hits;
  } finally {
    process.chdir(prev);
  }
}

/** Confere a lista de excecoes: arquivo, nomes nao vazios, classe da lista fechada. */
function validateExceptions(list) {
  const problems = [];
  for (const [i, e] of list.entries()) {
    if (!e.file || !Array.isArray(e.names) || !e.names.length) problems.push(`entrada ${i}: precisa de "file" e "names"`);
    else if (e.file.endsWith('/')) problems.push(`entrada ${i} (${e.file}): excecao vale para um arquivo, nao para uma pasta`);
    if (!Object.hasOwn(CLASSES, e.class)) problems.push(`entrada ${i} (${e.file}): classe desconhecida "${e.class}"`);
  }
  return problems;
}

/*
 * A excecao cobre arquivo + nome. Variavel (declaracao ou referencia, papel identifier) so e
 * coberta por excecao de exportacao de story: chave de schema excetuada nao libera variavel
 * local nova com o mesmo nome. Extensao desconhecida nunca e coberta.
 */
const covers = (e, hit) => hit.role !== 'extension' && hit.file === e.file && Array.isArray(e.names) &&
  e.names.includes(hit.name) && (hit.role !== 'identifier' || e.class === 'story-export');

function evaluate(hits, list) {
  const used = new Set();
  const failures = [];
  const matched = [];
  for (const h of hits) {
    const idx = list.findIndex((e) => covers(e, h));
    if (idx >= 0) { used.add(`${idx}|${h.name}`); matched.push({ ...h, class: list[idx].class }); } else failures.push(h);
  }
  const unused = [];
  list.forEach((e, i) => { for (const n of Array.isArray(e.names) ? e.names : []) if (!used.has(`${i}|${n}`)) unused.push(`${e.file} ${n}`); });
  return { failures, matched, unused };
}

/*
 * Autoteste: cada caso de scripts/fixtures/naming/cases.json monta uma arvore temporaria e
 * confere o que a regra ve. `catches` tem de aparecer (o nome, ou { name, line, role });
 * `clean: true` nao pode ter nenhum achado; `exactly` tem de ser a lista inteira de achados,
 * cada um como "arquivo:linha nome (papel)".
 * Todo caso que escapou numa revisao entra la, para nao voltar.
 */
function selfTest() {
  const failures = [];
  const cases = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, SELF_TEST_FILE), 'utf8'));
  for (const { label, files, catches = [], clean, exactly } of cases) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nph-naming-'));
    try {
      if (!files['package.json']) fs.writeFileSync(path.join(root, 'package.json'), '{ "scripts": {} }');
      for (const [rel, content] of Object.entries(files)) {
        fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
        fs.writeFileSync(path.join(root, rel), content);
      }
      const hits = scan(root);
      const names = hits.map((h) => h.name);
      const found = (c) => (typeof c === 'string'
        ? names.includes(c)
        : hits.some((h) => h.name === c.name && (c.line === undefined || h.line === c.line) && (c.role === undefined || h.role === c.role)));
      const missing = catches.filter((c) => !found(c)).map((c) => (typeof c === 'string' ? c : JSON.stringify(c)));
      if (missing.length) failures.push(`${label}: nao pegou ${missing.join(', ')}`);
      if (clean && names.length) failures.push(`${label}: acusou ${names.join(', ')}`);
      if (exactly) {
        const got = [...new Set(hits.map((h) => `${h.file}:${h.line} ${h.name} (${h.role})`))].sort();
        const want = [...new Set(exactly)].sort();
        if (got.join('|') !== want.join('|')) failures.push(`${label}: esperava [${want.join(', ')}], veio [${got.join(', ')}]`);
      }
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }

  /* Excecoes: nome sem excecao reprova; excecao sem uso aparece; arquivo errado nao cobre;
   * chave de schema nao cobre variavel local; a de story cobre; lista invalida e acusada. */
  let structural = 0;
  const check = (ok, message) => { structural++; if (!ok) failures.push(message); };
  const list = [
    { file: 'src/a.ts', class: 'operation-schema', names: ['used', 'schemaKey'] },
    { file: 'src/a.ts', class: 'ui-text', names: ['invented'] },
    { file: 'src/a.ts', class: 'story-export', names: ['Story'] },
    { file: 'src/a.ts', class: 'ui-text', names: ['*.tsx'] },
  ];
  const r = evaluate([
    { file: 'src/a.ts', line: 1, name: 'used', role: 'literal' },
    { file: 'src/a.ts', line: 2, name: 'loose', role: 'literal' },
    { file: 'src/b.ts', line: 3, name: 'used', role: 'literal' },
    { file: 'src/a.ts', line: 4, name: 'schemaKey', role: 'property' },
    { file: 'src/a.ts', line: 5, name: 'schemaKey', role: 'identifier' },
    { file: 'src/a.ts', line: 6, name: 'Story', role: 'identifier' },
    { file: 'src/a.ts', line: 0, name: '*.tsx', role: 'extension' },
  ], list);
  check(r.failures.map((f) => f.line).join(',') === '2,3,5,0', `excecao: falhas esperadas nas linhas 2,3,5,0, veio ${r.failures.map((f) => f.line).join(',')}`);
  /* A excecao de '*.tsx' nao cobre a extensao: fica sem uso. */
  check(r.unused.join('|') === 'src/a.ts invented|src/a.ts *.tsx', `excecao: esperava sem uso [invented, *.tsx], veio [${r.unused.join(', ')}]`);
  const bad = validateExceptions([
    { file: 'src/a.ts', class: 'ui-text', names: [] },
    { file: 'src/', class: 'ui-text', names: ['x'] },
    { file: 'src/a.ts', class: 'made-up', names: ['x'] },
    { class: 'ui-text', names: ['x'] },
    { file: 'src/a.ts', class: 'ui-text', names: 'x' },
    { file: 'src/a.ts', class: 'constructor', names: ['x'] },
    { file: 'src/a.ts', class: 'toString', names: ['x'] },
    { file: 'src/a.ts', class: 'ui-text', names: ['ok'] },
  ]);
  check(bad.length === 7 && bad.every((b, i) => b.startsWith(`entrada ${i}`)), `excecao: validacao esperava 7 problemas nas entradas 0-6, veio ${bad.join(' | ')}`);

  /* Vocabulario: todo fim reprova uma palavra feita so dele; toda palavra inglesa da lista
   * passa, com o plural, e reprovaria sem a lista (senao a entrada e morta: sem fim portugues,
   * curta demais, ou plural de outra entrada); nenhuma palavra PT esta na lista inglesa, e toda
   * palavra PT reprova. */
  for (const ending of VOCABULARY.portugueseEndings) check(isPtWord(`zxq${ending}`), `vocabulario: o fim "${ending}" nao reprova`);
  for (const word of VOCABULARY.englishSameEnding) {
    check(!isPtWord(word) && !isPtWord(`${word}s`), `vocabulario: "${word}" (ou o plural) esta na lista inglesa e ainda reprova`);
    EN_SAME_ENDING.delete(word);
    check(isPtWord(word), `vocabulario: "${word}" na lista inglesa nao reprovaria sem ela (entrada morta)`);
    EN_SAME_ENDING.add(word);
  }
  for (const word of VOCABULARY.portuguese) {
    check(!EN_SAME_ENDING.has(word) && !EN_WORDS.has(word), `vocabulario: "${word}" esta numa lista inglesa tambem`);
    check(isPtWord(word) && (EN_WORDS.has(`${word}s`) || isPtWord(`${word}s`)), `vocabulario: "${word}" (ou o plural) nao reprova`);
  }
  /* Lista `english`: toda palavra passa, e cada uma reprovaria sem a lista (senao a entrada e morta). */
  for (const word of VOCABULARY.english) {
    check(!isPtWord(word), `vocabulario: "${word}" esta na lista english e ainda reprova`);
    EN_WORDS.delete(word);
    check(isPtWord(word), `vocabulario: "${word}" na lista english nao reprovaria sem ela (entrada morta)`);
    EN_WORDS.add(word);
  }
  return { failures, total: cases.length + structural };
}

function main() {
  const { failures: selfFailures, total } = selfTest();
  for (const f of selfFailures) console.log(`AUTOTESTE FALHOU ${f}`);
  if (selfFailures.length) {
    console.log(`\nRESULTADO: o autoteste da regra falhou (${selfFailures.length}); a varredura nao vale ate a regra ser corrigida.`);
    process.exit(1);
  }
  console.log(`Autoteste: ${total} casos passaram.`);

  const listAll = process.argv.includes('--list');
  const hits = scan(REPO_ROOT);
  const list = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, EXCEPTIONS_FILE), 'utf8'));
  const problems = validateExceptions(list);
  const { failures, matched, unused } = evaluate(hits, list);
  if (listAll) {
    for (const h of matched) console.log(`EXCECAO ${h.file}:${h.line} ${h.name} (${h.role}) [${h.class}]`);
  }
  for (const f of failures) {
    console.log(f.role === 'extension'
      ? `FALHOU ${f.file}: extensao sem regra de nomes (${f.name}); ensine scripts/test-naming.mjs a ler o tipo antes`
      : `FALHOU ${f.file}:${f.line} ${f.name} (${f.role})`);
  }
  for (const u of unused) console.log(`EXCECAO SEM USO ${u}`);
  for (const p of problems) console.log(`EXCECAO INVALIDA ${p}`);

  const ok = failures.length === 0 && unused.length === 0 && problems.length === 0;
  console.log(
    ok
      ? `\nRESULTADO: nenhum nome tecnico em portugues fora de ${EXCEPTIONS_FILE}.`
      : `\nRESULTADO: ${failures.length} nome(s) em portugues sem excecao, ${unused.length} excecao(oes) sem uso, ${problems.length} excecao(oes) invalida(s).\n` +
        `Renomeie para ingles. Se for contrato, registre em ${EXCEPTIONS_FILE} com a classe, para revisao no PR.`,
  );
  process.exit(ok ? 0 : 1);
}

/* Sempre roda: nada importa este arquivo. Comparar caminhos falha por junction ou symlink, e a prova sairia 0 calada. */
main();
