/**
 * Prova das versoes de idioma.
 *
 * O ponto central: uma traducao desatualizada nao pode PARECER vigente. Cada
 * traducao declara o hash do conteudo da fonte que traduziu; se a fonte mudou,
 * o hash deixa de bater e este script reprova.
 *
 * Usamos hash do CONTEUDO, nao do commit: o commit que publica a fonte e o
 * mesmo que publica a traducao, entao referenciar commit seria circular.
 *
 * Rode com: npm run test:i18n
 * Depois de traduzir uma alteracao: npm run i18n:update
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LANGUAGES = ['en', 'es'];
const FOLDERS = ['.', 'docs'];
const UPDATE = process.argv.includes('--update');

/**
 * Identificadores que NUNCA sao traduzidos. Se um deles aparece na fonte e
 * some de uma traducao, alguem traduziu nome tecnico.
 */
const PROTECTED = [
  'nph-',
  'data-nph-brand',
  'data-nph-color-scheme',
  'com.iatec.nephos',
  'npm run build:tokens',
  'design.md',
  'src/tokens/source',
  'src/tokens/generated',
];

/** Normaliza fim de linha para que CRLF e LF produzam o mesmo hash. */
function hashOf(text) {
  return createHash('sha256').update(text.replace(/\r\n/g, '\n'), 'utf8').digest('hex');
}

function read(filePath) {
  return readFileSync(filePath, 'utf8');
}

const HEADER =
  /^<!-- i18n: lang=([a-z-]+) \| source=(\S+) \| source-sha256=(\S+) \| status=(\S+) -->/;

/**
 * Uma traducao so vale como versao publicada depois de lida por uma pessoa.
 * Ate la ela e `rascunho`, e diz isso em voz alta no proprio arquivo.
 */
const STATUSES = ['rascunho', 'revisado'];

const failures = [];
const warnings = [];
const drafts = [];
let checked = 0;
let updated = 0;

/** Encontra os pares fonte -> traducoes pela convencao de sufixo. */
function pairsOf(folder) {
  const pairs = new Map();
  for (const name of readdirSync(folder)) {
    const m = name.match(/^(.+)\.(en|es)\.md$/);
    if (!m) continue;
    const [, base, language] = m;
    const source = join(folder, `${base}.md`).replace(/\\/g, '/');
    if (!pairs.has(source)) pairs.set(source, []);
    pairs.get(source).push({ language, filePath: join(folder, name).replace(/\\/g, '/') });
  }
  return pairs;
}

for (const folder of FOLDERS) {
  for (const [source, translations] of pairsOf(folder)) {
    let sourceText;
    try {
      sourceText = read(source);
    } catch {
      failures.push(`${source}: existe traducao, mas a fonte nao existe`);
      continue;
    }

    const expected = hashOf(sourceText);
    const present = translations.map((t) => t.language);
    for (const language of LANGUAGES) {
      if (!present.includes(language)) {
        failures.push(`${source}: falta a versao "${language}"`);
      }
    }

    /* O seletor de idioma precisa existir nos tres arquivos. */
    if (!sourceText.includes('**Português (BR)**')) {
      failures.push(`${source}: sem o seletor de idioma no topo`);
    }

    for (const { language, filePath } of translations) {
      checked += 1;
      const text = read(filePath);
      const header = text.match(HEADER);

      if (header === null) {
        failures.push(`${filePath}: sem o comentario de rastreio na primeira linha`);
        continue;
      }

      const [fullLine, declaredLanguage, declaredSource, declaredHash, state] = header;

      if (!STATUSES.includes(state)) {
        failures.push(`${filePath}: status=${state} nao existe — use ${STATUSES.join(" ou ")}`);
      } else if (state === "rascunho") {
        drafts.push(filePath);
      }

      if (declaredLanguage !== language) {
        failures.push(`${filePath}: declara lang=${declaredLanguage}, mas o nome do arquivo diz ${language}`);
      }
      if (declaredSource !== source) {
        failures.push(`${filePath}: declara source=${declaredSource}, mas a fonte e ${source}`);
      }

      if (declaredHash !== expected) {
        if (UPDATE) {
          const updatedText = text.replace(
            fullLine,
            `<!-- i18n: lang=${language} | source=${source} | source-sha256=${expected} | status=${state} -->`,
          );
          writeFileSync(filePath, updatedText, 'utf8');
          updated += 1;
          console.log(`atualizado: ${filePath}`);
        } else if (declaredHash === 'PENDING') {
          failures.push(`${filePath}: hash da fonte nao gravado — rode npm run i18n:update`);
        } else {
          failures.push(
            `${filePath}: DESATUALIZADO — a fonte ${source} mudou depois desta traducao`,
          );
        }
      }

      /* Ninguem pode ter traduzido identificador tecnico. */
      for (const term of PROTECTED) {
        if (sourceText.includes(term) && !text.includes(term)) {
          failures.push(`${filePath}: o identificador tecnico "${term}" sumiu da traducao`);
        }
      }

      /* Os links entre idiomas precisam apontar para arquivos que existem. */
      for (const target of text.matchAll(/\]\(([A-Za-z0-9._-]+\.(?:en|es)?\.?md)\)/g)) {
        const destination = join(folder, target[1]).replace(/\\/g, '/');
        try {
          read(destination);
        } catch {
          warnings.push(`${filePath}: link de idioma aponta para ${destination}, que nao existe`);
        }
      }
    }
  }
}

if (UPDATE) {
  console.log(`\n${updated} hash(es) gravado(s).`);
}

console.log(`\n${checked} traducao(oes) conferida(s).`);

if (drafts.length > 0) {
  console.log(`${drafts.length} em RASCUNHO, aguardando aceitacao:`);
  for (const filePath of drafts) {
    console.log(`  - ${filePath}`);
  }
}

for (const warning of warnings) {
  console.log(`AVISO   ${warning}`);
}

if (failures.length > 0) {
  console.error('\nFALHOU:');
  for (const fail of failures) {
    console.error(`  - ${fail}`);
  }
  process.exit(1);
}

console.log('OK: idioma, fonte, hash, seletor e identificadores tecnicos conferem.');
