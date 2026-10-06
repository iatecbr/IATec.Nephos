/**
 * Portuguese detector for running text: code comments, code messages and the
 * documentation (P64, amendment of 06/10/2026).
 *
 * It works by vocabulary only, never by word ending: running English text has
 * too many words that end like Portuguese ones. A word counts as Portuguese when
 *   - it carries a Portuguese accent (tilde, cedilla, acute, circumflex or grave on a vowel);
 *   - it is in `portuguese` of scripts/naming-vocabulary.json, or is the -s plural of one;
 *   - it is in `portugueseFunctionWords`, the closed list of Portuguese function words.
 * A word in `english` never counts.
 *
 * Before the words are split, what is not running text comes out: code spans
 * between backticks, URLs (link targets, autolinks, bare http and any dotted
 * name such as figma.com or com.iatec.nephos), paths with a slash (such as
 * docs/operacao/tarefas/ in a recorded command), command-line flags (--name) and the three language names of
 * the language selector. A Portuguese pair written with a slash passes too: a
 * known limit.
 *
 * Known limit: a Portuguese word that is not in the vocabulary, has no accent
 * and is not a function word passes. Every word a review finds goes into
 * scripts/naming-vocabulary.json, with a case in scripts/fixtures/naming/cases.json.
 */
import fs from 'node:fs';
import path from 'node:path';

/** Function words that are also English (or a CSS unit) and never count. */
export const EXCLUDED_FUNCTION_WORDS = ['do', 'no', 'as', 'os', 'a', 'e', 'o', 'em', 'so', 'um'];

/* Built from code points, so this file has no accented letter of its own. */
const chars = (...codes) => String.fromCharCode(...codes);
const ACCENT = new RegExp(`[${chars(0xe3, 0xf5, 0xe7, 0xe1, 0xe9, 0xed, 0xf3, 0xfa, 0xe2, 0xea, 0xf4, 0xe0)}]`, 'i');
const LETTERS = new RegExp(`[A-Za-z${chars(0xc0)}-${chars(0xff)}]+`, 'g');
/** The three names of the language selector; they are names, not running text. */
const LANGUAGE_NAMES = new RegExp(`Portugu${chars(0xea)}s \\(BR\\)|Portugu${chars(0xea)}s|Espa${chars(0xf1)}ol`, 'g');

export function createDetector(vocabulary) {
  const ptWords = new Set(vocabulary.portuguese);
  const functionWords = new Set(vocabulary.portugueseFunctionWords);
  const enWords = new Set(vocabulary.english);

  function isPtProseWord(word) {
    const w = word.toLowerCase();
    if (w.length < 2 || enWords.has(w)) return false;
    if (ACCENT.test(w)) return true;
    if (functionWords.has(w)) return true;
    return ptWords.has(w) || (w.endsWith('s') && ptWords.has(w.slice(0, -1)));
  }

  /** Portuguese words of a running text, each with its index in the text. */
  function ptWordsInProse(text) {
    const blank = (m) => ' '.repeat(m.length);
    const cleaned = text
      .replace(/`[^`\n]*`/g, blank)
      .replace(/\]\([^)\s]*\)/g, blank)
      .replace(/<[a-z]+:[^>\s]*>/gi, blank)
      .replace(/\b[a-z][a-z0-9+.-]*:\/\/\S+/gi, blank)
      .replace(/[\p{L}\p{N}_.-]*[\p{L}\p{N}_]\/[\p{L}\p{N}_./-]*|\/[\p{L}\p{N}_.-]+\//gu, blank)
      .replace(/(?<![\p{L}\p{N}_-])--[a-z][\w-]*/giu, blank)
      .replace(/[\p{L}\p{N}_-]+(?:\.[\p{L}\p{N}_-]+)+/gu, blank)
      .replace(LANGUAGE_NAMES, blank);
    const out = [];
    for (const m of cleaned.matchAll(LETTERS)) {
      /* A function word glued to a hyphen is part of an English compound (de-duplicate). */
      if (functionWords.has(m[0].toLowerCase()) && cleaned[m.index + m[0].length] === '-') continue;
      if (isPtProseWord(m[0])) out.push({ word: m[0], index: m.index });
    }
    return out;
  }

  return { isPtProseWord, ptWordsInProse };
}

/** Documentation in scope, by group. Translations (*.es.md, *.pt-BR.md, *.en.md) stay out. */
export const DOC_GROUPS = {
  docs: { files: ['README.md', 'AGENTS.md', 'CLAUDE.md', 'GOVERNANCA.md', 'contributing.md', 'design.md'], dirs: ['docs'] },
  specs: { files: [], dirs: ['fichas'] },
};
const TRANSLATION = /\.(?:es|pt-BR|en)\.md$/;

function walkMarkdown(dir, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.posix.join(dir, entry.name);
    if (entry.isDirectory()) walkMarkdown(rel, acc);
    else if (rel.endsWith('.md') && !TRANSLATION.test(rel)) acc.push(rel);
  }
  return acc;
}

/** Documentation files of each group, relative to the current directory. */
export function docFiles() {
  const out = [];
  for (const [group, { files, dirs }] of Object.entries(DOC_GROUPS)) {
    for (const file of files) if (fs.existsSync(file)) out.push({ file, group });
    for (const dir of dirs) if (fs.existsSync(dir)) for (const file of walkMarkdown(dir, [])) out.push({ file, group });
  }
  return out;
}

/**
 * Running text of a Markdown file, line by line: { line, text }.
 * A fenced block is code and stays out, except json, yaml and the front matter,
 * whose string values with a space are text. A value without a space is a
 * technical value (an enum such as `aguardando-decisao`) and a key never counts:
 * both are contract (P64, D4).
 */
export function docProse(source) {
  const lines = source.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let fence = null;
  let frontMatter = lines[0] === '---';
  /* Indent of a YAML key that opened a block scalar (key: >- or key: |); its deeper lines are text. */
  let blockIndent = null;
  const dataValues = (line, kind) => {
    const values = [];
    if (kind === 'yaml') {
      const indent = line.match(/^\s*/)[0].length;
      if (blockIndent !== null && (line.trim() === '' || indent > blockIndent)) return line.trim();
      blockIndent = null;
      const block = /^(\s*)-?\s*[\w"'-]+\s*:\s*[>|][-+]?\s*$/.exec(line);
      if (block) { blockIndent = block[1].length; return ''; }
    }
    if (kind === 'json') {
      /* Each string in order, so quotes pair up; a string followed by a colon is a key. */
      for (const m of line.matchAll(/"((?:[^"\\]|\\.)*)"(\s*:)?/g)) if (!m[2]) values.push(m[1]);
    } else {
      const m = /^\s*-?\s*[\w"'-]+\s*:\s*(.+)$/.exec(line) ?? /^\s*-\s+(.+)$/.exec(line);
      if (m) values.push(m[1].trim().replace(/^["']|["']$/g, ''));
    }
    return values.filter((v) => /\s/.test(v.trim())).join(' ');
  };
  lines.forEach((text, i) => {
    const line = i + 1;
    if (frontMatter) {
      if (i > 0 && text === '---') frontMatter = false;
      else if (i > 0) out.push({ line, text: dataValues(text, 'yaml') });
      return;
    }
    const open = /^\s*(```+|~~~+)\s*([\w-]*)/.exec(text);
    if (fence) {
      if (open && open[1][0] === fence.marker[0] && open[1].length >= fence.marker.length && !open[2]) fence = null;
      else if (fence.kind) out.push({ line, text: dataValues(text, fence.kind) });
      return;
    }
    if (open) {
      blockIndent = null;
      const info = open[2].toLowerCase();
      fence = { marker: open[1], kind: info === 'json' ? 'json' : info === 'yaml' || info === 'yml' ? 'yaml' : null };
      return;
    }
    out.push({ line, text });
  });
  return out;
}
