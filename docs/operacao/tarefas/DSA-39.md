```json
{
  "id": "DSA-39",
  "goal": "Implement the nph-slider, the control that picks a value or a range on a continuous scale of numbers, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 400,
  "owner": "elvys",
  "state": "blocked",
  "piece": "nph-slider",
  "dependencies": ["DSA-03", "DSA-04", "DSA-08", "DSA-13", "DSA-16", "DSA-28"],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-slider documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-39/documentacao-figma-aceita-2026-10-15.md",
      "result": "passed",
      "verified_at": "2026-10-15",
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
  "blockers": [
    {
      "id": "B1",
      "what_blocks": "The optional field is an nph-input (DSA-16) and the error state lives inside the nph-field (DSA-28); neither is done yet.",
      "owner": "elvys",
      "what_resolves": "DSA-16 and DSA-28 are done.",
      "opened_at": "2026-10-16"
    }
  ],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-39/documentacao-figma-aceita-2026-10-15.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-15.md, slider modernization accepted, Figma UX QA approved, documentation accepted and textual audit approved",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-16.md, Indiane sends the nph-slider to code"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1636-46",
    "date": "2026-10-15",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-slider board (1636:46), with its Documentação frame (1925:642), was accepted as the API and behavior specification of the nph-slider. COMPONENT_SET 1636:44. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-10-16"
}
```

# DSA-39 — nph-slider, the control that picks a value or a range

## Goal
The `nph-slider` exists in `src/components/nph-slider/`, with a spec, tests and
stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-39/documentacao-figma-aceita-2026-10-15.md`. It
carries the Figma documentation converted to text, with the tokens of each part
and of each state. There is no need to open Figma.

## Why it is blocked
The optional `campo` is an `nph-input` instance (DSA-16), and the error state is
shown only inside `nph-field` (DSA-28). Neither task is `done` yet (B1). When
both are, the task follows the usual rule: `ready` when every dependency is
`done`. Value, limits, step, keyboard, form value and events are technical
proposals for the PR.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## Relations with other tasks
- The value balloon is an `nph-tooltip` (DSA-08).
- `rótulo e valor` uses an `nph-label` (DSA-04).
- `menos e mais` are icon-only `nph-button` instances (DSA-13), with `nph-icon`
  `minus` and `plus` (DSA-03).
- `campo` is an `nph-input` (DSA-16).
- The error state sits inside `nph-field` (DSA-28), which gives the label, the
  help text and the error message.

## What this task does not do
It does not create a token or change a token value: every token the slider uses
is already on `v/5.0.0`. It does not create a size property. It does not show
progress: that is a progress bar, which is not operated.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, board `1636:46`, frame `1925:642`, set `1636:44`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
