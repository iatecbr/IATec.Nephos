#!/usr/bin/env node
/**
 * Proof of P64: a technical name in Portuguese fails, and so does Portuguese in
 * comments, messages, test descriptions and documentation (amendment of 06/10/2026).
 *
 * Checks, in src/, stories/, .storybook/ and scripts/:
 *   - every code identifier (.ts, .js, .mjs, .cjs), through the TypeScript AST;
 *   - every literal and regex literal without a space (technical value: id, key, state,
 *     path), including templates with ${...};
 *   - in markup (html``/svg`` template, .html, string with an attribute or a closing tag): component tag,
 *     attribute name, event (@x) and property (.x, ?x) name, value of an id
 *     attribute (class, part, id, for, slot, name, id-like aria-*, data-*), value of a
 *     component attribute, href="#id", and the CSS of style="..." and of <style>;
 *   - in CSS (.css, <style>, style="...", css``, stylesheet in a string,
 *     unsafeCSS/replaceSync/insertRule and selector argument): class selector,
 *     id selector and custom element type selector, ::part, :state, ::highlight, attribute,
 *     custom property, @keyframes, animation, @container, @layer, counters and grid;
 *   - built class list: className, setAttribute('class'|'part'|'id'...),
 *     clsx/cn/cx/classnames, { className }; per-property style (el.style.x,
 *     setProperty, style object), including through ternary and concatenation;
 *   - selector argument: querySelector(All), closest, matches (and .call), the
 *     decorators @query/@queryAll/@queryAsync, `selector:` and a *Selector constant;
 *   - the <script> and the on* attributes of .html, through the AST;
 *   - the name of every folder and file; the script names of package.json;
 *   - running text: every comment, every message (direct argument of console, throw,
 *     Error, process output, fail/warn with text), every test description and the prose
 *     of the documentation. Each Portuguese word is a hit (roles comment, message, doc).
 *
 * Extension outside KNOWN_EXTENSIONS fails: a file of a new type (.tsx, .scss, .mdx,
 * .svg...) only gets in after this rule learns to read it, with a case in the self-test.
 * A file without an extension (LICENSE, script with #!) also fails. A hidden file counts by its
 * extension (.config.yaml fails); a hidden file without an extension (.gitkeep) is checked by name only.
 *
 * Left out by P64: the text of the .storybook/i18n/ dictionaries and the sidebar keys
 * (story IDs), the title and name of the story itself and any other literal text
 * (a literal with a space that is not a class list, selector, style or markup).
 *
 * Left out because it is contract: the content of .json (token keys, P20; generated
 * Metadata, P63). The exception is the .storybook/i18n/*.json dictionaries: their
 * keys are technical names and stay under the rule.
 *
 * Documentation phase, by group: LANGUAGE_MODES says 'warn' (prints the Portuguese it finds and
 * keeps the exit code) or 'enforce' (fails); scripts/language-lib.mjs lists the files and groups.
 *
 * Known limit: a word glued without a separator (modoescuro, botaoprimario) and a word
 * that is not in the vocabulary nor has a typical Portuguese ending pass. Every word that
 * a review finds goes into scripts/naming-vocabulary.json, and the case goes into
 * scripts/fixtures/naming/cases.json, which runs before the scan.
 *
 * A contract that stays in Portuguese goes into scripts/naming-exceptions.json,
 * with a class from the closed list CLASSES. An unused exception also fails, so the
 * list does not keep a name that already left the code. Quotes of running text
 * (comment, message, documentation) go into scripts/language-exceptions.json for the
 * documentation, or into the same file as above for code, only with the text classes
 * `prose-text` and `contract-term`, which cover only the roles comment, message and doc.
 *
 * Run with: npm run test:naming
 * List everything the rule sees, with or without exception: npm run test:naming -- --list
 */
import { createRequire } from 'node:module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDetector, docFiles, docProse, EXCLUDED_FUNCTION_WORDS } from './language-lib.mjs';

const require = createRequire(import.meta.url);
const ts = require('typescript');

/** Repository root: the script runs the same from any folder. */
const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const ROOTS = ['src', 'stories', '.storybook', 'scripts'];
/** Generated: the name comes from another source, which is already checked (token JSON, spec). */
const SKIPPED_DIRS = new Set(['node_modules', 'storybook-static', 'src/tokens/generated', 'src/shared/metadata']);
/** File types this rule can read. Any other type fails until the rule learns it. */
const CODE_EXTENSIONS = new Set(['ts', 'js', 'mjs', 'cjs']);
const KNOWN_EXTENSIONS = new Set([...CODE_EXTENSIONS, 'css', 'html', 'json', 'md']);
/** Directories of the checker contract (V28, V30, V31): exempt only in scripts/fixtures/operations/. */
const CONTRACT_DIRS = new Set(['tarefas', 'evidencias', 'contextos', 'fichas']);
const OPERATIONS_FIXTURES = 'scripts/fixtures/operations/';
/** Evidence name: <gate>-<YYYY-MM-DD>.md (`docs/operacao/README.md`). */
const EVIDENCE_NAME = /^[a-z0-9-]+-\d{4}-\d{2}-\d{2}\.md$/;
const DICTIONARIES = new Set(['.storybook/i18n/pt-BR.json', '.storybook/i18n/en.json', '.storybook/i18n/es.json']);
const EXCEPTIONS_FILE = 'scripts/naming-exceptions.json';
/** Exceptions of the documentation phase: only the text classes are valid there. */
const LANGUAGE_EXCEPTIONS_FILE = 'scripts/language-exceptions.json';
/**
 * Documentation phase, by group (P64, amendment of 06/10/2026). 'warn' prints the
 * Portuguese it finds and keeps the exit code; 'enforce' fails. Each group goes to
 * 'enforce' when its translation is merged (docs: PR 2; specs: PR 4).
 */
const LANGUAGE_MODES = { docs: 'warn', specs: 'warn' };
const SELF_TEST_FILE = 'scripts/fixtures/naming/cases.json';

const CLASSES = {
  'story-export': 'story export: generates the ID and the permalink',
  'storybook-id': 'Storybook ID, title or navigation key',
  anchor: 'section id used as a URL anchor',
  'operation-schema': 'key or value of the docs/operacao schema (P64, outside the rule)',
  'token-schema': 'key, mode or brand of the tokens JSON (P20, P64)',
  'spec-schema': 'key or value of the spec YAML and of the Metadata (P63, P64)',
  'design-md': 'key read from design.md',
  'i18n-header': 'format of the translations header (test-i18n)',
  cli: 'npm script name, flag or file cited in a command recorded in docs/operacao/',
  'contract-path': 'checker contract directory, cited by the checker itself',
  'output-text': 'word printed in the output of a script',
  'ui-text': 'displayed or example text, a single word',
  'prose-text': 'quote of the time or proper name in running text (comment, message, documentation)',
  'contract-term': 'contract key or value quoted in running text (P64, D4: it changes in DSA-15)',
};
/** Running text roles, and the only classes that cover them. A text class never covers a technical name. */
const TEXT_ROLES = new Set(['comment', 'message', 'doc']);
const TEXT_CLASSES = new Set(['prose-text', 'contract-term']);

/*
 * Portuguese vocabulary, typical endings and the closed list of English words with those endings
 * live in scripts/naming-vocabulary.json, which also says what is left out and why.
 */
const VOCABULARY = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'scripts/naming-vocabulary.json'), 'utf8'));
const PT_WORDS = new Set(VOCABULARY.portuguese);
/** Typical Portuguese ending; an English word with the same ending goes in a CLOSED list, word by word. */
const PT_ENDING = new RegExp(`(?:${VOCABULARY.portugueseEndings.join('|')})$`);
const EN_SAME_ENDING = new Set(VOCABULARY.englishSameEnding);
/** English code word that the rules above would mistake (indices = plural of an index). */
const EN_WORDS = new Set(VOCABULARY.english);
const { ptWordsInProse } = createDetector(VOCABULARY);

function isPtWord(word) {
  const w = word.toLowerCase();
  if (w.length < 2) return false;
  if (EN_WORDS.has(w)) return false;
  if (/[à-ÿ]/.test(w)) return true;
  if (PT_WORDS.has(w)) return true;
  /* Plural in -s of a vocabulary word (`rodape` → `rodapes`, `seta` → `setas`). */
  if (w.endsWith('s') && PT_WORDS.has(w.slice(0, -1))) return true;
  return w.length > 3 && PT_ENDING.test(w) && !isEnglishSameEnding(w);
}

/** English word from the list, or its plural in -s/-es (tornados, avocados, potatoes). */
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

/** Attributes whose value is a technical name (class, part, id or id reference). aria-label is text. */
const ID_ATTRS = ['class', 'part', 'exportparts', 'id', 'for', 'slot', 'name', 'aria-labelledby', 'aria-describedby',
  'aria-controls', 'aria-owns', 'aria-activedescendant', 'aria-details', 'aria-errormessage', 'popovertarget', 'list',
  'form', 'headers', 'commandfor', 'interestfor', 'anchor', 'itemref'];
const ID_ATTR_NAME = new RegExp(`^(?:${ID_ATTRS.join('|')})$|^data-`);
/**
 * Attributes whose value is displayed text: left out, by P64. `text` is the text of
 * nph-label (API of P62.3). value and content are a technical value and stay under the rule.
 */
const TEXT_ATTRS = new Set(['title', 'alt', 'placeholder', 'aria-label', 'aria-description', 'aria-roledescription',
  'aria-valuetext', 'label', 'text']);
/**
 * HTML, SVG and MathML elements. Outside them, a tag without a hyphen is text: '<file name>' in a help
 * text has no attributes.
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
 * Known CSS properties, in kebab-case: those of CSSStyleDeclaration in the TypeScript
 * lib.dom. A stylesheet in a string only counts if every declaration uses one of them.
 */
const CSS_PROPERTIES = (() => {
  const dom = fs.readFileSync(require.resolve('typescript/lib/lib.dom.d.ts'), 'utf8');
  const start = dom.indexOf('interface CSSStyleDeclaration {');
  const block = dom.slice(start, dom.indexOf('\n}', start));
  return new Set([...block.matchAll(/^\s+(\w+): string;/gm)].map((m) => m[1].replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)));
})();
/** CSS properties whose value has names; the per-property style (el.style.x) uses the same map. */
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
 * Technical tokens of a text with a space. Returns { value, index } so the caller can find the
 * line. `css`: the text is CSS; only there do selectors and CSS names count. `markup`: reads tag,
 * attribute and value; style="..." and <style> are read as CSS.
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
  /* data-x only in CSS or markup: `<data-inicial>` in a usage text is not an attribute. */
  if (css || markup) each(/\b(data-[a-z\u0001][\w\u0001-]*)/g, (m) => push(m[1], m.index));

  if (css) {
    /* Declaration value without a string: stops at ; } { and at the quote or < of a style="..." */
    const VALUE = `([^;}{"'<>]+)`;
    /* Custom element type selector: hyphenated ident in a selector position, in a list that
     * opens a block ({ ahead; [attribute] and string count as part of the selector; ; and } close).
     * The ident may have the ${} marker (`nph-rotulo-${v}`). */
    each(/(?:^|[\s,>+~(){};])([a-z][a-z0-9]*-[\w\u0001-]*)(?=(?:[^};"'[]|\[(?:[^\]"']|"[^"]*"|'[^']*')*\]|"[^"]*"|'[^']*')*\{)(?=\s*[,{.:#[>+~)]|\s+[a-z*&\u0001])/g,
      (m) => push(m[1], m.index + m[0].length - m[1].length));
    /* Class and id: a dot or # that is not part of an isolated number (1.5rem, #1f2). */
    each(/(?<!(?:^|[^\w.-])\d+)\.([a-zA-Z_\u0001][\w\u0001-]*)/g, (m) => push('.' + m[1], m.index));
    /* A hex color has 3, 4, 6 or 8 digits and does not open a block: #decada { } is an id, color: #decada is a color. */
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
    /* Named grid line: `[inicio] 1fr [fim]`. */
    each(/\[([a-zA-Z_\u0001][\w\u0001-]*(?:\s+[a-zA-Z_\u0001][\w\u0001-]*)*)\]/g, (m) => idents(m[1], m.index));
    each(new RegExp(`\\b(?:animation|animation-name|container|container-name|grid-area|grid-row|grid-row-start|grid-row-end|grid-column|grid-column-start|grid-column-end|view-transition-name|view-transition-class|list-style-type|counter-reset|counter-increment|counter-set)\\s*:\\s*${VALUE}`, 'g'),
      (m) => idents(m[1], m.index));
    each(/\b(?:list-style|font-family)\s*:\s*([^;}{<>]+)/g, (m) => idents(m[1].replace(/"[^"]*"|'[^']*'/g, ' '), m.index));
    /* Grid areas: grid-template-areas and the grid-template and grid shorthands, with the strings. */
    each(/\b(?:grid-template-areas|grid-template|grid)\s*:\s*([^;}{<>]+)/g, (m) => {
      for (const q of m[1].matchAll(/"([^"]*)"|'([^']*)'/g)) idents(q[1] ?? q[2], m.index);
    });
  }

  /* Markup: tag, attributes, id values, href="#x", style="..." and <style>. The quote may stay
   * open at the end of the text: `<i class="botao-ativo ' + x + '">` splits the attribute into two literals. */
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
      /* Component value: a technical value (variant="primary"); with a space it is text (`hint="Digite o nome"`). */
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
 * Stylesheet in a string, wherever it is: without comments, the whole literal is a
 * sequence of selector { ... } rules with balanced, nested or empty braces, and at least
 * one declaration uses a known property: from lib.dom, vendor (-webkit-x) or --custom.
 * A property that lib.dom does not have yet passes if it is not a PT word; a compound one (anchor-name)
 * counts as known.
 * Running text with braces (`Seja bem-vindo, {usuario: nome}`) is not a stylesheet.
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
  /* Declaration: prop: value up to ; or }. A nested selector with a pseudo (a:hover {) is not a declaration. */
  const props = [...text.matchAll(/[{;]\s*(-?[\w-]+)\s*:[^;{}]*(?=[;}])/g)].map((m) => m[1]);
  /* Known: from lib.dom, vendor, --custom, or compound with a hyphen and no PT word (anchor-name). */
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

/** Climbs through the expressions that only pass the value along: parentheses, ternary, + && || ??. */
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
/** Local reporting functions (`verificar-operacao`: fail; and the like): only running text counts as a message. */
const LOCAL_MESSAGE_CALLEE = /^(fail|warn)$/;
/**
 * A message is only the DIRECT argument of console, throw, Error, process output or
 * test description, including when built by template, concatenation or ternary. A literal
 * inside an object, array, comparison or function passed as an argument is not a message.
 * In fail/warn, only text with a space: `fail('rotulo')` is a technical value.
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
 * Literal that is a CSS selector: 1st argument of querySelector, querySelectorAll, closest,
 * matches (2nd in .call), of the decorators @query/@queryAll/@queryAsync; `selector:`; or the
 * value of a constant or property whose name ends in Selector/SELECTOR.
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

/** Literal that is CSS because it is an argument of unsafeCSS, replaceSync or insertRule. */
function isCssArgument(start) {
  const node = climb(start);
  const p = node.parent;
  return Boolean(p && ts.isCallExpression(p) && p.arguments[0] === node &&
    /(?:(?:^|\.)unsafeCSS|\.(?:replaceSync|insertRule))$/.test(calleeOf(p)));
}

/** Template text right before a ${...} interpolation. */
function textBeforeSpan(span) {
  const template = span.parent;
  const i = template.templateSpans.indexOf(span);
  return i === 0 ? template.head.text : template.templateSpans[i - 1].literal.text;
}

/** Literal with a space that becomes a class, part or id list: el.className = '...', setAttribute('class', '...'). */
function isClassList(start) {
  const node = climb(start);
  const p = node.parent;
  if (!p) return false;
  /* Conditional Lit class: class=${c ? 'a b' : 'c'} or class="x ${...}". The text before the
   * interpolation opens the attribute and has not closed it yet. */
  if (ts.isTemplateSpan(p) && p.expression === node) {
    return new RegExp(`\\b(?:${ID_ATTRS.join('|')}|data-[\\w-]+)\\s*=\\s*(?:"[^"]*|'[^']*)?$`).test(textBeforeSpan(p));
  }
  if (ts.isBinaryExpression(p) && p.right === node) return /\.className$/.test(p.left.getText());
  /* Props or classMap object: { className: 'a b' }, { class: 'a b' }. */
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
 * Style property whose value has names: el.style.x = '...' (or +=), el.style['x'] = '...',
 * setProperty('x', '...') or { x: '...' } in a style object. Returns the CSS name, or
 * 'cssText' when the value is a list of declarations (el.style.cssText, setAttribute('style')):
 * "cssText: grid-area: x;" reads the names of each declaration the same way.
 */
const ASSIGN_OPERATORS = new Set([ts.SyntaxKind.EqualsToken, ts.SyntaxKind.PlusEqualsToken]);
function styleProperty(start) {
  const node = climb(start);
  const p = node.parent;
  if (!p) return null;
  /* style=${'grid-area: x'} or style="${...}" in a Lit template: list of declarations. */
  if (ts.isTemplateSpan(p) && p.expression === node) return /\bstyle\s*=\s*(?:"[^"]*|'[^']*)?$/.test(textBeforeSpan(p)) ? 'cssText' : null;
  const cssName = (key) => (key === 'cssText' ? key : key ? STYLE_PROPS[key] ?? (CSS_NAMES.has(key) ? key : null) : null);
  if (ts.isCallExpression(p) && /\.setAttribute$/.test(calleeOf(p)) && p.arguments[1] === node) {
    const a = p.arguments[0];
    return ts.isStringLiteralLike(a) && a.text === 'style' ? 'cssText' : null;
  }
  if (ts.isBinaryExpression(p) && p.right === node && ASSIGN_OPERATORS.has(p.operatorToken.kind)) {
    /* (el.style as any)['x'] too: without the type cast and without the parentheses. */
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
 * title and name of the story ITSELF are left out (Storybook text): a direct property of the
 * `export default` object, of a top-level exported constant (the story) or of the
 * constant that `export default` exports (meta). `args.name`, and name of any other
 * object, is a property value and stays under the rule.
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
    /* The ${...} marker comes out as ${} in every role: visible in the output and writable in the exception.
     * NFC: a decomposed accent (file name coming from macOS) becomes the accented letter. */
    const add = (file, line, raw, role) => {
      const name = raw.replace(/\u0001/g, '${}').normalize('NFC');
      if (hasPt(name)) hits.push({ file, line, name, role });
    };
    const lineAt = (src, index) => src.slice(0, index).split('\n').length;
    /* Running text (comment, message, documentation): every Portuguese word is a hit, on its own line. */
    const addProse = (file, firstLine, text, role, group) => {
      for (const { word, index } of ptWordsInProse(text)) {
        hits.push({ file, line: firstLine + lineAt(text, index) - 1, name: word.normalize('NFC'), role, ...(group ? { group } : {}) });
      }
    };
    /* Comments inside markup or CSS text, <!-- --> and slash-star, each on its own line. */
    const addEmbeddedComments = (file, firstLine, text) => {
      for (const m of text.matchAll(/<!--([\s\S]*?)-->|\/\*([\s\S]*?)\*\//g)) {
        addProse(file, firstLine + lineAt(text, m.index) - 1, m[1] ?? m[2], 'comment');
      }
    };
    const files = ROOTS.filter((r) => fs.existsSync(r)).flatMap((r) => walk(r, []));

    /* Folder, file and extension. A checker contract directory and an evidence name are only left
     * out inside scripts/fixtures/operations/, where the checker requires them. */
    for (const file of files) {
      const parts = file.split('/');
      const inOperations = file.startsWith(OPERATIONS_FIXTURES);
      const base = parts[parts.length - 1];
      /* The leading dot of a hidden file does not split an extension: .config.yaml has the yaml extension.
       * A hidden file without an extension (.gitkeep) is a tool marker: only the name counts. */
      const stem = base.replace(/^\./, '');
      const ext = stem.includes('.') ? stem.split('.').pop() : '';
      const marker = !ext && base.startsWith('.');
      if (!marker && !KNOWN_EXTENSIONS.has(ext)) hits.push({ file, line: 0, name: ext ? `*.${ext}` : '(no extension)', role: 'extension' });
      parts.forEach((seg, i) => {
        const isLast = i === parts.length - 1;
        if (!isLast && inOperations && CONTRACT_DIRS.has(seg)) return;
        if (isLast && inOperations && EVIDENCE_NAME.test(seg)) return;
        add(file, 0, isLast && ext ? seg.slice(0, -(ext.length + 1)) : seg, isLast ? 'file' : 'folder');
      });
    }

    /* Code: a .ts/.js file, or a piece of code inside .html (<script> and on*). */
    const scanCode = (file, src, lineOffset = 0) => {
      const kind = file.endsWith('.ts') ? ts.ScriptKind.TS : ts.ScriptKind.JS;
      const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, kind);
      const line = (n) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1 + lineOffset;
      const isDictionary = DICTIONARIES.has(file);
      const isStory = /\.stories\.\w+$/.test(file);
      /* Comments: the leading and trailing comment ranges of every node, each read once. */
      const seenComments = new Set();
      const readComments = (pos) => {
        for (const r of [...(ts.getLeadingCommentRanges(src, pos) ?? []), ...(ts.getTrailingCommentRanges(src, pos) ?? [])]) {
          if (seenComments.has(r.pos)) continue;
          seenComments.add(r.pos);
          const body = src.slice(r.pos, r.end).replace(/^\/\/|^\/\*|\*\/$/g, '');
          addProse(file, sf.getLineAndCharacterOfPosition(r.pos).line + 1 + lineOffset, body, 'comment');
        }
      };
      const visit = (node) => {
        if (!isDictionary) { readComments(node.pos); readComments(node.end); }
        if (ts.isIdentifier(node) || ts.isPrivateIdentifier(node)) {
          /* A property name (access, key, signature, field, method, destructuring with
           * alias) has its own role: a schema key exception does not cover a local variable. */
          const p = node.parent;
          const isProperty = p && (
            (ts.isPropertyAccessExpression(p) && p.name === node) ||
            ((ts.isPropertyAssignment(p) || ts.isPropertySignature(p) || ts.isPropertyDeclaration(p) ||
              ts.isMethodDeclaration(p) || ts.isMethodSignature(p)) && p.name === node) ||
            (ts.isBindingElement(p) && p.propertyName === node));
          if (!(isDictionary && insideProperty(node, ['sidebar']))) add(file, line(node), node.text, isProperty ? 'property' : 'identifier');
        } else if (ts.isRegularExpressionLiteral(node)) {
          /* Regex literal: the body, without the slashes and the flags. */
          if (!isInsideMessage(node)) add(file, line(node), node.text.slice(1, node.text.lastIndexOf('/')), 'regex');
        } else if (ts.isStringLiteralLike(node) || ts.isTemplateExpression(node) || ts.isTemplateLiteralTypeNode(node)) {
          /* Template with ${...} (value or type): the whole text, with each interpolation replaced
           * by a marker that is not a space. So a built path remains a technical
           * value, and an attribute cut by ${...} remains whole. */
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
          if (!isDictionary && isInsideMessage(node, text)) addProse(file, line(node), text.replace(/\u0001/g, ' '), 'message');
          if (!skip) {
            const cssName = styleProperty(node);
            if (cssName) for (const t of technicalTokens(`${cssName}: ${text};`, { css: true })) add(file, line(node), t, 'style');
            /* A selector argument is a CSS selector: reads it as a block. */
            if (isSelectorArgument(node)) for (const t of technicalTokens(`${text} {}`, { css: true })) add(file, line(node), t, 'selector');
            /* CSS: Lit css``, argument of unsafeCSS/replaceSync/insertRule, or a whole stylesheet. */
            const tag = p && ts.isTaggedTemplateExpression(p) && p.template === node ? p.tag.getText() : '';
            const css = tag === 'css' || isCssArgument(node) || isStylesheetText(text);
            if (css || tag === 'html' || tag === 'svg' || /<!--/.test(text)) addEmbeddedComments(file, line(node), text);
            if (text && !/\s/.test(text)) add(file, line(node), text, isKey ? 'key' : 'literal');
            else if (isClassList(node)) for (const t of text.split(/\s+/).filter(Boolean)) add(file, line(node), t, 'class-list');
            /* Markup: in html``/svg``, or when the text has the shape of markup (tag with attribute,
             * closing tag). `<id-da-tarefa>` in a usage text is not a tag. */
            else if (!cssName) {
              const markup = tag === 'html' || tag === 'svg' || /<[a-zA-Z][\w-]*\s[^<>]*=|<\/|\/>/.test(text);
              for (const t of technicalTokens(text, { css, markup })) add(file, line(node), t, 'template');
            }
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(sf);
      if (!isDictionary) readComments(sf.endOfFileToken.pos);
    };

    for (const file of files.filter((f) => CODE_EXTENSIONS.has(f.split('.').pop()))) {
      scanCode(file, fs.readFileSync(file, 'utf8'));
    }

    /* Language dictionary: JSON is a valid JS expression. With the prefix on the same line, the
     * line does not change and the scan is the same as for code: a key outside sidebar fails,
     * a value and sidebar pass. The name does not end in .ts, so the AST comes out as JS. */
    for (const file of files.filter((f) => DICTIONARIES.has(f))) {
      scanCode(file, `export default ${fs.readFileSync(file, 'utf8')}`);
    }

    /* Style and markup: the whole file, without comments, to catch a multi-line
     * construct. The line comes from the token index. */
    for (const file of files.filter((f) => /\.(css|html)$/.test(f))) {
      addEmbeddedComments(file, 1, fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n'));
      let src = stripComments(fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n'));
      if (file.endsWith('.html')) {
        /* <script> and on* attribute: code, through the AST. The <script> body leaves the markup. */
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

    /* Documentation: the running text of each file in scope (scripts/language-lib.mjs). */
    for (const { file, group } of docFiles()) {
      for (const { line, text } of docProse(fs.readFileSync(file, 'utf8'))) addProse(file, line, text, 'doc', group);
    }
    return hits;
  } finally {
    process.chdir(prev);
  }
}

/** Checks the exception list: file, non-empty names, class from the closed list. */
function validateExceptions(list, { textOnly = false } = {}) {
  const problems = [];
  for (const [i, e] of list.entries()) {
    if (!e.file || !Array.isArray(e.names) || !e.names.length) problems.push(`entry ${i}: needs "file" and "names"`);
    else if (e.file.endsWith('/')) problems.push(`entry ${i} (${e.file}): an exception applies to a file, not to a folder`);
    if (!Object.hasOwn(CLASSES, e.class)) problems.push(`entry ${i} (${e.file}): unknown class "${e.class}"`);
    else if (textOnly && !TEXT_CLASSES.has(e.class)) problems.push(`entry ${i} (${e.file}): only a text class is valid in ${LANGUAGE_EXCEPTIONS_FILE}, not "${e.class}"`);
  }
  return problems;
}

/*
 * An exception covers file + name. A variable (declaration or reference, role identifier) is only
 * covered by a story export exception: an excepted schema key does not release a new local
 * variable with the same name. An unknown extension is never covered.
 */
const covers = (e, hit) => hit.role !== 'extension' && hit.file === e.file && Array.isArray(e.names) &&
  e.names.includes(hit.name) && TEXT_ROLES.has(hit.role) === TEXT_CLASSES.has(e.class) &&
  (hit.role !== 'identifier' || e.class === 'story-export');

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
 * Self-test: each case of scripts/fixtures/naming/cases.json builds a temporary tree and
 * checks what the rule sees. `catches` must appear (the name, or { name, line, role });
 * `clean: true` cannot have any finding; `exactly` must be the whole list of findings,
 * each as "file:line name (role)".
 * Every case that escaped in a review goes in there, so it does not come back.
 */
function selfTest() {
  const failures = [];
  const cases = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, SELF_TEST_FILE), 'utf8'));
  for (const { label, files, catches = [], clean, exactly, prose } of cases) {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'nph-naming-'));
    try {
      if (!files['package.json']) fs.writeFileSync(path.join(root, 'package.json'), '{ "scripts": {} }');
      for (const [rel, content] of Object.entries(files)) {
        fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
        fs.writeFileSync(path.join(root, rel), content);
      }
      const hits = scan(root).filter((h) => prose || !TEXT_ROLES.has(h.role));
      const names = hits.map((h) => h.name);
      const found = (c) => (typeof c === 'string'
        ? names.includes(c)
        : hits.some((h) => h.name === c.name && (c.line === undefined || h.line === c.line) && (c.role === undefined || h.role === c.role)));
      const missing = catches.filter((c) => !found(c)).map((c) => (typeof c === 'string' ? c : JSON.stringify(c)));
      if (missing.length) failures.push(`${label}: did not catch ${missing.join(', ')}`);
      if (clean && names.length) failures.push(`${label}: reported ${names.join(', ')}`);
      if (exactly) {
        const got = [...new Set(hits.map((h) => `${h.file}:${h.line} ${h.name} (${h.role})`))].sort();
        const want = [...new Set(exactly)].sort();
        if (got.join('|') !== want.join('|')) failures.push(`${label}: expected [${want.join(', ')}], got [${got.join(', ')}]`);
      }
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }

  /* Exceptions: a name without an exception fails; an unused exception shows up; the wrong file does not cover;
   * a schema key does not cover a local variable; the story one does; an invalid list is reported. */
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
  check(r.failures.map((f) => f.line).join(',') === '2,3,5,0', `exception: expected failures on lines 2,3,5,0, got ${r.failures.map((f) => f.line).join(',')}`);
  /* The '*.tsx' exception does not cover the extension: it stays unused. */
  check(r.unused.join('|') === 'src/a.ts invented|src/a.ts *.tsx', `exception: expected unused [invented, *.tsx], got [${r.unused.join(', ')}]`);
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
  check(bad.length === 7 && bad.every((b, i) => b.startsWith(`entry ${i}`)), `exception: validation expected 7 problems in entries 0-6, got ${bad.join(' | ')}`);

  /* Text classes cover only running text, and technical classes never cover it. */
  const textList = [
    { file: 'src/a.ts', class: 'prose-text', names: ['quotedWord'] },
    { file: 'src/a.ts', class: 'operation-schema', names: ['schemaKey'] },
  ];
  const t = evaluate([
    { file: 'src/a.ts', line: 1, name: 'quotedWord', role: 'comment' },
    { file: 'src/a.ts', line: 2, name: 'quotedWord', role: 'literal' },
    { file: 'src/a.ts', line: 3, name: 'schemaKey', role: 'message' },
    { file: 'src/a.ts', line: 4, name: 'schemaKey', role: 'key' },
  ], textList);
  check(t.failures.map((f) => f.line).join(',') === '2,3', `text class: expected failures on lines 2,3, got ${t.failures.map((f) => f.line).join(',')}`);
  const textBad = validateExceptions([
    { file: 'docs/a.md', class: 'ui-text', names: ['x'] },
    { file: 'docs/a.md', class: 'contract-term', names: ['x'] },
  ], { textOnly: true });
  check(textBad.length === 1 && textBad[0].startsWith('entry 0'), `text class: expected 1 problem on entry 0 of the documentation list, got ${textBad.join(' | ')}`);

  /* Function words: none is English or excluded, and each one is detected. */
  const excluded = new Set(EXCLUDED_FUNCTION_WORDS);
  for (const word of VOCABULARY.portugueseFunctionWords) {
    check(!EN_WORDS.has(word) && !EN_SAME_ENDING.has(word) && !excluded.has(word), `vocabulary: "${word}" is a function word and also English or excluded`);
    check(ptWordsInProse(`see ${word} here`).some((w) => w.word === word), `vocabulary: function word "${word}" is not detected`);
  }

  /* Vocabulary: every ending fails a word made only of it; every English word in the list
   * passes, with the plural, and would fail without the list (otherwise the entry is dead: no Portuguese
   * ending, too short, or the plural of another entry); no PT word is in the English list, and every
   * PT word fails. */
  for (const ending of VOCABULARY.portugueseEndings) check(isPtWord(`zxq${ending}`), `vocabulary: the ending "${ending}" does not fail`);
  for (const word of VOCABULARY.englishSameEnding) {
    check(!isPtWord(word) && !isPtWord(`${word}s`), `vocabulary: "${word}" (or its plural) is in the English list and still fails`);
    EN_SAME_ENDING.delete(word);
    check(isPtWord(word), `vocabulary: "${word}" in the English list would not fail without it (dead entry)`);
    EN_SAME_ENDING.add(word);
  }
  for (const word of VOCABULARY.portuguese) {
    check(!EN_SAME_ENDING.has(word) && !EN_WORDS.has(word), `vocabulary: "${word}" is in an English list too`);
    check(isPtWord(word) && (EN_WORDS.has(`${word}s`) || isPtWord(`${word}s`)), `vocabulary: "${word}" (or its plural) does not fail`);
  }
  /* `english` list: every word passes, and each would fail without the list (otherwise the entry is dead). */
  for (const word of VOCABULARY.english) {
    check(!isPtWord(word), `vocabulary: "${word}" is in the english list and still fails`);
    EN_WORDS.delete(word);
    check(isPtWord(word), `vocabulary: "${word}" in the english list would not fail without it (dead entry)`);
    EN_WORDS.add(word);
  }
  return { failures, total: cases.length + structural };
}

function main() {
  const { failures: selfFailures, total } = selfTest();
  for (const f of selfFailures) console.log(`SELF-TEST FAILED ${f}`);
  if (selfFailures.length) {
    console.log(`\nRESULT: the rule self-test failed (${selfFailures.length}); the scan is not valid until the rule is fixed.`);
    process.exit(1);
  }
  console.log(`Self-test: ${total} cases passed.`);

  const listAll = process.argv.includes('--list');
  const hits = scan(REPO_ROOT);
  const list = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, EXCEPTIONS_FILE), 'utf8'));
  const problems = validateExceptions(list);
  const codeHits = hits.filter((h) => h.role !== 'doc');
  const docHits = hits.filter((h) => h.role === 'doc');
  const { failures, matched, unused } = evaluate(codeHits, list);
  const languageList = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, LANGUAGE_EXCEPTIONS_FILE), 'utf8'));
  problems.push(...validateExceptions(languageList, { textOnly: true }).map((p) => `${LANGUAGE_EXCEPTIONS_FILE}: ${p}`));
  const docs = evaluate(docHits, languageList);
  const modeOf = (file) => LANGUAGE_MODES[docHits.find((h) => h.file === file)?.group ?? (file.startsWith('fichas/') ? 'specs' : 'docs')];
  const docFailures = docs.failures.filter((h) => LANGUAGE_MODES[h.group] === 'enforce');
  const docWarnings = docs.failures.filter((h) => LANGUAGE_MODES[h.group] !== 'enforce');
  const docUnused = docs.unused.filter((u) => modeOf(u.split(' ')[0]) === 'enforce');
  if (listAll) {
    for (const h of matched) console.log(`EXCEPTION ${h.file}:${h.line} ${h.name} (${h.role}) [${h.class}]`);
  }
  for (const f of failures) {
    console.log(f.role === 'extension'
      ? `FAILED ${f.file}: extension without a naming rule (${f.name}); teach scripts/test-naming.mjs to read the type first`
      : `FAILED ${f.file}:${f.line} ${f.name} (${f.role})`);
  }
  for (const u of unused) console.log(`UNUSED EXCEPTION ${u}`);
  for (const f of docFailures) console.log(`FAILED ${f.file}:${f.line} ${f.name} (doc, ${f.group})`);
  for (const u of docUnused) console.log(`UNUSED EXCEPTION ${LANGUAGE_EXCEPTIONS_FILE} ${u}`);
  if (docWarnings.length) {
    const byFile = new Map();
    for (const w of docWarnings) byFile.set(w.file, (byFile.get(w.file) ?? 0) + 1);
    if (listAll) for (const w of docWarnings) console.log(`WARNING ${w.file}:${w.line} ${w.name} (doc, ${w.group})`);
    console.log(`\nWARNING: documentation still in Portuguese (warn mode, exit code unchanged): ${docWarnings.length} word(s) in ${byFile.size} file(s).`);
    for (const [file, count] of [...byFile].sort()) console.log(`  ${file}: ${count}`);
  }
  for (const p of problems) console.log(`INVALID EXCEPTION ${p}`);

  const ok = failures.length === 0 && unused.length === 0 && problems.length === 0 && docFailures.length === 0 && docUnused.length === 0;
  console.log(
    ok
      ? `\nRESULT: no technical name in Portuguese outside ${EXCEPTIONS_FILE}.`
      : `\nRESULT: ${failures.length} name(s) in Portuguese without an exception, ${unused.length} unused exception(s), ${problems.length} invalid exception(s).\n` +
        `Rename to English. If it is a contract, record it in ${EXCEPTIONS_FILE} with the class, for review in the PR.`,
  );
  process.exit(ok ? 0 : 1);
}

/* Always runs: nothing imports this file. Comparing paths fails through a junction or symlink, and the proof would silently exit 0. */
main();
