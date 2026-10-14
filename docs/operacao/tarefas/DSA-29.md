```json
{
  "id": "DSA-29",
  "goal": "Implement the nph-select, the field that opens a closed list of options to pick one, with its option and list, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 300,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-select",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-select documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-29/documentacao-figma-aceita-2026-10-14.md",
      "result": "passed",
      "verified_at": "2026-10-14",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, option, list, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
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
    "docs/operacao/evidencias/DSA-29/documentacao-figma-aceita-2026-10-14.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-14.md, nph-select reopened with divider, arrow area, status dot and the open state; documentation accepted and textual audit approved"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1357-160",
    "date": "2026-10-14",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-select frame (1357:160), documentation 1452:448, was accepted as the API and behavior specification of the nph-select. COMPONENT_SET 1357:115; option 1357:136; list 1357:137. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-10-14"
}
```

# DSA-29 — nph-select, the field that opens a closed list of options

## Goal
The `nph-select` exists in `src/components/nph-select/`, with its option and its
list, a spec, tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-29/documentacao-figma-aceita-2026-10-14.md`. It
carries the Figma documentation converted to text. There is no need to open Figma.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, option,
list, CSS, tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## Relations with other tasks
- The start avatar is an `nph-avatar` instance (DSA-24). The start icon, the
  arrow and the check are `nph-icon` instances.
- The field sits inside `nph-field` (DSA-28), which gives the label, the help
  text and the error message.
- The option (`nph-select / opção`) is shared: the `nph-combobox` list uses the
  same option. Build it so that another list can reuse it.

## What this task does not do
It does not create a token or change a token value. It does not create a width
property: the width comes from `layout/input-width`. It does not bring search,
groups or multiple choice: those belong to `nph-combobox` and
`nph-multi-combobox`.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, board `1357:160`, documentation `1452:448`, set
  `1357:115`, option `1357:136`, list `1357:137`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
