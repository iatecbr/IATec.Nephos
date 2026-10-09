```json
{
  "id": "DSA-22",
  "goal": "Implement the nph-togglebutton, the button that holds a boolean value, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 200,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-togglebutton",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-togglebutton documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-22/documentacao-figma-aceita-2026-10-07.md",
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
    "docs/operacao/evidencias/DSA-22/documentacao-figma-aceita-2026-10-07.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1512-27498",
    "date": "2026-10-07",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-togglebutton board (1512:27498) was accepted as the API and behavior specification of the nph-togglebutton. COMPONENT_SET 1512:719. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-10-09"
}
```

# DSA-22 — nph-togglebutton, the button that holds a boolean value

## Goal
The `nph-togglebutton` exists in `src/components/nph-togglebutton/`, with a spec,
tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-22/documentacao-figma-aceita-2026-10-07.md`. It
carries the Figma documentation converted to text. There is no need to open Figma.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value. It does not create a size
property.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, board `1512:27498` and set `1512:719`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
