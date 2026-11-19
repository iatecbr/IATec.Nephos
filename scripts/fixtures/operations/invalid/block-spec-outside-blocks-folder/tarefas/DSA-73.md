```json
{
  "id": "DSA-73",
  "goal": "Prove that a block in review fails when its spec is not in `fichas/blocos/`.",
  "phase": "F4",
  "approved_order": 10,
  "owner": "elvys",
  "state": "in-review",
  "piece": "blocos/action-bar",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The Figma documentation of the piece was accepted by whoever accepts its level.",
      "command": null,
      "evidence": "scripts/fixtures/operations/invalid/block-spec-outside-blocks-folder/evidencias/DSA-73/figma-docs-accepted-2026-11-19.md",
      "result": "passed",
      "verified_at": "2026-11-19",
      "verified_by": "thassila"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "scripts/fixtures/operations/invalid/block-spec-outside-blocks-folder/evidencias/DSA-73/figma-docs-accepted-2026-11-19.md"
  ],
  "decision_refs": [],
  "external_origin": null,
  "git_review": {
    "branch": "feat/example",
    "commit": null,
    "pr": "https://example.invalid/pr/2"
  },
  "context": null,
  "updated_at": "2026-11-19"
}
```

# DSA-73 — block spec outside fichas/blocos/

## Goal
Prove that a block in review fails when its spec is not in `fichas/blocos/`.

## How it is proved
V28 must fire: the spec is at `fichas/action-bar.md`, and a block spec lives at `fichas/blocos/action-bar.md`.

## What this task does not do
It delivers nothing real: it is invalid on purpose.

## Sources
- `docs/operacao/README.md`
