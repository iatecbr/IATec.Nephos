```json
{
  "id": "DSA-72",
  "goal": "Prove that a documentation gate on a piece with no known level fails.",
  "phase": "F4",
  "approved_order": 10,
  "owner": "elvys",
  "state": "ready",
  "piece": "layouts/main-shell",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The Figma documentation of the piece was accepted by whoever accepts its level.",
      "command": null,
      "evidence": "scripts/fixtures/operations/invalid/piece-without-level/evidencias/DSA-72/figma-docs-accepted-2026-11-19.md",
      "result": "passed",
      "verified_at": "2026-11-19",
      "verified_by": "indiane"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "scripts/fixtures/operations/invalid/piece-without-level/evidencias/DSA-72/figma-docs-accepted-2026-11-19.md"
  ],
  "decision_refs": [],
  "external_origin": null,
  "git_review": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "context": null,
  "updated_at": "2026-11-19"
}
```

# DSA-72 — piece with no known level

## Goal
Prove that a documentation gate on a piece with no known level fails.

## How it is proved
V31 must fire: `layouts/main-shell` is neither `nph-<name>` nor `blocos/<name>`, so nobody can accept it.

## What this task does not do
It delivers nothing real: it is invalid on purpose.

## Sources
- `docs/operacao/README.md`
