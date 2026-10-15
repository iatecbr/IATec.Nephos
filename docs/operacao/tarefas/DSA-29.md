```json
{
  "id": "DSA-29",
  "goal": "Implement the nph-select, the field that opens a closed list of options to pick one, with its option and list, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 300,
  "owner": "elvys",
  "state": "awaiting-decision",
  "piece": "nph-select",
  "dependencies": ["DSA-24", "DSA-28"],
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
  "pending_decisions": [
    {
      "id": "D1",
      "question": "How far is the list from the trigger: flush (0) or a space/* gap, and which token?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D2",
      "question": "Does the list animate on open and close (motion/enter and motion/exit), and how: opacity only, or opacity and offset?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D3",
      "question": "What happens with long text in the trigger value, the option label and the secondary text: one line with ellipsis, wrap, or cut?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D4",
      "question": "What does the trigger show at the start before a choice when the options have icons (globe, a generic icon or nothing), and when the chosen option has a status dot?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D5",
      "question": "Does the keyboard-active option look like hover (color/accent)? When an option is selected and also hovered or active, which background wins?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D6",
      "question": "Which states does the status dot accept (are error, help and neutral in?), and is the dot a full circle (radius/full)?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D7",
      "question": "Is the divider inside the arrow area width or beside it, and is the arrow area height the trigger height minus the two borders?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D8",
      "question": "Do you confirm color/accent for the permanent arrow area and color/primary-surface for the selected option, beyond their current use in design.md, and the color/primary check over color/primary-surface if it measures below 3:1?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    },
    {
      "id": "D9",
      "question": "Does layout/max-list-height fit exactly 8 options with the list border outside it, and is it fine that options with an avatar show about 7?",
      "decider": "indiane",
      "opened_at": "2026-10-14"
    }
  ],
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

## Pending decisions
The evidence gives the trigger, the arrow area, the list, the option and their tokens in detail, but not the gap between trigger and list, the motion, long text, some start combinations, the active option, the status dot set, the arrow area geometry, two token uses and the fit of the list height. Code does not fill these gaps; each answer goes into the evidence of the `figma-docs-accepted` gate. The select uses `nph-avatar` (DSA-24) and sits inside `nph-field` (DSA-28), and its required examples need both, so it depends on them; the task goes back to `ready` when all nine are answered and both are `done`. Positioning, form value, events and keyboard are technical proposals for the PR.

| ID | What the evidence gives | What is missing | What the code does with the answer |
|---|---|---|---|
| D1 | The list is a floating layer attached to the trigger, same width. | The gap between trigger and list. | Sets the offset of the list. |
| D2 | Nothing on motion. `design.md` gives `motion/enter` and `motion/exit` for layers that appear. | Whether the list animates, and how. | Adds the open and close transition with reduced motion, or none. |
| D3 | Trigger and option text roles; the option takes the list width. | The rule for long text. | Sets overflow and wrapping of the value, label and secondary text. |
| D4 | The trigger repeats the start of the chosen option; start can be none, icon or avatar; default icon `globe`; options may have a status dot. | The trigger start before a choice, and with a chosen option that has a dot. | Decides what the trigger renders at the start in each case. |
| D5 | Option states `default`, `hover`, `selecionada`, `disabled`. | The look of the keyboard-active option and which background wins when combined. | Sets the active state and the cascade order. |
| D6 | Dot colors from `status/*` and `color/muted-foreground`; size `space/inline`. | The closed set of states and the dot shape. | Fixes the accepted values and the dot radius. |
| D7 | Arrow area width `control/height-*`, fitted into the border, with a divider. | Whether the divider is inside the area width, and the area height. | Sets the arrow area box. |
| D8 | Arrow area `color/accent`; selected option `color/primary-surface` with a `color/primary` check. | These uses are not in `design.md`, and the check contrast is not measured. | Nothing in the code; the answer widens the `use` in `design.md`, through Claude in Figma. |
| D9 | The list shows up to 8 options and scrolls above, by `layout/max-list-height`. | Whether the border is inside that height, and the count with avatar options. | Sets the maximum height of the list. |

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
