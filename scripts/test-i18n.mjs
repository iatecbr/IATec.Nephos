/**
 * Proof of the language versions.
 *
 * The central point: an outdated translation must not LOOK current. Each
 * translation declares the hash of the source content it translated; if the
 * source changed, the hash stops matching and this script fails.
 *
 * We use a hash of the CONTENT, not of the commit: the commit that publishes
 * the source is the same one that publishes the translation, so referencing a
 * commit would be circular.
 *
 * Run with: npm run test:i18n
 * After translating a change: npm run i18n:update
 */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** English is the source (P64, amendment of 06/10/2026); these are the translations. */
const LANGUAGES = ['pt-BR', 'es'];
const FOLDERS = ['.', 'docs'];
const UPDATE = process.argv.includes('--update');

/**
 * Identifiers that are NEVER translated. If one of them appears in the source
 * and vanishes from a translation, someone translated a technical name.
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

/** Normalizes line endings so CRLF and LF produce the same hash. */
function hashOf(text) {
  return createHash('sha256').update(text.replace(/\r\n/g, '\n'), 'utf8').digest('hex');
}

function read(filePath) {
  return readFileSync(filePath, 'utf8');
}

const HEADER =
  /^<!-- i18n: lang=([A-Za-z-]+) \| source=(\S+) \| source-sha256=(\S+) \| status=(\S+) -->/;

/**
 * A translation only counts as a published version after a person has read it.
 * Until then it is `rascunho`, and says so loudly in the file itself.
 */
const STATUSES = ['rascunho', 'revisado'];

const failures = [];
const warnings = [];
const drafts = [];
let checked = 0;
let updated = 0;

/** Finds the source -> translations pairs by the suffix convention. */
function pairsOf(folder) {
  const pairs = new Map();
  for (const name of readdirSync(folder)) {
    const m = name.match(/^(.+)\.(pt-BR|es)\.md$/);
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
      failures.push(`${source}: a translation exists, but the source does not`);
      continue;
    }

    const expected = hashOf(sourceText);
    const present = translations.map((t) => t.language);
    for (const language of LANGUAGES) {
      if (!present.includes(language)) {
        failures.push(`${source}: missing the "${language}" version`);
      }
    }

    /* The language selector must exist in all three files. */
    if (!sourceText.includes('**English**')) {
      failures.push(`${source}: no language selector at the top`);
    }

    for (const { language, filePath } of translations) {
      checked += 1;
      const text = read(filePath);
      const header = text.match(HEADER);

      if (header === null) {
        failures.push(`${filePath}: no tracking comment on the first line`);
        continue;
      }

      const [fullLine, declaredLanguage, declaredSource, declaredHash, state] = header;

      if (!STATUSES.includes(state)) {
        failures.push(`${filePath}: status=${state} does not exist — use ${STATUSES.join(" or ")}`);
      } else if (state === "rascunho") {
        drafts.push(filePath);
      }

      if (declaredLanguage !== language) {
        failures.push(`${filePath}: declares lang=${declaredLanguage}, but the file name says ${language}`);
      }
      if (declaredSource !== source) {
        failures.push(`${filePath}: declares source=${declaredSource}, but the source is ${source}`);
      }

      if (declaredHash !== expected) {
        if (UPDATE) {
          const updatedText = text.replace(
            fullLine,
            `<!-- i18n: lang=${language} | source=${source} | source-sha256=${expected} | status=${state} -->`,
          );
          writeFileSync(filePath, updatedText, 'utf8');
          updated += 1;
          console.log(`updated: ${filePath}`);
        } else if (declaredHash === 'PENDING') {
          failures.push(`${filePath}: source hash not recorded — run npm run i18n:update`);
        } else {
          failures.push(
            `${filePath}: OUTDATED — the source ${source} changed after this translation`,
          );
        }
      }

      /* No one may have translated a technical identifier. */
      for (const term of PROTECTED) {
        if (sourceText.includes(term) && !text.includes(term)) {
          failures.push(`${filePath}: the technical identifier "${term}" vanished from the translation`);
        }
      }

      /* Links between languages must point to files that exist. */
      for (const target of text.matchAll(/\]\(([A-Za-z0-9._-]+\.(?:en|es)?\.?md)\)/g)) {
        const destination = join(folder, target[1]).replace(/\\/g, '/');
        try {
          read(destination);
        } catch {
          warnings.push(`${filePath}: language link points to ${destination}, which does not exist`);
        }
      }
    }
  }
}

if (UPDATE) {
  console.log(`\n${updated} hash(es) recorded.`);
}

console.log(`\n${checked} translation(s) checked.`);

if (drafts.length > 0) {
  console.log(`${drafts.length} in DRAFT (\`rascunho\`), awaiting acceptance:`);
  for (const filePath of drafts) {
    console.log(`  - ${filePath}`);
  }
}

for (const warning of warnings) {
  console.log(`WARNING ${warning}`);
}

if (failures.length > 0) {
  console.error('\nFAILED:');
  for (const fail of failures) {
    console.error(`  - ${fail}`);
  }
  process.exit(1);
}

console.log('OK: language, source, hash, selector and technical identifiers match.');
