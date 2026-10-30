/**
 * Whether a failed browser test shard may run again once (P106).
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
 * Usage, in the `Component tests (Chromium)` step of `azure-pipelines.yml`:
 *   node scripts/shard-rerun.mjs <json report of the shard> <log of the shard>
 * It exits 0 and prints the reason when the shard may run again, and exits 1, with the reason on
 * stderr, when it may not.
 *
 *   node scripts/shard-rerun.mjs --self-test
 * runs the probes below and exits 1 if any of them is classified wrong.
 */
import { readFileSync } from 'node:fs';

const LOAD_FAILURE = 'Failed to fetch dynamically imported module';
const NETWORK_CHANGE = 'net::ERR_NETWORK_CHANGED';
const ANSI = /\u001b\[[0-9;]*m/g;
const UNHANDLED = /Vitest caught (\d+) unhandled errors?/;
const TESTER_NOT_READY = /The iframe "[^"]+" did not become ready within \d+ms/g;
/** A module of the Vitest tester, as the Playwright provider names it in a failed request. */
const TESTER_MODULE = /vitest\/browser|@vitest\/browser\/|__vitest_browser__/;

/**
 * How many unhandled errors the log reports, and whether all of them are testers that did not
 * become ready after the network change dropped a module of the tester.
 * @param {string} text
 */
function unhandledErrors(text) {
  const count = Number(UNHANDLED.exec(text)?.[1] ?? (/Unhandled (Error|Rejection)/.test(text) ? Infinity : 0));
  const notReady = text.match(TESTER_NOT_READY)?.length ?? 0;
  const testerDropped = text
    .split('\n')
    .some((line) => line.includes(NETWORK_CHANGE) && TESTER_MODULE.test(line));
  return { count, testersOnly: count > 0 && notReady >= count && testerDropped };
}

/**
 * The cause the log gives for a test file that failed to import: the first `Caused by:` line of
 * its own error block, which ends at the next failed file or at the unhandled errors. The module
 * it names may be the file itself or one the file loads first, such as the Storybook setup.
 * @param {string} text
 * @param {string} name
 */
function causeOf(text, name) {
  const marker = `Failed to import test file ${name}`;
  const start = text.indexOf(marker);
  if (start < 0) return '';
  const rest = text.slice(start + marker.length);
  const end = rest.search(/Failed to import test file |\sFAIL\s|Unhandled Errors?/);
  const block = end < 0 ? rest : rest.slice(0, end);
  return /Caused by: (.*)/.exec(block)?.[1] ?? '';
}

/**
 * @param {unknown} report The JSON report of Vitest, or `undefined` when it could not be read.
 * @param {string} log The output of the shard.
 * @returns {{ rerun: boolean, reason: string }}
 */
export function classify(report, log) {
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
    if (loaded || testFailed || !causeOf(text, file.name).includes(`${LOAD_FAILURE}: `)) {
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
const SETUP = '/agent/s/node_modules/@storybook/addon-vitest/dist/vitest-plugin/setup-file-with-project-annotations.js';
const STORY = '/agent/s/src/components/nph-chip/nph-chip.stories.ts';
/** The error block Vitest prints for a file that failed to import, with the module that failed. */
const loadLine = (name, module = name) =>
  ` FAIL   unit (chromium)  ${name} [ ${name} ]\nError: Failed to import test file ${name}\n` +
  ` ❯ collectTests deps/plugins.js:5823:3\n` +
  `Caused by: TypeError: ${LOAD_FAILURE}: http://localhost:63315${module}?import&browserv=1`;
const otherCause = (name) =>
  ` FAIL   unit (chromium)  ${name} [ ${name} ]\nError: Failed to import test file ${name}\n` +
  `Caused by: SyntaxError: Unexpected token '}'`;
const networkLine = `[PW Error] script request failed for http://localhost:63315/x.js url: ${NETWORK_CHANGE}`;
const testerDroppedLine = `[PW Error] script request failed for http://localhost:63316/@id/__x00__vitest/browser url: ${NETWORK_CHANGE}`;
const notReady = (count) =>
  `Vitest caught ${count} unhandled error${count === 1 ? '' : 's'} during the test run.\n` +
  `Caused by: Error: The iframe "${OTHER}" did not become ready within 60000ms. The tester likely failed to initialize`;

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
    report: report([loadFailed(STORY)]),
    log: `${networkLine}\n${loadLine(STORY, SETUP)}`,
    rerun: true,
  },
  {
    name: 'two stories that share the setup, one for the load and one for another cause',
    report: report([loadFailed(STORY), loadFailed(FILE)]),
    log: `${networkLine}\n${loadLine(STORY, SETUP)}\n${otherCause(FILE)}`,
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
    log: `${testerDroppedLine}\n${loadLine(FILE)}\n${notReady(1)}`,
    rerun: true,
  },
  {
    name: 'only a tester that did not start after a network change',
    report: report([passed(OTHER)]),
    log: `${testerDroppedLine}\n${notReady(1)}`,
    rerun: true,
  },
  {
    name: 'a tester that did not start, with no tester module dropped by a network change',
    report: report([loadFailed(FILE)]),
    log: `${networkLine}\n${loadLine(FILE)}\n${notReady(1)}`,
    rerun: false,
  },
  {
    name: 'another unhandled error next to a tester that did not start',
    report: report([loadFailed(FILE)]),
    log: `${testerDroppedLine}\n${loadLine(FILE)}\n${notReady(2)}`,
    rerun: false,
  },
  { name: 'no JSON report', report: undefined, log: loadLine(FILE), rerun: false },
  { name: 'a failed shard with no failed file', report: report([passed(OTHER)]), log: '', rerun: false },
];

function selfTest() {
  let wrong = 0;
  for (const probe of PROBES) {
    const { rerun, reason } = classify(probe.report, probe.log);
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

const [first, logPath] = process.argv.slice(2);
if (first === '--self-test') {
  selfTest();
} else if (first && logPath) {
  const { rerun, reason } = classify(readReport(first), readLog(logPath));
  if (rerun) {
    console.log(reason);
  } else {
    console.error(`shard-rerun: no rerun: ${reason}`);
    process.exit(1);
  }
} else {
  console.error('Usage: node scripts/shard-rerun.mjs <report.json> <shard.log> | --self-test');
  process.exit(2);
}
