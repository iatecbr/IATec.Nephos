```json
{
  "id": "DSA-29",
  "goal": "Implement the nph-select, the field that opens a closed list of options to pick one, with its option and list, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 300,
  "owner": "elvys",
  "state": "ready",
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
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-29/documentacao-figma-aceita-2026-10-14.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-14.md, nph-select reopened with divider, arrow area, status dot and the open state; documentation accepted and textual audit approved",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-19.md, Indiane answered D1 to D9 of the nph-select"
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
  "updated_at": "2026-10-23"
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

## Decisions answered
D1 to D9 are answered in the evidence of the `figma-docs-accepted` gate, section
"Decisions answered". Both blockers are closed: B1 when DSA-24 (`nph-avatar`)
became `done`, and B2 on 2026-10-23, when DSA-28 (`nph-field`) became `done`
after the merge of PR #105. With every dependency `done`, the task is
`ready`. Positioning, form value, events and keyboard are technical proposals for
the PR.

| ID | Answer | What the code does |
|---|---|---|
| D1 | The list opens `space/inline-tight` (4 px) below the trigger. | Sets the list offset to `space/inline-tight`. |
| D2 | The list fades in and slides 4 px into place with `motion/enter-duration` and `motion/enter-easing`, and leaves with `motion/exit-duration` and `motion/exit-easing`. With reduced motion, opacity only. | Adds the open and close transition on opacity and transform; under `prefers-reduced-motion`, opacity only. |
| D3 | Trigger value, option label and secondary text stay on one line with an ellipsis at the end. They do not wrap. | Sets one line and `text-overflow: ellipsis` on the three texts. |
| D4 | Before a choice, with `início=ícone` the trigger shows the default start icon (`globe`); with `início=avatar`, the empty avatar. When the chosen option has a status dot, the trigger shows only the text: the trigger has no dot. | Renders the default start before a choice and no dot in the trigger. |
| D5 | The keyboard-active option looks like hover: `color/accent`, text in `color/accent-foreground`. A selected option keeps `color/primary-surface` and the check when it is also hovered or keyboard-active. | Gives the active option the hover look; the selected background wins over hover and keyboard-active. |
| D6 | The dot is a full circle (`radius/full`). It accepts every `status/*` state (info, warning, success, error, help) and the neutral state in `color/muted-foreground`. | Fixes the closed set of dot states (every `status/*` and neutral) and the full radius. |
| D7 | The divider sits beside the arrow area, outside its `control/height-*` width. The arrow area is as tall as the trigger minus its two borders. | Sets the arrow area box: divider plus area, area height inside the border. |
| D8 | `color/accent` for the permanent arrow area and `color/primary-surface` for the selected option are confirmed; `design.md` now lists both uses. Measured: the `color/primary` check on `color/primary-surface` is 4.78:1 (light) and 6.26:1 (dark); the arrow on `color/accent` is 5.76:1 and 5.11:1. | Nothing beyond the tokens already named. |
| D9 | `layout/max-list-height` (296 px) holds 8 options of 36 px plus the `space/inline-tight` padding. The list border is outside that height, so the list measures 298 px and shows 8 whole options. With avatar options (40 px), 7 whole options show and 8 px of the 8th. | Applies `layout/max-list-height` to the inside of the list, with the border outside it. |

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
