/**
 * Confere o `src/tokens/generated/tokens.css` contra a leitura do Figma de
 * 2026-10-05 gravada em `tokens-figma-2026-10-05.json`, nesta mesma pasta.
 *
 * So leitura e sem dependencia. Rode da raiz do repositorio:
 *   node docs/operacao/evidencias/DSA-04/conferir-tokens-figma.cjs
 *
 * Para cada token da leitura, procura a custom property no bloco certo do CSS:
 * - primitivo `core/*`: valor final (cor em hex; dimensao em rem, raiz 16);
 * - `theme/*`: alias em cada um dos 7 blocos `[data-nph-brand="<marca>"]`;
 * - semantico igual nos dois modos: alias uma vez no bloco `:root` dos
 *   invariantes; diferente: alias nos blocos de `light` (claro) e `dark` (escuro).
 * Imprime uma linha por divergencia e o total. Sai 1 se houver divergencia.
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const here = __dirname;
const reading = JSON.parse(fs.readFileSync(path.join(here, 'tokens-figma-2026-10-05.json'), 'utf8'));
const css = fs.readFileSync(path.join(here, '..', '..', '..', '..', 'src', 'tokens', 'generated', 'tokens.css'), 'utf8');

/** Lista de blocos { selector, props } na ordem do arquivo. */
function parseBlocks(text) {
  const blocks = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(text.replace(/\/\*[\s\S]*?\*\//g, ''))) !== null) {
    const selector = m[1].trim().replace(/\s+/g, ' ');
    const props = {};
    for (const decl of m[2].split(';')) {
      const i = decl.indexOf(':');
      if (i < 0) continue;
      props[decl.slice(0, i).trim()] = decl.slice(i + 1).trim();
    }
    blocks.push({ selector, props });
  }
  return blocks;
}

const blocks = parseBlocks(css);
const cssVar = (name) => '--nph-' + name.split('/').join('-');
const aliasVar = (name) => 'var(' + cssVar(name) + ')';
const SCHEME = { claro: '"light"', escuro: '"dark"' };

/** Valores da propriedade nos blocos cujo seletor satisfaz o teste. */
function valuesIn(prop, test) {
  return blocks.filter((b) => test(b.selector) && prop in b.props).map((b) => b.props[prop]);
}

const errors = [];
let checked = 0;

for (const { name, value } of reading.primitivos) {
  checked += 1;
  const prop = cssVar(name);
  const expected = typeof value === 'number' ? String(Number((value / 16).toFixed(6))) + 'rem' : value.toLowerCase();
  const found = valuesIn(prop, (s) => s === ':root');
  if (found.length !== 1 || found[0].toLowerCase() !== expected) {
    errors.push(name + ': esperado ' + expected + ', encontrado ' + JSON.stringify(found));
  }
}

for (const { name, modes } of [...reading.novos, ...reading.repontados]) {
  checked += 1;
  const prop = cssVar(name);
  if (name.startsWith('theme/')) {
    for (const [brand, v] of Object.entries(modes)) {
      const found = valuesIn(prop, (s) => s.includes('[data-nph-brand="' + brand + '"]'));
      if (found.length !== 1 || found[0] !== aliasVar(v.alias)) {
        errors.push(name + ' [' + brand + ']: esperado ' + aliasVar(v.alias) + ', encontrado ' + JSON.stringify(found));
      }
    }
    continue;
  }
  const light = aliasVar(modes.claro.alias);
  const dark = aliasVar(modes.escuro.alias);
  if (light === dark) {
    const found = valuesIn(prop, (s) => s === ':root');
    const inScheme = valuesIn(prop, (s) => s.includes('data-nph-color-scheme'));
    if (found.length !== 1 || found[0] !== light || inScheme.length !== 0) {
      errors.push(name + ': esperado ' + light + ' so em :root, encontrado ' + JSON.stringify({ root: found, esquema: inScheme }));
    }
  } else {
    for (const [mode, expected] of [['claro', light], ['escuro', dark]]) {
      const found = valuesIn(prop, (s) => s.includes('[data-nph-color-scheme=' + SCHEME[mode] + ']'));
      if (found.length !== 1 || found[0] !== expected) {
        errors.push(name + ' [' + mode + ']: esperado ' + expected + ', encontrado ' + JSON.stringify(found));
      }
    }
  }
}

for (const e of errors) console.log('DIVERGE  ' + e);
console.log('conferidos: ' + checked + ' tokens (' + reading.primitivos.length + ' primitivos, ' +
  reading.novos.length + ' novos, ' + reading.repontados.length + ' repontados); divergencias: ' + errors.length);
process.exit(errors.length ? 1 : 0);
