```json
{
  "id": "DSA-23",
  "goal": "Implement the nph-toggle-group, the group of nph-togglebutton on the same subject in a toolbar, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 210,
  "owner": "elvys",
  "state": "awaiting-decision",
  "piece": "nph-toggle-group",
  "dependencies": ["DSA-22"],
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
  "pending_decisions": [
    {
      "id": "D1",
      "question": "Which icons do the required Alignment and Formatting examples use? The nph-icon core has no align-*, bold, italic or underline: name the icons, or approve adding them to the core.",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D2",
      "question": "Is two or three buttons a code limit? Is a group with one button, or with four or more, invalid input, or only outside the Figma set?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D3",
      "question": "In single selection, can the checked button be unchecked, leaving none checked, and can the group start with none checked?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    }
  ],
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
  "updated_at": "2026-10-14"
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

## Pending decisions
The group is made of `nph-togglebutton` instances, so it depends on DSA-22 and inherits its pending decisions D1–D6 (radii, spacing, icon-only width, focus radii, fixed or chosen icon, motion). DSA-22 D5 blocks this group too: the Alignment and Formatting examples are icon-only with their own icons. The three decisions below are the group's own. Each answer goes into the evidence of the `figma-docs-accepted` gate; the task goes back to `ready` when all three are answered and DSA-22 is `done`.

| ID | What the evidence gives | What is missing | What the code does with the answer |
|---|---|---|---|
| D1 | Required examples Alignment and Formatting, icon only; no icon names. | The icons. The `nph-icon` core has none for alignment or text formatting. | Fills the stories and the spec; adding icons changes the `nph-icon` core and its spec. |
| D2 | `mostrar 3º`: the group shows two or three buttons; a single option uses `nph-togglebutton`. | Whether one button, or four or more, is invalid input in code. | Validates the number of buttons, or accepts any number. |
| D3 | Single selection: checking one unchecks the other. | Whether the checked button can be unchecked and whether the group may start with none checked. | Decides whether a click on the checked button is ignored and what the initial state requires. |

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
