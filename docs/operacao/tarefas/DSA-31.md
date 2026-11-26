```json
{
  "id": "DSA-31",
  "goal": "Implement the nph-multi-combobox, the field where the person searches a closed list and picks several options shown as chips, with its internal chip, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 320,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-multi-combobox",
  "dependencies": ["DSA-03", "DSA-12", "DSA-17", "DSA-28", "DSA-29", "DSA-46"],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-multi-combobox documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-31/documentacao-figma-aceita-2026-10-15.md",
      "result": "passed",
      "verified_at": "2026-10-15",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, chip, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-31/review-and-merge-2026-10-26.md",
      "result": "passed",
      "verified_at": "2026-10-26",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-31/documentacao-figma-aceita-2026-10-15.md",
    "docs/operacao/evidencias/DSA-31/review-and-merge-2026-10-26.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-15.md, pill chip and chip start icon decided; documentation accepted and textual audit approved",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-15.md, D1, D2 and D3 answered by Indiane",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-23.md (15:0x), lot A of the pending decisions of the v1 closing: Indiane answered D-2 in the chat, as recommended, after market research with sources",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-26.md, approval round 3 of the pending items (2026-11-26 08:18): the design owner accepted the recommended option of D-1, D-3, D-4, after market research with sources"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1467-25660",
    "date": "2026-10-15",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-multi-combobox frame (1467:25660) was accepted as the API and behavior specification of the nph-multi-combobox. COMPONENT_SET 1467:25652; chip 1467:24879; the nph-combobox list 1359:141 with the nph-select option 1357:136. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": { "branch": "claude/dsa-31-nph-multi-combobox-4b7aff", "commit": "3f633ba3aedce3f8ce9c49bf935a44b38d10f319", "pr": "125" },
  "context": null,
  "updated_at": "2026-11-26"
}
```

# DSA-31 — nph-multi-combobox, the field that picks several options as chips

## Goal
The `nph-multi-combobox` exists in `src/components/nph-multi-combobox/`, with
its internal chip, a spec, tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-31/documentacao-figma-aceita-2026-10-15.md`. It
carries the Figma documentation converted to text, including the pill chip
(`radius/full`, `color/primary-surface`, `color/primary-on-surface`), its
`ícone início` and `⮑ ícone` properties and the counter. There is no need to
open Figma.

## Decisions answered
D1 to D3 are answered; the answers are in the evidence of the
`figma-docs-accepted` gate, section "Decisions answered". The list comes from the `nph-combobox` task, DSA-46,
which is `done` (PR #120), as are the other dependencies. Keyboard, form value,
events and the text read by the remove button are technical proposals for the
PR.

| ID | Answer | What the code does |
|---|---|---|
| D1 | The line of text says the subject of the field, as in “Countries”, and the counter says how many are chosen. | Renders a subject text before the counter; it does not change with each choice. |
| D2 | The list is built once, in the `nph-combobox` task; this task reuses it. | Does not build its own list; it consumes the `nph-combobox` list. |
| D3 | A long chip label stays on one line with an ellipsis; the chip stops before the end of the field. The full name is in the list. | Sets one line, `text-overflow: ellipsis` and a maximum chip width inside the field. |

## Pending decisions
Answered on 2026-11-26: see the section below.

## Decision answered on 2026-11-23
Indiane answered D-2 in the chat on 2026-11-23, in lot A of the pending decisions of the v1 closing, as recommended, after market research with sources.

| ID | Answer | What the code does |
|---|---|---|
| D-2 | Accepted: in counter mode, with nothing chosen, the field shows the placeholder, as `conteúdo=placeholder`; the subject and the counter come from the first choice on. It follows the placeholder mode of the field itself and avoids a counter at 0. | Nothing changes. |

## Decision answered on 2026-11-26
Indiane answered D-1, D-3, D-4 on 2026-11-26, in the approval round of the pending items, as recommended, after market research with sources.

| ID | Answer | What the code does |
|---|---|---|
| D-1 | Option 1: [checkbox] [icon] text, the checkbox before the icon, as in `nph-dropdown-menu`. Carbon puts the checkbox on the left of the text (https://carbondesignsystem.com/components/dropdown/usage/ ). | Nothing changes. Figma already draws it (node 1467:947). |
| D-3 | Option 2: the chip of an option without icon shows text only, with `space/inline` (8) at the start. In Carbon the chip icon is decorative and optional (https://carbondesignsystem.com/components/tag/usage/ ). | The chip stops showing the `tag` icon when the option has no icon. Figma already draws it (node 1467:24861). |
| D-4 | Option 1: in counter mode the search stays after the counter, on the same line. Same Carbon dropdown source as D-1. | Nothing changes. Figma does not draw typing in counter mode (node 1758:32140); nothing to update. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, chip,
CSS, tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## Relations with other tasks
- The magnifying glass, the arrow, the remove icon and the chip start icon are
  `nph-icon` instances (DSA-03). The counter is an `nph-badge` (DSA-12).
- Each list option uses `marcador=checkbox`, with an `nph-checkbox` instance
  (DSA-17).
- The field sits inside `nph-field` (DSA-28), which gives the label, the help
  text and the error message.
- The option (`nph-select / opção`) comes from `nph-select` (DSA-29); the list
  (`nph-combobox / lista`) comes from the `nph-combobox` task, DSA-46 (D2, B1).

## What this task does not do
It does not create a token or change a token value. It does not create a width
property: the width comes from `layout/multi-combobox-width`, and on the screen
the instance stretches to the width of the form. It does not put an avatar in
the chip and does not accept free text: that belongs to `nph-input`.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, board `1467:25660`, set `1467:25652`, chip
  `1467:24879`, list `1359:141`, option `1357:136`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
