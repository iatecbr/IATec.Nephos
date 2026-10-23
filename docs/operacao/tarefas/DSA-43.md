```json
{
  "id": "DSA-43",
  "goal": "Bring the icon-only nph-button to the nph-icon-button contract accepted in Figma: add the circular shape and the required tooltip with the action name, and update the spec.",
  "phase": "F4",
  "approved_order": 440,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-button",
  "dependencies": [],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-icon-button documentation in Figma was accepted by Indiane, with the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-43/documentacao-figma-aceita-2026-10-20.md",
      "result": "passed",
      "verified_at": "2026-10-20",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and the nph-button spec pass the proof commands and are merged into v/5.0.0, after DSA-42 is done.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-43/review-and-merge-2026-10-23.md",
      "result": "passed",
      "verified_at": "2026-10-23",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [
    {
      "id": "D1",
      "question": "The evidence lists three demonstrations of what not to do: icon only on an action with a consequence (danger), an icon-only button without a tooltip (which the code does not let exist) and two buttons told apart only by color (info and warn). Do they go on the Docs page as negative examples, or stay only in the spec? Until the answer, they stay only in the spec. It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-23"
    },
    {
      "id": "D2",
      "question": "With keyboard focus on an icon-only button the balloon opens at once (DSA-48, rule 1), so inside a dialog the first Esc closes the balloon and not the dialog (P77 item 4); the second Esc closes the dialog. The code keeps it and records it as a known limit of P86. Does Indiane accept it? It does not block the pull request.",
      "decider": "indiane",
      "opened_at": "2026-10-23"
    }
  ],
  "evidence": [
    "docs/operacao/evidencias/DSA-43/documentacao-figma-aceita-2026-10-20.md",
    "docs/operacao/evidencias/DSA-43/review-and-merge-2026-10-23.md"
  ],
  "decision_refs": [
    "docs/decisoes-tecnicas.md#p86",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-19.md, Indiane wants square and circular shapes, disabled follows the Nephos opacity, outline stays, and every icon-only button carries a tooltip; visual, QA and documentation accepted",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-20.md, icon only is allowed in the actions column of a table; the Figma set is named nph-icon-button; textual audit approved"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=2122-1591",
    "date": "2026-10-20",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-icon-button documentation board (2122:1591) was accepted as the specification of the icon-only nph-button. COMPONENT_SET 498:15671, with the properties tipo, enfase, size, state, forma and the icon. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": {
    "branch": "claude/dsa-43-nph-icon-button-91e130",
    "commit": "cbe122faae16c3906d920e4e1d804b5e1629f9ae",
    "pr": "103"
  },
  "context": null,
  "updated_at": "2026-10-23"
}
```

# DSA-43 — nph-icon-button, the icon-only button

## Goal
The icon-only `nph-button` in `src/components/nph-button/` follows the
`nph-icon-button` contract accepted in Figma: it gains the circular shape and
always carries a tooltip with the action name. Its spec `fichas/nph-button.md`,
tests and stories follow the same contract.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-43/documentacao-figma-aceita-2026-10-20.md`. It
carries the Figma documentation converted to text, with the tokens of each part.
There is no need to open Figma.

## What changes in the code
In Figma the icon-only button is its own set, `nph-icon-button`. In code it
stays the `nph-button` without text: no new tag.

| Today on `v/5.0.0` | Now (this task) |
|---|---|
| Icon-only: one `icon-start` or `icon-end` and a required `label`, which becomes `aria-label` | Unchanged |
| Corners fixed on `--nph-radius-control` | Square (default) on `--nph-radius-control`, or circular on `--nph-radius-full`; the focus border and halo follow the circular corners |
| Disabled by `--nph-state-disabled-opacity` | Unchanged, in both shapes |
| No tooltip | Every icon-only button shows an `nph-tooltip` with the action name, on hover and on focus |
| Spec covers text and icon-only | Spec gains the shape, the tooltip rule and the actions column of a table |
| Spec forbids icon only on an action with consequence (in the summary, the `danger` row, the `severity` table and the do-not list) | Icon only on an action with consequence, such as delete, is allowed only in the actions column of a table, with the tooltip giving the name; elsewhere, write the text |

The attribute name of the shape is part of the code API (English, P64): it is
`shape`, `square` or `circular` (P86). The task `piece` is `nph-button`, the tag
and the spec of the code; `nph-icon-button` is the name of the Figma set. The shape changes neither the size nor the touch
target.

## Why it is ready
Every token it uses is on `v/5.0.0` with the same value as Figma
(`--nph-radius-full` is `9999px`, `--nph-radius-control` is `6px`,
`--nph-state-disabled-opacity` is `0.5`); no token is created or changed. The
circular shape can be built now. DSA-42 is done (PR #94), so the tooltip part
can start: the `nph-tooltip` now opens on hover and on keyboard focus for any
element. Do not build hover or focus opening inside the
`nph-button`; use the contract DSA-42 delivers, where it is defined how an
element attaches the balloon in code. The `review-and-merge` gate of this task
passes only with DSA-42 in `done`.

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and `fichas/nph-button.md` pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`, after
DSA-42 is done.

## Relations with other tasks
- DSA-42 is done (PR #94), so the tooltip part of this task can start. It updated the `nph-tooltip` to open on hover and on focus for
  any element; the tooltip of the icon-only button follows that contract.
- The `nph-button` with text does not change in this task.

## What this task does not do
It does not create a token or change a token value. It does not change Figma.
It does not create a new tag.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, board `2122:1591` and set `498:15671`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md` and `fichas/nph-button.md`
- `src/components/nph-button/`
