/**
 * Runs a command in a private network namespace with only the loopback interface (P131).
 *
 * On the Azure agents, Chromium drops every request in flight, localhost included, each time the
 * network of the shared host changes (`net::ERR_NETWORK_CHANGED`): the agents run Docker for other
 * jobs, and each container creates and removes `veth` and bridge interfaces on the host. Chromium
 * only watches the network of its own namespace, so the browser tests, which talk to Vite through
 * `localhost` only, run in a namespace the host cannot change.
 *
 * Usage, in `azure-pipelines.yml`: node scripts/in-private-netns.mjs npm test -- --shard=1/2
 * Where an unprivileged user namespace is not available (macOS, an agent without it), the command
 * runs as it is and an Azure warning says so: nothing is made worse than before.
 */
import { spawnSync } from 'node:child_process';

const command = process.argv.slice(2);
if (command.length === 0) {
  console.error('usage: node scripts/in-private-netns.mjs <command> [args...]');
  process.exit(2);
}

const NAMESPACE = ['--user', '--map-root-user', '--net'];
// The loopback of a new namespace starts down, so it is brought up before the command runs.
const LOOPBACK_UP = 'ip link set lo up';

const probe = spawnSync('unshare', [...NAMESPACE, 'sh', '-c', LOOPBACK_UP], { stdio: 'ignore' });
const isolated = probe.status === 0;
if (isolated) {
  console.log('Network isolation: active (private network namespace, loopback only)');
} else {
  console.log('##vso[task.logissue type=warning]Network isolation unavailable on this agent; running without it (P131).');
}

const run = isolated
  ? spawnSync('unshare', [...NAMESPACE, 'sh', '-c', `${LOOPBACK_UP} && exec "$@"`, 'sh', ...command], { stdio: 'inherit' })
  : spawnSync(command[0], command.slice(1), { stdio: 'inherit' });
if (run.error) {
  console.error(run.error.message);
  process.exit(1);
}
process.exit(run.status ?? 1);
