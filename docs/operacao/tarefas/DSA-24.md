```json
{
  "id": "DSA-24",
  "goal": "Implement the nph-avatar, which shows who the person is by photo or, without a photo, by the person icon, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 220,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-avatar",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-avatar documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-24/documentacao-figma-aceita-2026-10-06.md",
      "result": "passed",
      "verified_at": "2026-10-06",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": null,
      "result": "pending",
      "verified_at": null,
      "verified_by": null
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-24/documentacao-figma-aceita-2026-10-06.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1434-30",
    "date": "2026-10-06",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-avatar frame (1434:30) was accepted as the API and behavior specification of the nph-avatar. COMPONENT_SET 1434:29. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "context": null,
  "updated_at": "2026-10-09"
}
```

# DSA-24 — nph-avatar, the picture of a person

## Goal
The `nph-avatar` exists in `src/components/nph-avatar/`, with a spec,
tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-24/documentacao-figma-aceita-2026-10-06.md`. It
carries the Figma documentation converted to text. There is no need to open Figma.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1434:30` and set `1434:29`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
