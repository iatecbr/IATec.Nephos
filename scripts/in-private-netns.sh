#!/usr/bin/env bash
# Runs a command in a private network namespace with only the loopback interface (P131).
#
# On the Azure agents, Chromium drops every request in flight, localhost included, each time the
# network of the shared host changes (`net::ERR_NETWORK_CHANGED`): the agents run Docker for other
# jobs, and each container creates and removes `veth` and bridge interfaces on the host. Chromium
# only watches the network of its own namespace, so the browser tests, which talk to Vite through
# `localhost` only, run in a namespace the host cannot change.
#
# Usage, in `azure-pipelines.yml`: bash scripts/in-private-netns.sh npm test -- --shard=1/2
# Where an unprivileged user namespace is not available (macOS, an agent without it), the command
# runs as it is and an Azure warning says so: nothing is made worse than before.
set -euo pipefail

if [ "$#" -eq 0 ]; then
  echo "usage: in-private-netns.sh <command> [args...]" >&2
  exit 2
fi

if command -v unshare >/dev/null 2>&1 && command -v ip >/dev/null 2>&1 &&
  unshare --user --map-root-user --net sh -c 'ip link set lo up' >/dev/null 2>&1; then
  echo "Network isolation: active (private network namespace, loopback only)"
  # The loopback of a new namespace starts down; the command is the namespace's only process tree.
  exec unshare --user --map-root-user --net sh -c 'ip link set lo up && exec "$@"' sh "$@"
fi

echo "##vso[task.logissue type=warning]Network isolation unavailable on this agent; running without it (P131)."
exec "$@"
