/**
 * Whether a failed browser test shard may run again, up to twice (P106).
 *
 * On the Azure agents, Chromium drops every request in flight when the network of the shared
 * host changes (`net::ERR_NETWORK_CHANGED`). A test file then fails to load with "Failed to fetch
 * dynamically imported module", and when the dropped requests are the modules of the Vitest tester
 * itself, the iframe of a file "did not become ready" and Vitest reports it as an unhandled error
 * (build 612881). A shard may run again only when those are its only failures: every failed file
 * failed to load and the cause of its own error in the log is that error, for the file or for a
 * module it loads first such as the Storybook setup; no test failed; and every unhandled
 * error is a tester that did not become ready while the log shows a tester module dropped by a
 * network change. Any other failure keeps the shard failed, even next to a file that failed to
 * load.
 *
 * A shard runs again at most `MAX_RERUNS` times, each one only when the attempt before it failed
 * that way; a shard that still fails after the last rerun fails the step.
 *
 * Usage, in the `Component tests (Chromium)` step of `azure-pipelines.yml`:
 *   node scripts/shard-rerun.mjs <json report of the attempt> <log of the attempt> <reruns so far>
 * It exits 0 and prints the reason when the shard may run again, and exits 1, with the reason on
 * stderr, when it may not.
 *
 *   node scripts/shard-rerun.mjs --self-test
 * runs the probes below and exits 1 if any of them is classified wrong.
 */
import { readFileSync } from 'node:fs';
import { relative } from 'node:path';
import { pathToFileURL } from 'node:url';

/** How many times a shard may run again after its first attempt: Elvys's decision of 30/10/2026. */
export const MAX_RERUNS = 2;
const LOAD_FAILURE = 'Failed to fetch dynamically imported module';
const NETWORK_CHANGE = 'net::ERR_NETWORK_CHANGED';
const ANSI = /\u001b\[[0-9;]*m/g;
const UNHANDLED = /Vitest caught (\d+) unhandled errors?/;
const TESTER_NOT_READY = /The iframe "[^"]+" did not become ready within \d+ms/;
/** A module of the Vitest tester, as the Playwright provider names it in a failed request. */
const TESTER_MODULE = /vitest\/browser|@vitest\/browser\/|__vitest_browser__/;

/** The header Vitest prints above each unhandled error: "⎯⎯ Unhandled Error ⎯⎯" or "⎯⎯ Unhandled Rejection ⎯⎯". */
const UNHANDLED_HEADER = /⎯+\s*Unhandled (Error|Rejection)\s*⎯+/;

/**
 * How many unhandled errors the log reports, and whether all of them are testers that did not
 * become ready after the network change dropped a module of the tester. Each error is read in
 * its own block, from its header to the next header or separator, so an error printed after the
 * count, or one that is not a tester, keeps the shard failed.
 * @param {string} text
 */
function unhandledErrors(text) {
  const lines = text.split('\n');
  const blocks = [];
  for (const [index, line] of lines.entries()) {
    if (!UNHANDLED_HEADER.test(line)) continue;
    const block = [];
    for (const next of lines.slice(index + 1)) {
      if (/^\s*(\S+\s+)?⎯/.test(next) || /Test Files /.test(next)) break;
      block.push(next);
    }
    blocks.push(block.join('\n'));
  }
  const caught = Number(UNHANDLED.exec(text)?.[1] ?? 0);
  const mentioned = /Unhandled (Error|Rejection)/.test(text);
  const count = Math.max(caught, blocks.length, mentioned ? 1 : 0);
  const testerDropped = lines.some((line) => line.includes(NETWORK_CHANGE) && TESTER_MODULE.test(line));
  const testersOnly =
    count > 0 &&
    blocks.length >= count &&
    blocks.every((block) => TESTER_NOT_READY.test(block)) &&
    testerDropped;
  return { count, testersOnly };
}

/**
 * The cause the log gives for a test file that failed to import. Its error block follows the
 * `FAIL` header that names the file, by its path from the root, and the headers right after it,
 * since files that share one error are listed together; it ends at the next header or at the
 * unhandled errors. Inside it, "Failed to import test file" names the module that failed,
 * which may be the file itself or one it loads first, such as the Storybook setup (build 611680),
 * and the first `Caused by:` line is the cause.
 * @param {string} text
 * @param {string} name The absolute path of the file, as in the JSON report.
 * @param {string} root The folder the paths of the log are relative to.
 */
function causeOf(text, name, root) {
  const path = relative(root, name);
  const lines = text.split('\n');
  const start = lines.findIndex((line) => /\bFAIL\b/.test(line) && line.includes(`${path} [ ${path} ]`));
  if (start < 0) return '';
  /* Files that share one error are listed as consecutive headers above a single block. */
  let index = start + 1;
  while (index < lines.length && (/\bFAIL\b/.test(lines[index]) || lines[index].trim() === '')) index += 1;
  const block = [];
  for (const line of lines.slice(index)) {
    if (/\bFAIL\b/.test(line) || /Unhandled Errors?/.test(line)) break;
    block.push(line);
  }
  if (!block.some((line) => line.includes('Failed to import test file '))) return '';
  return /Caused by: (.*)/.exec(block.join('\n'))?.[1] ?? '';
}

/**
 * @param {unknown} report The JSON report of Vitest, or `undefined` when it could not be read.
 * @param {string} log The output of the shard.
 * @param {string} [root] The folder the paths of the log are relative to: the repository.
 * @param {number} [reruns] How many times the shard already ran again.
 * @returns {{ rerun: boolean, reason: string }}
 */
export function classify(report, log, root = process.cwd(), reruns = 0) {
  if (reruns >= MAX_RERUNS) {
    return { rerun: false, reason: `the shard already ran again ${reruns} time(s), the limit` };
  }
  const text = log.replace(ANSI, '');
  if (!report || !Array.isArray(report.testResults)) {
    return { rerun: false, reason: 'the JSON report of the shard is missing' };
  }
  if (report.numFailedTests > 0) {
    return { rerun: false, reason: `${report.numFailedTests} test(s) failed` };
  }
  const unhandled = unhandledErrors(text);
  if (unhandled.count > 0 && !unhandled.testersOnly) {
    return { rerun: false, reason: 'an error went unhandled' };
  }
  const failed = report.testResults.filter((file) => file.status === 'failed');
  if (failed.length === 0 && unhandled.count === 0) {
    return { rerun: false, reason: 'the shard failed with no failed file' };
  }
  for (const file of failed) {
    const loaded = !String(file.message ?? '').startsWith('Failed to import test file');
    const testFailed = (file.assertionResults ?? []).some((test) => test.status === 'failed');
    if (loaded || testFailed || !causeOf(text, file.name, root).includes(`${LOAD_FAILURE}: `)) {
      return { rerun: false, reason: `${file.name} failed for another reason` };
    }
  }
  const parts = [];
  if (failed.length > 0) parts.push(`${failed.length} test file(s) failed to load with "${LOAD_FAILURE}"`);
  if (unhandled.count > 0) parts.push(`${unhandled.count} tester(s) did not become ready`);
  if (text.includes(NETWORK_CHANGE)) parts.push(`${NETWORK_CHANGE} in the log`);
  return { rerun: true, reason: parts.join('; ') };
}

const FILE = '/agent/s/src/components/nph-badge/nph-badge.test.ts';
const OTHER = '/agent/s/src/components/nph-chip/nph-chip.test.ts';
const loadFailed = (name) => ({ name, status: 'failed', message: `Failed to import test file ${name}`, assertionResults: [] });
const passed = (name) => ({ name, status: 'passed', message: '', assertionResults: [{ status: 'passed' }] });
const report = (files, numFailedTests = 0) => ({ numFailedTests, testResults: files });
const ROOT = '/agent/s';
const SETUP = `${ROOT}/node_modules/@storybook/addon-vitest/dist/vitest-plugin/setup-file-with-project-annotations.js`;
const STORY = `${ROOT}/src/components/nph-chip/nph-chip.stories.ts`;
/** The `FAIL` header of a file, by its path from the root, as Vitest prints it. */
const header = (name) => ` FAIL   unit (chromium)  ${relative(ROOT, name)} [ ${relative(ROOT, name)} ]`;
/** The error block of a file that failed to import because `module` failed to load. */
const loadLine = (name, module = name) =>
  `${header(name)}\nError: Failed to import test file ${module}\n ❯ collectTests deps/plugins.js:5823:3\n` +
  `Caused by: TypeError: ${LOAD_FAILURE}: http://localhost:63315${module}?import&browserv=1`;
const otherCause = (name, module = name) =>
  `${header(name)}\nError: Failed to import test file ${module}\nCaused by: SyntaxError: Unexpected token '}'`;
const networkLine = `[PW Error] script request failed for http://localhost:63315/x.js url: ${NETWORK_CHANGE}`;
const testerDroppedLine = `[PW Error] script request failed for http://localhost:63316/@id/__x00__vitest/browser url: ${NETWORK_CHANGE}`;
/** The unhandled errors section: the count Vitest prints, then one block per error. */
const unhandledSection = (count, blocks) =>
  `⎯⎯⎯⎯⎯⎯ Unhandled Errors ⎯⎯⎯⎯⎯⎯\nVitest caught ${count} unhandled error${count === 1 ? '' : 's'} during the test run.\n` +
  blocks.join('\n') +
  '\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n Test Files  1 failed | 1 passed (2)';
const testerBlock =
  `⎯⎯⎯⎯⎯⎯ Unhandled Error ⎯⎯⎯⎯⎯⎯⎯\nError: Failed to run the test ${OTHER}.\n` +
  `Caused by: Error: The iframe "${OTHER}" did not become ready within 60000ms. The tester likely failed to initialize`;
const rejectionBlock = `⎯⎯⎯⎯⎯⎯ Unhandled Rejection ⎯⎯⎯⎯⎯⎯\nTypeError: Cannot read properties of undefined (reading 'open')`;

const PROBES = [
  {
    name: 'a file that failed to load after a network change',
    report: report([loadFailed(FILE), passed(OTHER)]),
    log: `${networkLine}\n${loadLine(FILE)}`,
    rerun: true,
  },
  {
    name: 'the load failure, with color codes in the log',
    report: report([loadFailed(FILE)]),
    log: `\u001b[31m${loadLine(FILE)}\u001b[39m`,
    rerun: true,
  },
  {
    name: 'a failed test next to a file that failed to load',
    report: report([loadFailed(FILE), { ...passed(OTHER), status: 'failed', assertionResults: [{ status: 'failed' }] }], 1),
    log: `${networkLine}\n${loadLine(FILE)}`,
    rerun: false,
  },
  {
    name: 'a file that failed to load for another reason',
    report: report([loadFailed(FILE)]),
    log: `${networkLine}\n${otherCause(FILE)}`,
    rerun: false,
  },
  {
    name: 'a story whose Storybook setup failed to load',
    report: report([{ ...loadFailed(STORY), message: `Failed to import test file ${SETUP}` }]),
    log: `${networkLine}\n${loadLine(STORY, SETUP)}`,
    rerun: true,
  },
  {
    name: 'two stories that share the setup, one for the load and one for another cause',
    report: report([loadFailed(STORY), loadFailed(FILE)]),
    log: `${networkLine}\n${loadLine(STORY, SETUP)}\n${otherCause(FILE, SETUP)}`,
    rerun: false,
  },
  {
    name: 'two stories listed together above one load failure of the setup',
    report: report([loadFailed(STORY), loadFailed(FILE)]),
    log: `${networkLine}\n${header(STORY)}\n${loadLine(FILE, SETUP)}`,
    rerun: true,
  },
  {
    name: 'two stories listed together above one error with another cause',
    report: report([loadFailed(STORY), loadFailed(FILE)]),
    log: `${networkLine}\n${header(STORY)}\n${otherCause(FILE, SETUP)}`,
    rerun: false,
  },
  {
    name: 'a file whose own block has another cause, after a load failure of another file',
    report: report([loadFailed(FILE), loadFailed(OTHER)]),
    log: `${loadLine(OTHER)}\n${otherCause(FILE)}`,
    rerun: false,
  },
  {
    name: 'a network change with no file that failed to load',
    report: report([{ ...passed(OTHER), status: 'failed' }]),
    log: networkLine,
    rerun: false,
  },
  {
    name: 'an unhandled error next to a file that failed to load',
    report: report([loadFailed(FILE)]),
    log: `${loadLine(FILE)}\nUnhandled Rejection`,
    rerun: false,
  },
  {
    name: 'a file that failed to load and a tester that did not start, both after a network change',
    report: report([loadFailed(FILE)]),
    log: `${testerDroppedLine}\n${loadLine(FILE)}\n${unhandledSection(1, [testerBlock])}`,
    rerun: true,
  },
  {
    name: 'only a tester that did not start after a network change',
    report: report([passed(OTHER)]),
    log: `${testerDroppedLine}\n${unhandledSection(1, [testerBlock])}`,
    rerun: true,
  },
  {
    name: 'a tester that did not start, with no tester module dropped by a network change',
    report: report([loadFailed(FILE)]),
    log: `${networkLine}\n${loadLine(FILE)}\n${unhandledSection(1, [testerBlock])}`,
    rerun: false,
  },
  {
    name: 'another unhandled error next to a tester that did not start',
    report: report([loadFailed(FILE)]),
    log: `${testerDroppedLine}\n${loadLine(FILE)}\n${unhandledSection(2, [testerBlock, rejectionBlock])}`,
    rerun: false,
  },
  {
    name: 'a tester that did not start and an unhandled rejection printed after the count',
    report: report([loadFailed(FILE)]),
    log: `${testerDroppedLine}\n${loadLine(FILE)}\n${unhandledSection(1, [testerBlock, rejectionBlock])}`,
    rerun: false,
  },
  {
    name: 'two testers that did not start after a network change',
    report: report([loadFailed(FILE)]),
    log: `${testerDroppedLine}\n${loadLine(FILE)}\n${unhandledSection(2, [testerBlock, testerBlock])}`,
    rerun: true,
  },
  {
    name: 'the second rerun, after a first rerun that also failed to load a file',
    report: report([loadFailed(FILE)]),
    log: `${networkLine}\n${loadLine(FILE)}`,
    reruns: 1,
    rerun: true,
  },
  {
    name: 'a third rerun, past the limit',
    report: report([loadFailed(FILE)]),
    log: `${networkLine}\n${loadLine(FILE)}`,
    reruns: MAX_RERUNS,
    rerun: false,
  },
  { name: 'no JSON report', report: undefined, log: loadLine(FILE), rerun: false },
  { name: 'a failed shard with no failed file', report: report([passed(OTHER)]), log: '', rerun: false },
];

function selfTest() {
  let wrong = 0;
  for (const probe of PROBES) {
    const { rerun, reason } = classify(probe.report, probe.log, ROOT, probe.reruns ?? 0);
    if (rerun !== probe.rerun) {
      wrong += 1;
      console.error(`shard-rerun: wrong for "${probe.name}": rerun ${rerun} (${reason})`);
    }
  }
  if (wrong > 0) process.exit(1);
  console.log(`shard-rerun: ${PROBES.length} probes classified as expected.`);
}

function readReport(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return undefined;
  }
}

/** A missing log reads as empty, so no file shows the load failure and the shard is not rerun. */
function readLog(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return '';
  }
}

/* The command line runs only when this file is the entry point, not when it is imported. */
if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const [first, logPath, reruns = '0'] = process.argv.slice(2);
  if (first === '--self-test') {
    selfTest();
  } else if (first && logPath) {
    const { rerun, reason } = classify(readReport(first), readLog(logPath), process.cwd(), Number(reruns));
    if (rerun) {
      console.log(reason);
    } else {
      console.error(`shard-rerun: no rerun: ${reason}`);
      process.exit(1);
    }
  } else {
    console.error('Usage: node scripts/shard-rerun.mjs <report.json> <shard.log> [reruns so far] | --self-test');
    process.exit(2);
  }
}
