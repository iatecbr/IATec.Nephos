```json
{
  "id": "DSA-74",
  "goal": "Prove that a block whose name takes the `nph-` prefix has no level.",
  "phase": "F4",
  "approved_order": 10,
  "owner": "elvys",
  "state": "ready",
  "piece": "blocos/nph-action-bar",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The Figma documentation of the piece was accepted by whoever accepts its level.",
      "command": null,
      "evidence": "scripts/fixtures/operations/invalid/block-with-nph-prefix/evidencias/DSA-74/figma-docs-accepted-2026-11-19.md",
      "result": "passed",
      "verified_at": "2026-11-19",
      "verified_by": "thassila"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "scripts/fixtures/operations/invalid/block-with-nph-prefix/evidencias/DSA-74/figma-docs-accepted-2026-11-19.md"
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

# DSA-74 — block name with the nph- prefix

## Goal
Prove that a block whose name takes the `nph-` prefix has no level.

## How it is proved
V31 must fire: the `nph-` prefix belongs to components, so `blocos/nph-action-bar` matches no level.

## What this task does not do
It delivers nothing real: it is invalid on purpose.

## Sources
- `docs/operacao/README.md`
