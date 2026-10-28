/**
 * Proof of American English (P64, amendment of 15/10/2026).
 *
 * First it checks the configuration itself: each probe below is fed to cspell
 * on stdin under the path it names, so `cspell.config.yaml` applies to it as
 * to a real file. A probe with `expect` must report those words; a probe
 * without it must pass. The probes guard the exclusions: code and quotations
 * stay out, while the text of a template literal, of a json block of a task
 * and of a design.md list item with a space stays in.
 *
 * Then it runs cspell over the repository and exits with its code.
 *
 * Run with: npm run test:spelling
 */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/*
 * The cspell entry runs with the same Node that runs this script, as in scripts/build-lib.mjs.
 * cspell does not export its package.json, so the folder comes from its main module.
 */
function cspellEntry() {
  let dir = dirname(fileURLToPath(import.meta.resolve('cspell')));
  while (!existsSync(join(dir, 'package.json'))) dir = dirname(dir);
  const { bin } = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  return join(dir, typeof bin === 'string' ? bin : bin.cspell);
}
const entry = cspellEntry();

/* The probes carry British and Portuguese words on purpose. */
/* cspell:disable */
const PROBES = [
  { name: 'Markdown prose', path: 'docs/probe.md', text: 'The colour of the text.\n', expect: ['colour'] },
  { name: 'Markdown citation between backticks', path: 'docs/probe.md', text: 'The word `colour` is British.\n' },
  {
    name: 'template literal in code',
    path: 'src/probe.ts',
    text: 'console.error(`Invalid colour: ${value}`);\n',
    expect: ['colour'],
  },
  {
    name: 'snake_case identifier in code',
    path: 'src/probe.ts',
    text: "const DEFAULT_COLOUR = 'red';\nfunction normalise_value(value) { return value; }\n",
    expect: ['colour', 'normalise'],
  },
  {
    name: 'member access in code',
    path: 'src/probe.ts',
    text: 'this.colour = value.normaliseText();\n',
    expect: ['colour', 'normalise'],
  },
  {
    name: 'file name, reverse domain and host',
    path: 'docs/probe.md',
    text: 'Run verificar-operacao.mjs, read com.iatec.nephos and open figma.com.\n',
  },
  {
    name: 'member of a member in code',
    path: 'src/probe.ts',
    text: 'const name = this.colour.app;\n',
    expect: ['colour'],
  },
  {
    name: 'public names, ARIA attributes, custom properties and token names in code',
    path: 'src/probe.ts',
    text: "el.setAttribute('aria-labelledby', 'nph-togglebutton');\nel.style.color = 'var(--nph-color-foreground)'; // color/foreground\n",
  },
  {
    name: 'reason of a language exception',
    path: 'scripts/language-exceptions.json',
    text: '[{ "file": "README.md", "class": "prose-text", "names": ["Sistemas"], "reason": "The colour of a brand." }]\n',
    expect: ['colour'],
  },
  { name: 'citation in a code comment', path: 'src/probe.ts', text: '/** The British `colour` is cited. */\n' },
  {
    name: 'template literal after a block comment on the same line',
    path: 'src/probe.ts',
    text: '/* validation */ console.error(`Invalid colour: ${value}`);\n',
    expect: ['colour'],
  },
  {
    name: 'json block, as the data of a task',
    path: 'docs/probe.md',
    text: '```json\n{\n  "goal": "Make the centre of the box the colour."\n}\n```\n',
    expect: ['centre', 'colour'],
  },
  {
    name: 'prose and a second json block after a json block',
    path: 'docs/probe.md',
    text: '```json\n{ "goal": "A goal." }\n```\n\nThe colour.\n\n```json\n{ "goal": "The centre." }\n```\n',
    expect: ['colour', 'centre'],
  },
  {
    name: 'json block fenced by four backticks, then a code block',
    path: 'docs/probe.md',
    text: '````json\n{ "goal": "The colour." }\n````\n\nThe centre.\n\n```sh\necho text\n```\n',
    expect: ['colour', 'centre'],
  },
  {
    name: 'prose after a code block closed by a longer fence',
    path: 'docs/probe.md',
    text: '```sh\necho text\n````\n\nThe colour.\n\n```sh\necho more\n```\n',
    expect: ['colour'],
  },
  {
    name: 'code block after a json block',
    path: 'docs/probe.md',
    text: '```json\n{ "goal": "A goal." }\n```\n\nThe text.\n\n```sh\necho behaviour\n```\n',
  },
  {
    name: 'design.md list item with a space',
    path: 'design.md',
    text: 'regras:\n  use_em: [a centre phrase, cor]\n',
    expect: ['centre'],
  },
  {
    name: 'design.md commas and colons inside quoted values',
    path: 'design.md',
    text:
      "x:\n  use: 'Choose size, colour, and alignment.'\n  use_em: ['title, centre, button']\n" +
      "  other_em: ['behaviour, layout and spacing']\n  note: \"Reads, as: judgement\"\n" +
      "  grade: { use: 'a, catalogue: b', size: 16 }\n",
    expect: ['colour', 'centre', 'behaviour', 'judgement', 'catalogue'],
  },
  {
    name: 'design.md keys and values without a space',
    path: 'design.md',
    text:
      'movimento:\n  deslize: opacidade\n  linear_so_em: [progresso, girador]\n' +
      "  lista: [progresso, 'girador', \"opacidade\"]\n  grade: { margem: 16, estilo_figma: grid/compact }\n",
  },
];
/* cspell:enable */

function cspell(args, input) {
  return spawnSync(process.execPath, [entry, ...args], { cwd: root, input, encoding: 'utf8' });
}

const failures = [];
for (const probe of PROBES) {
  const result = cspell(['--no-progress', '--no-summary', `stdin://${probe.path}`], probe.text);
  const reported = [...result.stdout.matchAll(/\(([^)]+)\)/g)].map((m) => m[1].toLowerCase());
  const expect = probe.expect ?? [];
  const missing = expect.filter((word) => !reported.includes(word));
  if (missing.length > 0) failures.push(`${probe.name}: cspell did not report ${missing.join(', ')}`);
  if (expect.length === 0 && result.status !== 0) {
    failures.push(`${probe.name}: expected to pass, cspell reported ${result.stdout.trim() || result.stderr.trim()}`);
  }
}

if (failures.length > 0) {
  console.error('FAILED: the cspell configuration does not do what its probes say.');
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}
console.log(`${PROBES.length} configuration probe(s) pass.`);

const run = spawnSync(process.execPath, [entry, '--no-progress'], { cwd: root, stdio: 'inherit' });
process.exit(run.status ?? 1);
