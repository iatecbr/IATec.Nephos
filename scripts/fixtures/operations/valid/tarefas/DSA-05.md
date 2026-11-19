```json
{
  "id": "DSA-05",
  "goal": "Exercise a block whose Figma documentation was accepted by Thassila.",
  "phase": "F4",
  "approved_order": 80,
  "owner": "elvys",
  "state": "ready",
  "piece": "blocos/action-bar",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The Figma documentation of the piece was accepted by whoever accepts its level.",
      "command": null,
      "evidence": "scripts/fixtures/operations/valid/evidencias/DSA-05/figma-docs-accepted-2026-11-19.md",
      "result": "passed",
      "verified_at": "2026-11-19",
      "verified_by": "thassila"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "scripts/fixtures/operations/valid/evidencias/DSA-05/figma-docs-accepted-2026-11-19.md"
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

# DSA-05 — block accepted by Thassila

## Goal
Exercise a block whose Figma documentation was accepted by Thassila.

## How it is proved
Running `node scripts/verificar-operacao.mjs --exemplos`. V31 does not fire because the `piece` `blocos/action-bar` is a block, and `thassila` is in the list of who accepts a block.

## What this task does not do
It delivers nothing real: it is a fixture of the acceptance by level.

## Sources
- `docs/operacao/README.md`
