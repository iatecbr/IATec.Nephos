```json
{
  "id": "DSA-39",
  "goal": "Implement the nph-slider, the control that picks a value or a range on a continuous scale of numbers, in the contract accepted in Figma, and write its spec.",
  "phase": "F4",
  "approved_order": 400,
  "owner": "elvys",
  "state": "done",
  "piece": "nph-slider",
  "dependencies": ["DSA-03", "DSA-04", "DSA-08", "DSA-13", "DSA-16", "DSA-28"],
  "gates": [
    {
      "id": "figma-docs-accepted",
      "description": "The nph-slider documentation in Figma was accepted by Indiane, with the Figma UX QA and the textual audit approved, and its tokens are on v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-39/documentacao-figma-aceita-2026-10-15.md",
      "result": "passed",
      "verified_at": "2026-10-15",
      "verified_by": "indiane"
    },
    {
      "id": "review-and-merge",
      "description": "Component, CSS, tests, stories and spec pass the proof commands and are merged into v/5.0.0.",
      "command": null,
      "evidence": "docs/operacao/evidencias/DSA-39/review-and-merge-2026-10-24.md",
      "result": "passed",
      "verified_at": "2026-10-24",
      "verified_by": "claude-code"
    }
  ],
  "blockers": [],
  "pending_decisions": [],
  "evidence": [
    "docs/operacao/evidencias/DSA-39/documentacao-figma-aceita-2026-10-15.md",
    "docs/operacao/evidencias/DSA-39/review-and-merge-2026-10-24.md"
  ],
  "decision_refs": [
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-08.md, Elvys writes component code and specs; Claude takes only tokens",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-15.md, slider modernization accepted, Figma UX QA approved, documentation accepted and textual audit approved",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-10-16.md, Indiane sends the nph-slider to code",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-23.md (15:0x), lot A of the pending decisions of the v1 closing: Indiane answered D2 in the chat, as recommended, after market research with sources",
    "WORK BRAIN — 03 MEMÓRIA/diario/2026/2026-11-26.md, approval round 3 of the pending items (2026-11-26 08:18): the design owner accepted the recommended option of D1, D3, D4, D5, after market research with sources"
  ],
  "external_origin": {
    "classification": "internal-allowed",
    "url_or_id": "https://www.figma.com/design/UuhW1qPkdkdQ6IAjOsxOua/DS-IA-NEPHOS-5.0?node-id=1636-46",
    "date": "2026-10-15",
    "author": "indiane",
    "excerpt": null,
    "converted_decision": "The nph-slider board (1636:46), with its documentation frame (1925:642), was accepted as the API and behavior specification of the nph-slider. COMPONENT_SET 1636:44. The specification, converted to text, is in the evidence of the figma-docs-accepted gate."
  },
  "git_review": {
    "branch": "claude/dsa-39-nph-slider-0eb846",
    "commit": "477e86e8c2f978391f61d1722431476d35a02960",
    "pr": "https://github.com/iatecbr/IATec.Nephos/pull/112"
  },
  "context": null,
  "updated_at": "2026-11-26"
}
```

# DSA-39 — nph-slider, the control that picks a value or a range

## Goal
The `nph-slider` exists in `src/components/nph-slider/`, with a spec, tests and
stories, in the contract accepted in Figma.

## Where the contract is
In the evidence of the `figma-docs-accepted` gate:
`docs/operacao/evidencias/DSA-39/documentacao-figma-aceita-2026-10-15.md`. It
carries the Figma documentation converted to text, with the tokens of each part
and of each state. There is no need to open Figma.

## Why it was blocked
The optional `campo` is an `nph-input` instance (DSA-16), and the error state is
shown only inside `nph-field` (DSA-28). Both are `done` (DSA-16 after the merge of
PR #99, DSA-28 after the merge of PR #105), so B1 is closed and the task is
`ready`. Value, limits, step, keyboard, form value and events are technical
proposals for the PR.

## Decision answered on 2026-11-23
Indiane answered D2 in the chat on 2026-11-23, in lot A of the pending decisions of the v1 closing, as recommended, after market research with sources.

| ID | Answer | What the code does |
|---|---|---|
| D2 | Accepted: in `tipo=intervalo`, minus and plus move the thumb used or focused last, the start one by default. In the APG each thumb of a range slider has its own focus; moving the last one used respects it (https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/ ). | Nothing changes. |

## Decision answered on 2026-11-26
Indiane answered D1, D3, D4, D5 on 2026-11-26, in the approval round of the pending items, as recommended, after market research with sources.

| ID | Answer | What the code does |
|---|---|---|
| D1 | Option 1: keep the order `[start field] [minus] [minimum] track [maximum] [plus] [end field]`. Carbon keeps the limits next to the track and the field at the end (https://carbondesignsystem.com/components/slider/usage/ ). | Nothing changes. Figma updated on 2026-11-26: set 1636:44, the variants with a field. |
| D3 | Option 1: the vertical track is `layout/input-width` (280) tall, symmetric with the horizontal one, with no new token. Material and Ant do not fix a height (https://mui.com/material-ui/react-slider/ ). | Nothing changes. Figma already draws it (node 1911:491). |
| D4 | Option 2: labels only at the values the user chooses (for example 0, 25, 50, 75, 100). MUI and Ant let the user pick the subset (https://mui.com/material-ui/react-slider/ ). | A new property chooses the labelled values; the code owner adds it. Figma already draws it (marks 1911:46). |
| D5 | Option 1: keep one part for the field and three for the track (68 and 204 in 280). It needs no new token and is close to the 64 of Carbon (https://raw.githubusercontent.com/carbon-design-system/carbon/main/packages/styles/scss/components/slider/_slider.scss ). | Nothing changes. Figma updated on 2026-11-26: the examples 1911:38781 and 1911:38783 draw the field at one part and the track at three (instances 1911:38781 and 1911:38783 hug the field). |

## How it is proved
**`figma-docs-accepted`** — passed. **`review-and-merge`** — component, CSS,
tests, stories and spec pass the proof commands in
`docs/operacao/component-handoff.md` and are merged into `v/5.0.0`.

## Pending decisions
Answered on 2026-11-26: see the section below.

## Relations with other tasks
- The value balloon is an `nph-tooltip` (DSA-08).
- `rótulo e valor` uses an `nph-label` (DSA-04).
- `menos e mais` are icon-only `nph-button` instances (DSA-13), with `nph-icon`
  `minus` and `plus` (DSA-03).
- `campo` is an `nph-input` (DSA-16).
- The error state sits inside `nph-field` (DSA-28), which gives the label, the
  help text and the error message.

## What this task does not do
It does not create a token or change a token value: every token the slider uses
is already on `v/5.0.0`. It does not create a size property. It does not show
progress: that is a progress bar, which is not operated.

## Sources
- Figma `DS-IA-NEPHOS 5.0`, board `1636:46`, frame `1925:642`, set `1636:44`
- `design.md` — the tokens named in the evidence
- `fichas/_modelo.md`
