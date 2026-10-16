```json
{
  "id": "DSA-28",
  "goal": "Implement the nph-field, which composes label, control, help text and error message of a form field, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 290,
  "owner": "elvys",
  "state": "ready",
  "piece": "nph-field",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-field documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-28/documentacao-figma-aceita-2026-10-01.md",
      "result": "passed",
      "verified_at": "2026-10-02",
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
    "docs/operacao/evidencias/DSA-28/documentacao-figma-aceita-2026-10-01.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-16.md, Indiane answered D1 to D8 of the nph-field"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1194-21863",
    "date": "2026-10-01",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-field frame (1194:21863) was accepted as the API and behavior specification of the nph-field. COMPONENT_SET 657:50. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": {
    "branch": null,
    "commit": null,
    "pr": null
  },
  "context": null,
  "updated_at": "2026-10-16"
}
```

# DSA-28 — nph-field, the form field

## Goal
The `nph-field` exists in `src/components/nph-field/`, with a spec,
tests and stories, in the contract accepted in Figma.

Its default control is `nph-input` (DSA-16).

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-28/documentacao-figma-aceita-2026-10-01.md`. It
carries the Figma documentation converted to text. There is no need to open Figma.

## Decisions answered
D1 to D8 are answered; the answers and the measures read from Figma are in the
evidence of the `figma-docs-accepted` gate, sections "Measures and tokens" and
"Decisions answered". How the field names and describes a control inside another
shadow root is not a visual decision: it is a technical proposal for the PR, and it
sets a contract for the controls of DSA-16, DSA-17, DSA-18 and DSA-29.

| ID | Answer | What the code does |
|---|---|---|
| D1 | Own text `info`, opened in `nph-tooltip`; accessible name `infoLabel`. | Passes `info` and `infoLabel` to `nph-label`. |
| D2 | No icon on the error line. | Renders only the error text. |
| D3 | Help `text/caption`; error `text/body-md`. | Sets the typography of both lines. |
| D4 | Help `color/muted-foreground`; error `status/error`. | Sets the color of both lines. |
| D5 | `space/stack-tight` in the stack, `space/inline-tight` label to icon; the empty line keeps no height. | Sets the gaps and does not render an empty message line. |
| D6 | Default `layout/field-width`; may stretch to its container; the control fills the field. | Sets the inline size of the field and lets the control fill it. |
| D7 | Stacked, `space/stack-tight` between options. | Sets the layout of the control area in group mode. |
| D8 | The field has `disabled`; opacity only on the control; disabled wins over error. | Adds a `disabled` property passed to the control. |

The field also has the counter decided on 15-10-2026; see the evidence.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1194:21863` and set `657:50`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
