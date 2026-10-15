```json
{
  "id": "DSA-28",
  "goal": "Implement the nph-field, which composes label, control, help text and error message of a form field, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 290,
  "owner": "elvys",
  "state": "awaiting-decision",
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
  "pending_decisions": [
    {
      "id": "D1",
      "question": "What does the information icon of the label show: the help text again, or its own text? What is the accessible name of the icon?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D2",
      "question": "Does the error line carry an icon? If it does, which nph-icon name, variant and size?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D3",
      "question": "Which text roles do the help text and the error message use? (proposal: help text/caption, error text/body-md)",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D4",
      "question": "Which colors do the help text and the error message use? (help color/muted-foreground; error status/error or status/error-foreground?)",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D5",
      "question": "Which space tokens separate label and control, control and message line, and the error icon and its text? Does the message line keep its height when empty?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D6",
      "question": "Does the field fill its container, or use layout/field-width? nph-select cites layout/input-width for the same context.",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D7",
      "question": "In a group of radios or checkboxes, are the options stacked or in a row, and with which gap between them?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D8",
      "question": "Does the field have a disabled state of its own? The nph-label spec says nph-field applies state/disabled-opacity to the whole control, but the field evidence has no disabled property.",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-28/documentacao-figma-aceita-2026-10-01.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens"
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
  "updated_at": "2026-10-14"
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

## Pending decisions
The evidence gives the parts of the field (label, control, help text, error message) and the rules of use, but not the content of the information icon, the error icon, the typography and colors of the help and error lines, the spacing, the width, the group layout or the disabled rule. Code does not fill these gaps; each answer goes into the evidence of the `figma-docs-accepted` gate, and the task goes back to `ready` when all eight are answered. How the field names and describes a control inside another shadow root is not a visual decision: it is a technical proposal for the PR, and it sets a contract for the controls of DSA-16, DSA-17, DSA-18 and DSA-29.

| ID | What the evidence gives | What is missing | What the code does with the answer |
|---|---|---|---|
| D1 | `ícone` shows the information icon in the label. | The text of its tooltip and its accessible name. | Passes `info` and `infoLabel` to `nph-label`, or reuses the help text. |
| D2 | The error message shows in the message line. | Whether the line has an icon, and which one. | Draws a decorative `nph-icon` before the error text, or none. |
| D3 | Nothing on typography of the help and error lines. | Their text roles. | Sets the typography of both lines. |
| D4 | Nothing on the color of the help and error lines. | Their colors. | Sets the color of both lines. |
| D5 | Nothing on spacing. | The gaps of the stack, and whether the empty message line keeps its height. | Sets the gaps and the minimum height of the message line. |
| D6 | Do not use the field as a box to gain space. | The width of the field. | Sets the inline size of the field. |
| D7 | The field names a group of radios or checkboxes. | The group layout and the gap between options. | Sets the layout of the control area in group mode. |
| D8 | Do not show an error on a disabled field. The `nph-label` spec says the field dims the whole control. | Whether the field has `disabled`. | Adds a `disabled` property, or leaves disabled to the control and corrects the `nph-label` spec. |

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
