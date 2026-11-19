```json
{
  "id": "DSA-75",
  "goal": "Prove that a passed documentation gate on a task with no `piece` fails.",
  "phase": "F4",
  "approved_order": 10,
  "owner": "elvys",
  "state": "ready",
  "piece": null,
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The Figma documentation of the piece was accepted by whoever accepts its level.",
      "command": null,
      "evidence": "scripts/fixtures/operations/invalid/docs-gate-without-piece/evidencias/DSA-75/figma-docs-accepted-2026-11-19.md",
      "result": "passed",
      "verified_at": "2026-11-19",
      "verified_by": "indiane"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "scripts/fixtures/operations/invalid/docs-gate-without-piece/evidencias/DSA-75/figma-docs-accepted-2026-11-19.md"
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

# DSA-75 — documentation gate without a piece

## Goal
Prove that a passed documentation gate on a task with no `piece` fails.

## How it is proved
V31 must fire: without a `piece` there is no level, so nobody can accept the documentation.

## What this task does not do
It delivers nothing real: it is invalid on purpose.

## Sources
- `docs/operacao/README.md`
