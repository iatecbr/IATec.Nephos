```json
{
  "id": "DSA-71",
  "goal": "Prove that a component accepted by Thassila fails.",
  "phase": "F4",
  "approved_order": 10,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-example",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The Figma documentation of the piece was accepted by whoever accepts its level.",
      "command": null,
      "evidence": "scripts/fixtures/operations/invalid/component-accepted-by-thassila/evidencias/DSA-71/figma-docs-accepted-2026-11-19.md",
      "result": "passed",
      "verified_at": "2026-11-19",
      "verified_by": "thassila"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "scripts/fixtures/operations/invalid/component-accepted-by-thassila/evidencias/DSA-71/figma-docs-accepted-2026-11-19.md"
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

# DSA-71 — component accepted by Thassila

## Goal
Prove that a component accepted by Thassila fails.

## How it is proved
V31 must fire: only `indiane` accepts the documentation of a component.

## What this task does not do
It delivers nothing real: it is invalid on purpose.

## Sources
- `docs/operacao/README.md`
