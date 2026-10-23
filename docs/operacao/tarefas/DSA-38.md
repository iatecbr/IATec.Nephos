```json
{
  "id": "DSA-38",
  "goal": "Implement the nph-textarea, the multi-line text field with an optional footer for counter and actions, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 390,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-textarea",
  "dependencies": ["DSA-13", "DSA-28"],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-textarea documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-38/documentacao-figma-aceita-2026-10-16.md",
      "result": "passed",
      "verified_at": "2026-10-16",
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
    "docs/operacao/evidencias/DSA-38/documentacao-figma-aceita-2026-10-16.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-15.md, nph-textarea modernized, height tokens created, counter decided and documentation accepted",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-16.md, gap between the footer actions decided and textual audit approved"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1632-24",
    "date": "2026-10-16",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-textarea frame (1632:24), documentation 1922:642, was accepted as the API and behavior specification of the nph-textarea. COMPONENT_SET 1632:22. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": null, "commit": null, "pr": null },
  "context": null,
  "updated_at": "2026-10-23"
}
```

# DSA-38 — nph-textarea, the multi-line text field

## Goal
The `nph-textarea` exists in `src/components/nph-textarea/`, with a spec, tests
and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-38/documentacao-figma-aceita-2026-10-16.md`. It
carries the Figma documentation converted to text. There is no need to open Figma.

## Pending decisions
None. Value, form participation, events, keyboard and the way the counter reads
the text are technical proposals for the PR. The two height tokens are already on
`v/5.0.0`.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## Relations with other tasks
- The footer actions are `nph-button` instances (DSA-13), `ghost` and `solid`, in
  `size=default`.
- The field sits inside `nph-field` (DSA-28), which gives the label, the help
  text, the error message and the support-line counter (property `contador`).
  The required example "Description in a form" needs it; DSA-28 is `done`, so B1
  is closed and the task is `ready`.

## What this task does not do
It does not create a token or change a token value. It does not bring a handle to
resize by dragging: the field grows with the text and scrolls above
`layout/textarea-max-height`. It does not paint the counter in the error color:
the error stays on the border and on the `nph-field` message. It does not turn the
footer on in `state=leitura`.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, board `1632:24`, documentation `1922:642`, set
  `1632:22`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
