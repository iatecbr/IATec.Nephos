/**
 * Whether a failed browser test shard may run again once (P106).
 *
 * On the Azure agents, Chromium drops every request in flight when the network of the shared
 * host changes, and a test file then fails to load with "Failed to fetch dynamically imported
 * module". A shard may run again only when that is its only failure: every failed file failed to
 * load, the log shows that error for the file, no test failed and no error went unhandled. Any
 * other failure keeps the shard failed, even next to a file that failed to load.
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
  if (/Unhandled (Error|Rejection)/.test(text)) {
    return { rerun: false, reason: 'an error went unhandled' };
  }
  const failed = report.testResults.filter((file) => file.status === 'failed');
  if (failed.length === 0) {
    return { rerun: false, reason: 'the shard failed with no failed file' };
  }
  for (const file of failed) {
    const loaded = !String(file.message ?? '').startsWith('Failed to import test file');
    const testFailed = (file.assertionResults ?? []).some((test) => test.status === 'failed');
    const signature = text
      .split('\n')
      .some((line) => line.includes(`${LOAD_FAILURE}: `) && line.includes(file.name));
    if (loaded || testFailed || !signature) {
      return { rerun: false, reason: `${file.name} failed for another reason` };
    }
  }
  const network = text.includes(NETWORK_CHANGE) ? `; ${NETWORK_CHANGE} in the log` : '';
  return {
    rerun: true,
    reason: `${failed.length} test file(s) failed to load with "${LOAD_FAILURE}"${network}`,
  };
}

const FILE = '/agent/s/src/components/nph-badge/nph-badge.test.ts';
const OTHER = '/agent/s/src/components/nph-chip/nph-chip.test.ts';
const loadFailed = (name) => ({ name, status: 'failed', message: `Failed to import test file ${name}`, assertionResults: [] });
const passed = (name) => ({ name, status: 'passed', message: '', assertionResults: [{ status: 'passed' }] });
const report = (files, numFailedTests = 0) => ({ numFailedTests, testResults: files });
const loadLine = (name) => `Caused by: TypeError: ${LOAD_FAILURE}: http://localhost:63315${name}?import&browserv=1`;
const networkLine = `[PW Error] script request failed for http://localhost:63315/x.js url: ${NETWORK_CHANGE}`;

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
    log: `${networkLine}\nSyntaxError: Unexpected token`,
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

const [first, logPath] = process.argv.slice(2);
if (first === '--self-test') {
  selfTest();
} else if (first && logPath) {
  const { rerun, reason } = classify(readReport(first), readFileSync(logPath, 'utf8'));
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
