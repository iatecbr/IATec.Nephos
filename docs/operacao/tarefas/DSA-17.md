```json
{
  "id": "DSA-17",
  "goal": "Implement the nph-checkbox, the checkbox with its own text, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 270,
  "owner": "elvys",
  "state": "awaiting-decision",
  "piece": "nph-checkbox",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-checkbox documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-17/documentacao-figma-aceita-2026-10-01.md",
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
      "question": "Which size and variant does the check or minus mark use inside the 16 x 16 box? icon/size-sm is 16, the whole box; light or solid?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D2",
      "question": "Which colors does the box take in each state: fill and border when checked and indeterminate, hover, erro (status/error or color/destructive), erro when checked, disabled, and the text color?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D3",
      "question": "Is the focus a ring (focus-ring/default) or border plus halo around the box, with which radii? In erro-foco, focus-ring/invalid or status/error with focus/halo-error?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D4",
      "question": "Which tokens give the 16 x 16 box and the 24 x 24 touch area? No token holds these values for a box today.",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D5",
      "question": "Is the space/inline gap measured from the box edge or from the 24 x 24 area? How does the box align with text that wraps to two lines?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D6",
      "question": "Is a consent text with a link out of scope, with the text in a plain text property, or does the checkbox take rich content?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-17/documentacao-figma-aceita-2026-10-01.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1194-1033",
    "date": "2026-10-01",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-checkbox frame (1194:1033) was accepted as the API and behavior specification of the nph-checkbox. COMPONENT_SET 740:18776. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
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

# DSA-17 — nph-checkbox, the checkbox

## Goal
The `nph-checkbox` exists in `src/components/nph-checkbox/`, with a spec,
tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-17/documentacao-figma-aceita-2026-10-01.md`. It
carries the Figma documentation converted to text. There is no need to open Figma.

## Pending decisions
The evidence gives the box size and radius, the rest border, the marks, the text role, the touch area and the gap to the text, but not the colors of each state, the mark size, the focus tokens or the tokens for the box measures. Code does not fill these gaps; each answer goes into the evidence of the `figma-docs-accepted` gate, and the task goes back to `ready` when all six are answered.

| ID | What the evidence gives | What is missing | What the code does with the answer |
|---|---|---|---|
| D1 | Mark `check` or `minus` in `color/primary-foreground`. | The mark size inside a 16 × 16 box and its variant. | Sets size and variant of the inner `nph-icon`. |
| D2 | Box border `color/input` at rest. | Fill and border when checked or indeterminate, hover, error, checked with error, disabled, and text color. | Writes the color table per state. |
| D3 | The focus ring shows around the box; `erro-foco` keeps it. | Ring or border plus halo, the radii, and the error focus tokens. | Picks the focus tokens and radii. |
| D4 | Box 16 × 16; touch area 24 × 24. | Tokens for both measures. | Sets the box and target sizes from tokens. |
| D5 | `space/inline` to the text. | Where the gap is measured from, and the alignment with wrapping text. | Sets gap and vertical alignment. |
| D6 | Required example "Consent". | Whether a link in the text is in scope. | Keeps a plain text property, or opens rich content. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## What this task does not do
It does not create a token or change a token value.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1194:1033` and set `740:18776`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
