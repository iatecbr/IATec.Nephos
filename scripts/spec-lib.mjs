/**
 * Spec reading and Metadata generation.
 *
 * The spec in `fichas/<name>.md` is the source of the piece contract; the
 * Metadata is a derived JSON copy, for whoever reads by machine. This file
 * only has pure functions: it neither reads nor writes disk.
 *
 * The repository has no YAML reader, and adopting one would cost a new
 * dependency. So the reader here covers only the SUBSET the template uses,
 * and rejects with the line number everything it does not recognize.
 * Rejecting beats guessing: a wrongly read value becomes wrong Metadata,
 * silently.
 *
 * What is accepted:
 *   - only the first `---` pair of the file, with the first `---` on line 1;
 *   - map by 2-space indentation; key made of letter, digit, `_`, `-`,
 *     `.` and `/`;
 *   - list with `- `, whose items are scalars;
 *   - inline list `[...]`, which respects double quotes; `[]`;
 *   - folded block `>-`, which becomes a single line;
 *   - blank line between keys.
 *
 * Scalars: between double quotes it becomes text; `true` and `false` become
 * boolean; digits only becomes number; the rest becomes text, including date
 * and `unset`.
 *
 * What is rejected: `|`, anchor, tag, comment `#` outside quotes,
 * tab, list of lists, map inside list, inline map `{...}`,
 * single quotes, backslash inside quotes, repeated key in the same map,
 * `__proto__`, `>-` block with irregular indentation, number above the safe
 * integer, unquoted text that starts with a YAML indicator, unquoted text that
 * YAML would read as null, boolean or number, trailing space inside `>-`
 * and numeric key (JSON would reorder a numeric key and break the order of
 * the spec).
 */

/** Read error with the file line where it happened. */
export class SpecError extends Error {
  constructor(line, message) {
    super(message);
    this.line = line;
  }
}

const KEY = /^([A-Za-z0-9_./-]+):(?: (.*))?$/;
const NUMERIC_KEY = /^\d+$/;

/**
 * Unquoted text that YAML 1.1 or 1.2 would resolve as null, boolean or
 * number. Only `true`, `false` and decimal integer without a leading zero are
 * read as a type; the rest of these would be text here and a type in standard
 * YAML, and the Metadata would diverge silently. That is why it is rejected.
 */
const AMBIGUOUS = [
  /^(?:null|Null|NULL|~)$/,
  /^(?:y|Y|yes|Yes|YES|n|N|no|No|NO|True|TRUE|False|FALSE|on|On|ON|off|Off|OFF)$/,
  /^[-+]?(?:0b[01_]+|0x[0-9a-fA-F_]+|0o[0-7]+|0[0-7_]+|[0-9][0-9_]*)$/,
  /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+(?:\.[0-9_]*)?$/,
  /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*(?:[eE][-+]?[0-9]+)?$/,
  /^[-+]?[0-9][0-9_]*[eE][-+]?[0-9]+$/,
  /^[-+]?\.(?:inf|Inf|INF)$/,
  /^\.(?:nan|NaN|NAN)$/,
];

/**
 * Splits the frontmatter. Returns `null` when the file does not start with
 * `---` on line 1: that file is not a spec, and is left out without failing.
 */
export function extractFrontmatter(text) {
  /* A BOM at the start (PowerShell 5.1 writes it) would hide the `---` on line 1. */
  const lines = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').split('\n');
  if (lines[0] !== '---') return null;
  const end = lines.indexOf('---', 1);
  if (end === -1) throw new SpecError(1, 'the frontmatter opens with `---` and does not close');
  return lines.slice(1, end).map((content, i) => ({ lineNumber: i + 2, content }));
}

/** Reads the YAML subset. `lines` comes from `extractFrontmatter`. */
export function readYaml(lines) {
  const meaningful = [];
  for (const { lineNumber, content } of lines) {
    if (content.includes('\t')) throw new SpecError(lineNumber, 'tab is not accepted');
    if (content.trim() === '') {
      meaningful.push({ lineNumber, indent: -1, text: '', raw: content });
      continue;
    }
    const indent = content.length - content.trimStart().length;
    const text = content.trim();
    if (text.startsWith('#')) throw new SpecError(lineNumber, 'comment `#` is not accepted');
    meaningful.push({ lineNumber, indent, text, raw: content });
  }

  const state = { i: 0, lines: meaningful };
  skipBlankLines(state);
  if (state.i >= meaningful.length) return {};
  if (meaningful[state.i].indent !== 0) {
    throw new SpecError(meaningful[state.i].lineNumber, 'the first key must start at column 1');
  }
  const root = readMap(state, 0);
  skipBlankLines(state);
  if (state.i < meaningful.length) {
    throw new SpecError(meaningful[state.i].lineNumber, 'unexpected indentation');
  }
  return root;
}

function skipBlankLines(state) {
  while (state.i < state.lines.length && state.lines[state.i].indent === -1) state.i += 1;
}

function peek(state) {
  skipBlankLines(state);
  return state.lines[state.i];
}

function readMap(state, indent) {
  const map = {};
  for (let line = peek(state); line !== undefined && line.indent === indent; line = peek(state)) {
    if (line.text.startsWith('-')) {
      throw new SpecError(line.lineNumber, 'list item where a key was expected');
    }
    const m = line.text.match(KEY);
    if (m === null) throw new SpecError(line.lineNumber, 'key outside the `name: value` format');
    const [, key, raw] = m;
    if (NUMERIC_KEY.test(key)) throw new SpecError(line.lineNumber, `numeric key "${key}" is not accepted`);
    if (key === 'true' || key === 'false' || AMBIGUOUS.some((re) => re.test(key))) {
      throw new SpecError(line.lineNumber, `key "${key}" would be read by YAML as null, boolean or number`);
    }
    if (key === '__proto__') throw new SpecError(line.lineNumber, 'key __proto__ is not accepted');
    if (Object.hasOwn(map, key)) throw new SpecError(line.lineNumber, `key "${key}" repeated in the same map`);
    state.i += 1;
    const value = raw === undefined ? '' : raw.trim();

    if (value === '') {
      const child = peek(state);
      if (child === undefined || child.indent <= indent) {
        throw new SpecError(line.lineNumber, `key "${key}" has no value`);
      }
      if (child.indent !== indent + 2) throw new SpecError(child.lineNumber, 'indentation is 2 spaces per level');
      map[key] = child.text.startsWith('- ') || child.text === '-'
        ? readList(state, indent + 2)
        : readMap(state, indent + 2);
      continue;
    }

    if (value === '>-') {
      map[key] = readFoldedBlock(state, indent, line.lineNumber);
      continue;
    }
    if (/^[|>]/.test(value)) throw new SpecError(line.lineNumber, `block "${value}" is not accepted; only \`>-\``);

    map[key] = readValue(value, line.lineNumber);
    const after = peek(state);
    if (after !== undefined && after.indent > indent) {
      throw new SpecError(after.lineNumber, 'a value on more than one line is only accepted with `>-`');
    }
  }
  return map;
}

function readList(state, indent) {
  const list = [];
  for (let line = peek(state); line !== undefined && line.indent === indent; line = peek(state)) {
    if (!(line.text.startsWith('- ') || line.text === '-')) {
      throw new SpecError(line.lineNumber, 'key mixed with list items');
    }
    const item = line.text.slice(1).trim();
    if (item === '') throw new SpecError(line.lineNumber, 'empty or nested list item');
    if (item.startsWith('[') || item.startsWith('- ')) throw new SpecError(line.lineNumber, 'list of lists is not accepted');
    if (!item.startsWith('"') && KEY.test(item)) throw new SpecError(line.lineNumber, 'map inside list is not accepted');
    list.push(readScalar(item, line.lineNumber));
    state.i += 1;
    const after = peek(state);
    if (after !== undefined && after.indent > indent) {
      throw new SpecError(after.lineNumber, 'list item on more than one line is not accepted');
    }
  }
  return list;
}

function readFoldedBlock(state, indent, keyLineNumber) {
  const parts = [];
  let blockIndent = null;
  while (state.i < state.lines.length) {
    const line = state.lines[state.i];
    if (line.indent === -1) {
      const nextLine = state.lines.slice(state.i + 1).find((l) => l.indent !== -1);
      if (nextLine !== undefined && nextLine.indent > indent) {
        throw new SpecError(line.lineNumber, 'blank line inside `>-` block is not accepted');
      }
      break;
    }
    if (line.indent <= indent) break;
    /* Different indentation inside the block changes the meaning in standard YAML
     * (line break preserved, or error). Rejecting avoids joining it silently. */
    if (blockIndent === null) blockIndent = line.indent;
    if (line.indent !== blockIndent) {
      throw new SpecError(line.lineNumber, 'all lines of a `>-` block must have the same indentation');
    }
    /* YAML preserves trailing space on a block line; trimming would change the text. */
    if (/ $/.test(line.raw)) throw new SpecError(line.lineNumber, 'trailing space on a line inside a `>-` block is not accepted');
    parts.push(line.text);
    state.i += 1;
  }
  if (parts.length === 0) throw new SpecError(keyLineNumber, 'empty `>-` block');
  return parts.join(' ');
}

function readValue(value, lineNumber) {
  if (value.startsWith('[')) return readInlineList(value, lineNumber);
  return readScalar(value, lineNumber);
}

function readInlineList(value, lineNumber) {
  if (!value.endsWith(']')) throw new SpecError(lineNumber, 'inline list without `]` at the end');
  const inner = value.slice(1, -1);
  if (inner.trim() === '') return [];
  const items = [];
  let current = '';
  let inQuotes = false;
  for (const c of inner) {
    /* A quote only opens at the start of the item; in the middle of unquoted text it stays
     * in the text, and `readScalar` rejects it. */
    if (c === '"' && (inQuotes || current.trim() === '')) inQuotes = !inQuotes;
    if (!inQuotes && (c === '[' || c === ']')) throw new SpecError(lineNumber, 'list of lists is not accepted');
    if (!inQuotes && c === ',') {
      items.push(current);
      current = '';
      continue;
    }
    current += c;
  }
  if (inQuotes) throw new SpecError(lineNumber, 'quotes opened and not closed');
  items.push(current);
  return items.map((item) => {
    const trimmed = item.trim();
    if (trimmed === '') throw new SpecError(lineNumber, 'empty item in inline list');
    return readScalar(trimmed, lineNumber);
  });
}

function readScalar(value, lineNumber) {
  if (value.startsWith('"')) {
    if (value.length < 2 || !value.endsWith('"')) throw new SpecError(lineNumber, 'quotes opened and not closed');
    const inner = value.slice(1, -1);
    if (inner.includes('\\')) throw new SpecError(lineNumber, 'backslash inside quotes is not accepted');
    if (inner.includes('"')) throw new SpecError(lineNumber, 'quotes inside quotes are not accepted');
    return inner;
  }
  if (value.includes('"')) throw new SpecError(lineNumber, 'quotes in the middle of unquoted text are not accepted');
  if (value.startsWith("'")) throw new SpecError(lineNumber, 'single quotes are not accepted; use double quotes');
  if (/^[&*!]/.test(value)) throw new SpecError(lineNumber, 'anchor, alias and tag are not accepted');
  if (/^[{}]/.test(value)) throw new SpecError(lineNumber, 'inline map `{...}` is not accepted');
  if (/^[|>]/.test(value)) throw new SpecError(lineNumber, 'block `|` or `>` is only accepted as `>-` after a key');
  if (value === '-' || value.startsWith('- ')) throw new SpecError(lineNumber, 'list of lists is not accepted');
  if (/^[@`%?]/.test(value)) throw new SpecError(lineNumber, 'unquoted text cannot start with @, backtick, % or ?; use double quotes');
  if (/(^|\s)#/.test(value)) throw new SpecError(lineNumber, 'comment `#` outside quotes is not accepted');
  if (/: /.test(value) || value.endsWith(':')) {
    throw new SpecError(lineNumber, 'unquoted text with `: ` is ambiguous; use double quotes');
  }
  if (/^[,\]]/.test(value) || value === '=' || value === '<<') {
    throw new SpecError(lineNumber, 'unquoted text cannot start with , or ] nor be = or <<; use double quotes');
  }
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (AMBIGUOUS.some((re) => re.test(value)) && !/^(0|[1-9]\d*)$/.test(value)) {
    throw new SpecError(lineNumber, `YAML would read "${value}" as null, boolean or number; use double quotes for text`);
  }
  if (/^\d+$/.test(value)) {
    const n = Number(value);
    if (!Number.isSafeInteger(n)) throw new SpecError(lineNumber, 'number too large for JSON without losing precision; use double quotes');
    return n;
  }
  return value;
}

/**
 * Reads a whole spec. Returns `null` when the file is not a spec (no `---`
 * on line 1); otherwise `{ data, inForce, json }`. Throws `SpecError`.
 *
 * The line ending is normalized right here: with `core.autocrlf`, the spec
 * arrives as CRLF on Windows and LF elsewhere, and the Metadata must come out the same.
 */
export function readSpec(text) {
  const lines = extractFrontmatter(text);
  if (lines === null) return null;
  const data = readYaml(lines);
  return {
    data,
    inForce: data.status === 'active',
    json: JSON.stringify(data, null, 2) + '\n',
  };
}
