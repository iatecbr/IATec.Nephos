```json
{
  "id": "DSA-70",
  "goal": "Prove that a block accepted by someone outside the block list fails.",
  "phase": "F4",
  "approved_order": 10,
  "owner": "elvys",
  "state": "ready",
  "piece": "blocos/action-bar",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The Figma documentation of the piece was accepted by whoever accepts its level.",
      "command": null,
      "evidence": "scripts/fixtures/operations/invalid/block-accepted-outside-list/evidencias/DSA-70/figma-docs-accepted-2026-11-19.md",
      "result": "passed",
      "verified_at": "2026-11-19",
      "verified_by": "claude-figma"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "scripts/fixtures/operations/invalid/block-accepted-outside-list/evidencias/DSA-70/figma-docs-accepted-2026-11-19.md"
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

# DSA-70 — block accepted by someone outside the list

## Goal
Prove that a block accepted by someone outside the block list fails.

## How it is proved
V31 must fire: `claude-figma` does not accept the documentation of a block.

## What this task does not do
It delivers nothing real: it is invalid on purpose.

## Sources
- `docs/operacao/README.md`
