```json
{
  "id": "DSA-46",
  "goal": "Implement the nph-combobox, the field where the person types to filter a list of options and picks one, with its list, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 315,
  "owner": "elvys",
  "state": "in-review",
  "piece": "nph-combobox",
  "dependencies": ["DSA-03", "DSA-09", "DSA-11", "DSA-24", "DSA-28", "DSA-29", "DSA-40", "DSA-45"],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-combobox documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-46/documentacao-figma-aceita-2026-10-14.md",
      "result": "passed",
      "verified_at": "2026-10-14",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, list, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
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
      "id": "D-1",
      "question": "The evidence names the create row of the `criar` list, which offers the typed text as a new item, but does not draw it. The code draws it as an `nph-option` with the `plus` start icon and the text `create-label` followed by the typed text in quotes, the typed text in `text/highlight-weight`. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-26"
    },
    {
      "id": "D-2",
      "question": "The evidence says the `atalhos` footer shows the keys as `nph-kbd`, but not which keys, which words or the box of the footer. The code gives the footer a `shortcuts` slot the consumer fills, with a `color/border` line above it and `space/inline` around it. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-26"
    },
    {
      "id": "D-3",
      "question": "The evidence gives the `busca` list the rest of the text in `color/muted-foreground`, on the popover background. It does not say the color of that rest on the active option (`color/accent`). The code keeps `color/muted-foreground` there too. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-26"
    },
    {
      "id": "D-4",
      "question": "The evidence does not say what Escape does with the list closed. The code clears the typed text, as the APG suggests; with no typed text, Escape passes on. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-26"
    },
    {
      "id": "D-5",
      "question": "The evidence does not say which option is active while the person types. The code makes the first available match active, so Enter chooses it (automatic selection of the APG). It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-26"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-46/documentacao-figma-aceita-2026-10-14.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-14.md, modern nph-combobox: divider before the arrow area, arrow area in color/accent, the open state, status dot, check of the option in color/primary, text/highlight-weight; documentation accepted and textual audit approved",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-14.md and 2026-10-21.md, the nph-combobox tokens go with the nph-select ones; task DSA-46 opened on 21-10 (diary 2026-10-21.md) with the nph-empty and nph-dropdown-menu accepted"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1359-142",
    "date": "2026-10-14",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-combobox board (1359:142), with its `Documentação` frame (1766:2400), was accepted as the API and behavior specification of the nph-combobox. COMPONENT_SET 1359:115; list 1359:141; option 1357:136. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": {
    "branch": "claude/dsa-46-nph-combobox-43fc0a",
    "commit": "991d338b42ef245e6206ca85b4ef2ec9c918df07",
    "pr": "https://github.com/iatecbr/IATec.Nephos/pull/120"
  },
  "context": "docs/operacao/contextos/DSA-46.md",
  "updated_at": "2026-10-26"
}
```

# DSA-46 — nph-combobox, the field that filters a list and picks one option

## Goal
The `nph-combobox` exists in `src/components/nph-combobox/`, with its list, a
spec, tests and stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-46/documentacao-figma-aceita-2026-10-14.md`. It
carries the Figma documentation converted to text, with the field, the clear
button, the divider, the arrow area, the seven list states and the shortcuts
footer. There is no need to open Figma.

## Decisions
No question is open. The 14-10-2026 decisions are in the evidence, section
"Decisions of 14-10-2026 that shape the contract". Filtering, keyboard, form
value, events, the positioning of the list and the text read by the clear button
are technical proposals for the PR. The tag name is provisional.

## Why it was blocked
B1 waited for four tasks: `nph-field` (DSA-28), the option shared with
`nph-select` (DSA-29), the `nph-empty` (DSA-40) and the `nph-dropdown-menu`
(DSA-45). It closed on 2026-10-26, when DSA-45 became `done` after the merge of
PR #118; DSA-28 (PR #105), DSA-29 (PR #114) and DSA-40 (PR #100) were already
`done`. With every dependency `done`, the task is `ready`.

## Pending decisions
The evidence gives the contract, so the code can start. Five points remain for
Indiane; the code follows the stated default meanwhile, and each answer only
adjusts one rule.

| ID | What the evidence gives | What is missing | What the code does meanwhile |
|---|---|---|---|
| D-1 | The `criar` list offers the typed text as a new item. | The drawing of the create row. | An `nph-option` with the `plus` icon, `create-label` and the typed text in quotes, highlighted. |
| D-2 | The `atalhos` footer shows the keys as `nph-kbd`. | Which keys, which words, the box of the footer. | A `shortcuts` slot the consumer fills, a `color/border` line above, `space/inline` around. |
| D-3 | The rest of the text in `color/muted-foreground` in the `busca` list. | That color on the active option. | `color/muted-foreground` there too. |
| D-4 | Escape closes the open list. | Escape with the list closed. | Clears the typed text; with none, passes on. |
| D-5 | Typing filters the list. | Which option is active while typing. | The first available match, so Enter chooses it. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, list,
CSS, tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## Relations with other tasks
- The start icon, the arrow, the magnifying glass and the clear icon are
  `nph-icon` instances (DSA-03); the start avatar is an `nph-avatar` (DSA-24).
- The field sits inside `nph-field` (DSA-28), which gives the label, the help
  text and the error message.
- Each option is `nph-select / opção` (DSA-29), shared with the select. The list
  must reuse it, not copy it.
- The `vazio` list shows an `nph-empty` (DSA-40); the `carregando` list shows an
  `nph-spinner` (DSA-09); the `atalhos` footer uses `nph-kbd` (DSA-11); the
  `grupos` list uses the group label and the separator of the
  `nph-dropdown-menu` (DSA-45).
- The list is the one `nph-multi-combobox` reuses (DSA-31, D2). Build it so that
  another field can consume it.

## What this task does not do
It does not create a token or change a token value: `radius/control-inner`,
`layout/max-list-height` and `text/highlight-weight` are already on `v/5.0.0`.
It does not create a width property: the width comes from `layout/input-width`.
It does not pick several options: that belongs to `nph-multi-combobox`.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, board `1359:142`, documentation `1766:2400`, set
  `1359:115`, list `1359:141`, option `1357:136`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
