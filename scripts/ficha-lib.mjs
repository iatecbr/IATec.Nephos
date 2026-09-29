/**
 * Leitura da ficha e geracao da Metadata.
 *
 * A ficha em `fichas/<nome>.md` e a fonte do contrato da peca; a Metadata e
 * uma copia derivada, em JSON, para quem le por maquina. Este arquivo so tem
 * funcoes puras: nao le nem grava disco.
 *
 * O repositorio nao tem leitor de YAML, e adotar um custaria uma dependencia
 * nova. Por isso o leitor aqui cobre so o SUBCONJUNTO que o gabarito usa, e
 * recusa com o numero da linha tudo o que nao reconhece. Recusar e melhor que
 * adivinhar: um valor lido errado vira Metadata errada, em silencio.
 *
 * O que entra:
 *   - so o primeiro par `---` do arquivo, com o primeiro `---` na linha 1;
 *   - mapa por recuo de 2 espacos; chave feita de letra, numero, `_`, `-`,
 *     `.` e `/`;
 *   - lista com `- `, cujos itens sao escalares;
 *   - lista em linha `[...]`, que respeita aspas duplas; `[]`;
 *   - bloco dobrado `>-`, que vira uma linha so;
 *   - linha em branco entre chaves.
 *
 * Escalares: entre aspas duplas vira texto; `true` e `false` viram booleano;
 * so digitos vira numero; o resto vira texto, inclusive data e `nulo`.
 *
 * O que se recusa: `|`, ancora, etiqueta, `#` de comentario fora de aspas,
 * tabulacao, lista de listas, mapa dentro de lista, mapa em linha `{...}`,
 * aspas simples, barra invertida dentro de aspas, chave repetida no mesmo mapa,
 * `__proto__`, bloco `>-` com recuo irregular, numero acima do inteiro seguro,
 * texto sem aspas que comeca com indicador de YAML, texto sem aspas que o YAML
 * leria como null, booleano ou numero, espaco no fim de linha dentro de `>-`
 * e chave numerica (o JSON reordenaria chave numerica e quebraria a ordem da
 * ficha).
 */

/** Erro de leitura com a linha do arquivo onde ele aconteceu. */
export class SpecError extends Error {
  constructor(line, message) {
    super(message);
    this.line = line;
  }
}

const KEY = /^([A-Za-z0-9_./-]+):(?: (.*))?$/;
const NUMERIC_KEY = /^\d+$/;

/**
 * Texto sem aspas que o YAML 1.1 ou 1.2 resolveria como null, booleano ou
 * numero. So `true`, `false` e inteiro decimal sem zero a esquerda sao lidos
 * como tipo; o resto destes seria texto aqui e tipo no YAML padrao, e a
 * Metadata divergiria em silencio. Por isso se recusa.
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
 * Separa o frontmatter. Devolve `null` quando o arquivo nao comeca com `---`
 * na linha 1: esse arquivo nao e ficha, e fica de fora sem reprovar.
 */
export function extractFrontmatter(text) {
  /* BOM no inicio (o PowerShell 5.1 grava assim) esconderia o `---` da linha 1. */
  const lines = text.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').split('\n');
  if (lines[0] !== '---') return null;
  const end = lines.indexOf('---', 1);
  if (end === -1) throw new SpecError(1, 'o frontmatter abre com `---` e nao fecha');
  return lines.slice(1, end).map((content, i) => ({ lineNumber: i + 2, content }));
}

/** Le o subconjunto de YAML. `lines` vem de `extractFrontmatter`. */
export function readYaml(lines) {
  const meaningful = [];
  for (const { lineNumber, content } of lines) {
    if (content.includes('\t')) throw new SpecError(lineNumber, 'tabulacao nao e aceita');
    if (content.trim() === '') {
      meaningful.push({ lineNumber, indent: -1, text: '', raw: content });
      continue;
    }
    const indent = content.length - content.trimStart().length;
    const text = content.trim();
    if (text.startsWith('#')) throw new SpecError(lineNumber, 'comentario `#` nao e aceito');
    meaningful.push({ lineNumber, indent, text, raw: content });
  }

  const state = { i: 0, lines: meaningful };
  skipBlankLines(state);
  if (state.i >= meaningful.length) return {};
  if (meaningful[state.i].indent !== 0) {
    throw new SpecError(meaningful[state.i].lineNumber, 'a primeira chave precisa comecar na coluna 1');
  }
  const root = readMap(state, 0);
  skipBlankLines(state);
  if (state.i < meaningful.length) {
    throw new SpecError(meaningful[state.i].lineNumber, 'recuo fora do esperado');
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
      throw new SpecError(line.lineNumber, 'item de lista onde se esperava uma chave');
    }
    const m = line.text.match(KEY);
    if (m === null) throw new SpecError(line.lineNumber, 'chave fora do formato `nome: valor`');
    const [, key, raw] = m;
    if (NUMERIC_KEY.test(key)) throw new SpecError(line.lineNumber, `chave numerica "${key}" nao e aceita`);
    if (key === 'true' || key === 'false' || AMBIGUOUS.some((re) => re.test(key))) {
      throw new SpecError(line.lineNumber, `a chave "${key}" o YAML leria como null, booleano ou numero`);
    }
    if (key === '__proto__') throw new SpecError(line.lineNumber, 'a chave __proto__ nao e aceita');
    if (Object.hasOwn(map, key)) throw new SpecError(line.lineNumber, `chave "${key}" repetida no mesmo mapa`);
    state.i += 1;
    const value = raw === undefined ? '' : raw.trim();

    if (value === '') {
      const child = peek(state);
      if (child === undefined || child.indent <= indent) {
        throw new SpecError(line.lineNumber, `a chave "${key}" nao tem valor`);
      }
      if (child.indent !== indent + 2) throw new SpecError(child.lineNumber, 'o recuo e de 2 espacos por nivel');
      map[key] = child.text.startsWith('- ') || child.text === '-'
        ? readList(state, indent + 2)
        : readMap(state, indent + 2);
      continue;
    }

    if (value === '>-') {
      map[key] = readFoldedBlock(state, indent, line.lineNumber);
      continue;
    }
    if (/^[|>]/.test(value)) throw new SpecError(line.lineNumber, `bloco "${value}" nao e aceito; so \`>-\``);

    map[key] = readValue(value, line.lineNumber);
    const after = peek(state);
    if (after !== undefined && after.indent > indent) {
      throw new SpecError(after.lineNumber, 'valor em mais de uma linha so e aceito com `>-`');
    }
  }
  return map;
}

function readList(state, indent) {
  const list = [];
  for (let line = peek(state); line !== undefined && line.indent === indent; line = peek(state)) {
    if (!(line.text.startsWith('- ') || line.text === '-')) {
      throw new SpecError(line.lineNumber, 'chave misturada com itens de lista');
    }
    const item = line.text.slice(1).trim();
    if (item === '') throw new SpecError(line.lineNumber, 'item de lista vazio ou aninhado');
    if (item.startsWith('[') || item.startsWith('- ')) throw new SpecError(line.lineNumber, 'lista de listas nao e aceita');
    if (!item.startsWith('"') && KEY.test(item)) throw new SpecError(line.lineNumber, 'mapa dentro de lista nao e aceito');
    list.push(readScalar(item, line.lineNumber));
    state.i += 1;
    const after = peek(state);
    if (after !== undefined && after.indent > indent) {
      throw new SpecError(after.lineNumber, 'item de lista em mais de uma linha nao e aceito');
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
        throw new SpecError(line.lineNumber, 'linha em branco dentro de bloco `>-` nao e aceita');
      }
      break;
    }
    if (line.indent <= indent) break;
    /* Recuo diferente dentro do bloco muda o sentido no YAML padrao (quebra de
     * linha preservada, ou erro). Recusar evita juntar em silencio. */
    if (blockIndent === null) blockIndent = line.indent;
    if (line.indent !== blockIndent) {
      throw new SpecError(line.lineNumber, 'todas as linhas de um bloco `>-` tem de ter o mesmo recuo');
    }
    /* O YAML preserva espaco no fim de linha de bloco; aparar mudaria o texto. */
    if (/ $/.test(line.raw)) throw new SpecError(line.lineNumber, 'espaco no fim de linha dentro de bloco `>-` nao e aceito');
    parts.push(line.text);
    state.i += 1;
  }
  if (parts.length === 0) throw new SpecError(keyLineNumber, 'bloco `>-` vazio');
  return parts.join(' ');
}

function readValue(value, lineNumber) {
  if (value.startsWith('[')) return readInlineList(value, lineNumber);
  return readScalar(value, lineNumber);
}

function readInlineList(value, lineNumber) {
  if (!value.endsWith(']')) throw new SpecError(lineNumber, 'lista em linha sem `]` no fim');
  const inner = value.slice(1, -1);
  if (inner.trim() === '') return [];
  const items = [];
  let current = '';
  let inQuotes = false;
  for (const c of inner) {
    /* A aspa so abre no comeco do item; no meio de texto sem aspas ela fica no
     * texto, e `readScalar` a recusa. */
    if (c === '"' && (inQuotes || current.trim() === '')) inQuotes = !inQuotes;
    if (!inQuotes && (c === '[' || c === ']')) throw new SpecError(lineNumber, 'lista de listas nao e aceita');
    if (!inQuotes && c === ',') {
      items.push(current);
      current = '';
      continue;
    }
    current += c;
  }
  if (inQuotes) throw new SpecError(lineNumber, 'aspas abertas e nao fechadas');
  items.push(current);
  return items.map((item) => {
    const trimmed = item.trim();
    if (trimmed === '') throw new SpecError(lineNumber, 'item vazio em lista em linha');
    return readScalar(trimmed, lineNumber);
  });
}

function readScalar(value, lineNumber) {
  if (value.startsWith('"')) {
    if (value.length < 2 || !value.endsWith('"')) throw new SpecError(lineNumber, 'aspas abertas e nao fechadas');
    const inner = value.slice(1, -1);
    if (inner.includes('\\')) throw new SpecError(lineNumber, 'barra invertida dentro de aspas nao e aceita');
    if (inner.includes('"')) throw new SpecError(lineNumber, 'aspas dentro de aspas nao sao aceitas');
    return inner;
  }
  if (value.includes('"')) throw new SpecError(lineNumber, 'aspas no meio de texto sem aspas nao sao aceitas');
  if (value.startsWith("'")) throw new SpecError(lineNumber, 'aspas simples nao sao aceitas; use aspas duplas');
  if (/^[&*!]/.test(value)) throw new SpecError(lineNumber, 'ancora, alias e etiqueta nao sao aceitos');
  if (/^[{}]/.test(value)) throw new SpecError(lineNumber, 'mapa em linha `{...}` nao e aceito');
  if (/^[|>]/.test(value)) throw new SpecError(lineNumber, 'bloco `|` ou `>` so e aceito como `>-` depois de uma chave');
  if (value === '-' || value.startsWith('- ')) throw new SpecError(lineNumber, 'lista de listas nao e aceita');
  if (/^[@`%?]/.test(value)) throw new SpecError(lineNumber, 'texto sem aspas nao pode comecar com @, crase, % ou ?; use aspas duplas');
  if (/(^|\s)#/.test(value)) throw new SpecError(lineNumber, 'comentario `#` fora de aspas nao e aceito');
  if (/: /.test(value) || value.endsWith(':')) {
    throw new SpecError(lineNumber, 'texto sem aspas com `: ` e ambiguo; use aspas duplas');
  }
  if (/^[,\]]/.test(value) || value === '=' || value === '<<') {
    throw new SpecError(lineNumber, 'texto sem aspas nao pode comecar com , ou ] nem ser = ou <<; use aspas duplas');
  }
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (AMBIGUOUS.some((re) => re.test(value)) && !/^(0|[1-9]\d*)$/.test(value)) {
    throw new SpecError(lineNumber, `o YAML leria "${value}" como null, booleano ou numero; use aspas duplas para texto`);
  }
  if (/^\d+$/.test(value)) {
    const n = Number(value);
    if (!Number.isSafeInteger(n)) throw new SpecError(lineNumber, 'numero grande demais para JSON sem perder precisao; use aspas duplas');
    return n;
  }
  return value;
}

/**
 * Le uma ficha inteira. Devolve `null` quando o arquivo nao e ficha (sem `---`
 * na linha 1); senao `{ dados, vigente, json }`. Lanca `SpecError`.
 *
 * O fim de linha e normalizado aqui mesmo: com `core.autocrlf`, a ficha chega
 * em CRLF no Windows e em LF no resto, e a Metadata tem de sair igual.
 */
export function readSpec(text) {
  const lines = extractFrontmatter(text);
  if (lines === null) return null;
  const data = readYaml(lines);
  return {
    data,
    inForce: data.status === 'vigente',
    json: JSON.stringify(data, null, 2) + '\n',
  };
}
