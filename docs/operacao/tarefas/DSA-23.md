```json
{
  "id": "DSA-23",
  "goal": "Implement the nph-toggle-group, the group of nph-togglebutton on the same subject in a toolbar, with the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 210,
  "owner": "elvys",
  "state": "in-review",
  "piece": "nph-toggle-group",
  "dependencies": [
    "DSA-22"
  ],
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
      "id": "D4",
      "question": "The evidence says not to mix buttons with text and icon-only buttons in the same group, but it does not say what the component does when someone does. The code renders the group and warns in the console in development. Does Indiane confirm the warning, or want the group not to render? It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-20"
    },
    {
      "id": "D5",
      "question": "The evidence does not ask for arrow keys inside the group and does not say whether the group is one Tab stop or one per button. The code keeps one Tab stop per button, with no arrow keys; a roving tabindex across groups would belong to a future toolbar. Does Indiane confirm? It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-20"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-23/documentacao-figma-aceita-2026-10-08.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-19.md, Indiane answered D1 to D3 of the nph-toggle-group"
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
    "branch": "claude/dsa-23-nph-toggle-group-5f3299",
    "commit": "484345871ffe9ad237bab17fa9f12ffb1bea4c04",
    "pr": "https://github.com/iatecbr/IATec.Nephos/pull/92"
  },
  "context": "docs/operacao/contextos/DSA-23.md",
  "updated_at": "2026-10-20"
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

## Decisions answered
D1 to D3 are answered in the evidence of the `figma-docs-accepted` gate, section
"Decisions answered". The group is made of `nph-togglebutton` instances; DSA-22
is `done`, so B1 is closed and the task is `ready`.

| ID | Answer | What the code does |
|---|---|---|
| D1 | Add six core icons, Font Awesome Pro 6.7.2: `align-left`, `align-center`, `align-right` for Alignment, and `bold`, `italic`, `underline` for Formatting. Like every core name, each has the `light` and `solid` variants; the examples use `light`. In Figma, the examples still show the `check` and `xmark` placeholders. | Adds the six names to `design.md`, block `icones_nucleo`, category `acao`, then to the closed map in `nph-icon.icons.ts` and to the `nph-icon` spec, both variants; the Alignment and Formatting stories use them. This task does it. |
| D2 | At least two buttons, with no maximum in code. Three is only the Figma set limit (`mostrar 3º`). With fewer than two buttons, the group still renders. | Accepts any number of buttons; with fewer than two buttons, it logs a warning to the console and renders anyway. |
| D3 | In single selection, one button is always checked once a choice is made. A click on the checked button does nothing. The group starts with the value it receives; with no value, none is checked until the first click. | The group coordinates single selection: it ignores a click on the checked button and does not require an initial value. |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## Pending decisions
The evidence gives the whole contract, so the code can start. Two points remain for Indiane; the code follows the stated default meanwhile, and the answer only adjusts one rule each.

| ID | What the evidence gives | What is missing | What the code does with the answer |
|---|---|---|---|
| D4 | A Do not: do not mix buttons with text and icon only in the same group. | What the component does when someone mixes them. | Warns in the console in development and renders. If the answer is not to render, the group follows the invalid-input rule. |
| D5 | Each button shows its own focus; the group does not receive focus. | Whether arrow keys move between the buttons, and whether the group is one Tab stop. | One Tab stop per button, no arrow keys. If the answer is a roving tabindex, the group takes it. |

## What this task does not do
It does not create a token or change a token value.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, frame `1580:61` and set `1580:60`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
