```json
{
  "id": "DSA-06",
  "goal": "Exercise a block in review whose spec lives in `fichas/blocos/`, accepted by Indiane as the reserve.",
  "phase": "F4",
  "approved_order": 100,
  "owner": "elvys",
  "state": "in-review",
  "piece": "blocos/action-bar",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The Figma documentation of the piece was accepted by whoever accepts its level.",
      "command": null,
      "evidence": "scripts/fixtures/operations/valid/evidencias/DSA-06/figma-docs-accepted-2026-11-19.md",
      "result": "passed",
      "verified_at": "2026-11-19",
      "verified_by": "indiane"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "scripts/fixtures/operations/valid/evidencias/DSA-06/figma-docs-accepted-2026-11-19.md"
  ],
  "decision_refs": [],
  "external_origin": null,
  "git_review": {
    "branch": "feat/example",
    "commit": null,
    "pr": "https://example.invalid/pr/1"
  },
  "context": null,
  "updated_at": "2026-11-19"
}
```

# DSA-06 — block in review with its spec in fichas/blocos/

## Goal
Exercise a block in review whose spec lives in `fichas/blocos/`, accepted by Indiane as the reserve.

## How it is proved
Running `node scripts/verificar-operacao.mjs --exemplos`. V28 does not fire because `fichas/blocos/action-bar.md` exists; V31 does not fire because `indiane` is in the list of who accepts a block.

## What this task does not do
It delivers nothing real: it is a fixture of where a block spec lives.

## Sources
- `docs/operacao/README.md`
