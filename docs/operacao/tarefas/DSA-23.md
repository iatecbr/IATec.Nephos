```json
{
  "id": "DSA-23",
  "goal": "Implement the nph-toggle-group, the group of nph-togglebutton on the same subject in a toolbar, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 210,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-toggle-group",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-toggle-group documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-23/documentacao-figma-aceita-2026-10-08.md",
      "result": "passed",
      "verified_at": "2026-10-08",
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
    "docs/operacao/evidencias/DSA-23/documentacao-figma-aceita-2026-10-08.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1580-61",
    "date": "2026-10-08",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-toggle-group frame (1580:61) was accepted as the API and behavior specification of the nph-toggle-group. COMPONENT_SET 1580:60. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
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

# DSA-23 — nph-toggle-group, the group of toggle buttons

## Goal
The `nph-toggle-group` exists in `src/components/nph-toggle-group/`, with a spec,
tests and stories, in the contract accepted in Figma.

It uses `nph-togglebutton` (DSA-22) for each button.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-23/documentacao-figma-aceita-2026-10-08.md`. It
carries the Figma documentation converted to text. There is no need to open Figma.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1580:61` and set `1580:60`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
